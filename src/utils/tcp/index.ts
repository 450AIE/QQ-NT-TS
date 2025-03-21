/* eslint-disable @typescript-eslint/ban-types */
import net from 'net'
import { CMD } from '../../main/types/protobuf'
import { decodeDataBuffer, makeDataProtoBuf } from '../../main/utils/protobuf/protobuf'

// 计算buffer的长度在头部拼接一个4byte的表示文件大小的头部信息，并
// 返回整个拼接后的buffer
// export function createProtobufPackage(buffer: Buffer) {
//     const len = buffer.length
//     const head = Buffer.alloc(4)
//     head.writeUint32BE(len, 0)
//     return Buffer.concat([head, buffer])
// }

type ClientID = BigInt

export interface CacheBuffer {
    // 这个数据包的重传次数
    retryTimes: number
    // 数据包的内部信息
    buffer: Buffer
}

export class Connection {
    // 当前连接id
    connId: number
    // 当前用户id
    userId: string
    tcp: net.Socket
    // 记录每个用户的sessionId（与用户A单聊，用户A的user_id就是sessionId），与该用户对话要从这个client递增使用
    // 也记录了群聊
    sessionIdToClientMap: Map<string, string>
    /**
     * 第一个string是根据双方用户id，或者群聊所有用户算出的唯一string，第二个map是表示序号为
     * clientId的数据包的信息。缓存的Uplink发送的数据包
     */
    cacheMap: Map<string, Map<ClientID, CacheBuffer>>
    // 登陆消息的缓存buffer。注意用户点击登陆后在收到之前禁用登陆按钮，
    // 避免到达的顺序错误
    loginCache: CacheBuffer
    // 重连缓存
    reconnCache: Buffer
    constructor(HOST: string = '47.120.6.54', PORT: number = 8001) {
        this.initTCP(HOST, PORT)
        // this.tcp = new net.Socket()
        // this.cacheMap = new Map()
        // this.sessionIdToClientMap = new Map()
        // 连接
        // this.tcp.connect(PORT, HOST, () => {
        //     console.log('连接成功')
        // })
        // // 监听数据
        // this.tcp.on('data', (buffer) => {
        //     this.receive(buffer)
        // })
        // // 监听断开连接
        // this.tcp.on('close', () => {
        //     console.log('断开连接')
        // })
        // 自动心跳
        // setInterval(() => {
        //     const buffer = makeDataProtoBuf(CMD.Heartbeat, { heartbeatBody: null })
        //     this.tcp.write(this.createProtobufPackage(buffer))
        // }, 5000)
    }
    // payload是对象
    send(cmd: CMD, payload: any) {
        // console.log('收到的payload:', payload)
        // payload = JSON.parse(payload)
        // 这些的send传递的就是data部分，要在send函数中拼接头部长度信息
        switch (cmd) {
            case CMD.Login:
                this.sendLoginMsg(payload)
                break
            case CMD.Uplink:
                if (payload.type === 'user') {
                    // 更新sessionIdToClientMap的clientId值，保证递增
                    if (!this.sessionIdToClientMap.has(payload.sessionId)) {
                        this.sessionIdToClientMap.set(payload.sessionId, 0)
                    } else {
                        this.sessionIdToClientMap.set(
                            payload.sessionId,
                            this.sessionIdToClientMap.get(payload.sessionId) + 1
                        )
                    }
                } else if (payload.type === 'group') {
                    payload.sessionId = setHighestBitToOne(payload.sessionId)
                    // 更新sessionIdToClientMap的clientId值，保证递增
                    if (!this.sessionIdToClientMap.has(payload.sessionId)) {
                        this.sessionIdToClientMap.set(payload.sessionId, 0)
                    } else {
                        this.sessionIdToClientMap.set(
                            payload.sessionId,
                            this.sessionIdToClientMap.get(payload.sessionId) + 1
                        )
                    }
                }
                payload = {
                    ...payload,
                    clientId: this.sessionIdToClientMap.get(payload.sessionId)
                }
                this.sendUplinkMsg(payload)
                break
                // case CMD.Downlink:
                //     this.sendDownlinkMsg(payload)
                break
            case CMD.Reconn:
                this.sendReconnMsg(payload)
                break
            case CMD.Ack:
                this.sendAckMsg(payload)
                break
        }
    }
    // 处理收到的数据
    receive(buffer: Buffer) {
        // protobuf反序列化
        const data = decodeDataBuffer(buffer.subarray(4))
        const { cmd, payload } = data
        // 根据cmd分发处理
        //  服务器推送过来的只有ACK和Downlink
        switch (cmd) {
            // 收到ACK处理
            case CMD.Ack:
                this.processAckMsg(payload)
                break
            case CMD.Downlink:
                this.processDownlinkMsg(payload)
                break
        }
    }
    initTCP(HOST: string = '47.120.6.54', PORT: number = 8001) {
        this.tcp = new net.Socket()
        // 全部刷新清空吗?
        this.cacheMap = new Map()
        this.sessionIdToClientMap = new Map()
        // 连接
        this.tcp.connect(PORT, HOST, () => {
            console.log('连接成功')
        })
        // 监听数据
        this.tcp.on('data', (buffer) => {
            this.receive(buffer)
        })
        // 监听断开连接
        this.tcp.on('close', () => {
            console.log('断开连接')
        })
        // 自动心跳
        setInterval(() => {
            const buffer = makeDataProtoBuf(CMD.Heartbeat, { heartbeatBody: null })
            this.tcp.write(this.createProtobufPackage(buffer))
        }, 5000)
    }
    // 发送登陆数据
    sendLoginMsg(payload: any) {
        const { userId } = payload
        this.userId = userId
        let buffer = makeDataProtoBuf(CMD.Login, payload)
        buffer = this.createProtobufPackage(buffer)
        this.loginCache = this.createCacheBuffer(buffer)
        this.tcp.write(buffer)
        // 超时重传
        setTimeout(() => {
            // loginCache还存在，说明没收到ACK，继续发
            if (this.loginCache) {
                this.sendLoginMsg(payload)
                this.loginCache.retryTimes++
                if (this.loginCache.retryTimes > 3) {
                    this.reconnect()
                }
            } else {
                // 已经收到ACK了，不执行
            }
        }, 5000)
    }
    // 群聊或者用户id，群聊id的最高位为1
    sendUplinkMsg(payload: any) {
        const textEncoder = new TextEncoder()
        // 1. 提取信息
        let { userId, sessionId, clientId, uplinkBody } = payload
        clientId = BigInt(clientId)
        const newPayload = {
            ...payload,
            sessionId,
            uplinkBody: textEncoder.encode(uplinkBody)
        }
        console.log('发送的Uplink', payload)
        // 2. protobuf序列化，打包
        let buffer = makeDataProtoBuf(CMD.Uplink, newPayload)
        buffer = this.createProtobufPackage(buffer)
        // 3. 缓存起来，便于重传
        const uniqueKey = this.generateUniqueKey([String(userId), String(sessionId)])
        // if (type === 'group') {
        // uniqueKey = this.generateUniqueKey([String(sessionId)])
        // }
        // 不存在就创建，存在就加入
        if (!this.cacheMap.has(uniqueKey)) {
            const clientBufferMap = new Map()
            clientBufferMap.set(clientId, this.createCacheBuffer(buffer))
            this.cacheMap.set(uniqueKey, clientBufferMap)
        } else {
            const clientBufferMap = this.cacheMap.get(uniqueKey)
            clientBufferMap.set(clientId, this.createCacheBuffer(buffer))
        }
        // 4.发送
        this.tcp.write(buffer)
        // console.log('cacheMap', this.cacheMap)
        // 开启定时器，超时重传
        // setTimeout(() => {
        //     // 获取这两个用户对话之间的所有buffer
        //     const bufferMap = this.cacheMap.get(uniqueKey)
        //     // 缓存中仍然存在这个数据包，说明需要重传
        //     if (bufferMap && bufferMap.has(clientId)) {
        //         this.sendUplinkMsg(payload)
        //         console.log('uplink超时重传')
        //         const cacheBuffer = bufferMap.get(clientId)
        //         cacheBuffer.retryTimes++
        //         // 重传3次还没收到，断开重新连接
        //         if (cacheBuffer?.retryTimes > 3) {
        //             // // 断开tcp
        //             // this.tcp.end()
        //             // // 重新初始化连接
        //             // this.initTCP()
        //             // // 发送重连信息
        //             // this.send(CMD.Reconn, { reconnBody: null })
        //             this.reconnect()
        //         }
        //     } else {
        //         // 数据包不见了，说明已经收到对应的ACK了
        //         console.log('收到了')
        //     }
        // }, 5000)
    }
    // 发送心跳
    sendHeartBeat(payload: any) {
        let buffer = makeDataProtoBuf(CMD.Heartbeat, payload)
        buffer = this.createProtobufPackage(buffer)
        this.tcp.write(buffer)
    }
    // 多次超时重传都未收到ACK，断开TCP重新连接，并且发送重连消息
    private reconnect() {
        // 断开tcp
        this.tcp.end()
        console.log('断开TCP进行重连')
        // 重新初始化连接
        this.initTCP()
        // 发送重连信息
        this.send(CMD.Reconn, { reconnBody: null })
    }
    // 收到了下行消息，返回ACK
    sendAckMsg(payload: any) { }
    // sendDownlinkMsg(payload: any) { }
    sendReconnMsg(payload: any) {
        let buffer = makeDataProtoBuf(CMD.Reconn, payload)
        buffer = this.createProtobufPackage(buffer)
        // 缓存
        this.reconnCache = buffer
        this.tcp.write(buffer)
        setTimeout(() => {
            if (this.reconnCache) {
                // 超时重传
                this.sendReconnMsg(payload)
            } else {
                // 收到ACK了
            }
        }, 1500)
    }
    // 这个ACK是处理上行消息的，要清除对应缓存
    private processUplinkMsg(payload: any) {
        // console.log('ACK转换前的sessionId', payload.sessionId)
        let { sessionId, clientId } = payload
        // console.log('session', sessionId)
        // 先转换为int64
        clientId = this.transInt64ToBigInt(clientId)
        sessionId = this.transInt64ToBigInt(sessionId)
        // console.log('ACK转换后的sessionId', sessionId)
        let uniqueKey
        // 是群聊
        if (isGroupUplink(sessionId)) {
            console.log('group', sessionId)
            uniqueKey = this.generateUniqueKey([String(sessionId), String(this.userId)])
        } else {
            // 不是群聊
            console.log('user', sessionId)
            uniqueKey = this.generateUniqueKey([String(sessionId), String(this.userId)])
        }
        // 找到对应缓存清除
        // const uniqueKey = this.generateUniqueKey([String(sessionId), String(this.userId)])
        const clientBufferMap = this.cacheMap.get(uniqueKey)
        // console.log('找到', clientBufferMap)
        // console.log('uniqueKey', uniqueKey)
        // console.log('clientId', clientId)
        // 存在缓存，删掉
        if (clientBufferMap && clientBufferMap.has(clientId)) {
            clientBufferMap.delete(clientId)
            console.log('删掉Uplink缓存')
        }
    }
    // 收到ACK，这里的body是已经protobuf反序列化了的payload。删除对应缓存的消息
    processAckMsg(body: any) {
        console.log('收到ACK的payload', body)
        // const len = buffer.readUInt32BE(0)
        const { toType } = body
        // 根据toType可以得知它是什么数据的ACK
        switch (toType) {
            // 收到的ACK是回应Login的
            case CMD.Login:
                this.processLoginMsg(body)
                break
            // 收到的ACK是回应Uplink的
            case CMD.Uplink:
                this.processUplinkMsg(body)
                break
        }
    }
    private processDownlinkMsg(payload: any) { }
    private processLoginMsg(body: any) {
        const { connId } = body
        this.connId = connId
        // 清除登陆缓存
        this.loginCache = null
        console.log('删掉login缓存')
    }
    private processReconnMsg(payload: any) {
        // 收到ACK了，清除对应的重连消息缓存
        this.reconnCache = null
        console.log('重连消息携带的信息', payload)
    }
    createProtobufPackage(buffer: Buffer) {
        const len = buffer.length
        const head = Buffer.alloc(4)
        head.writeUint32BE(len, 0)
        return Buffer.concat([head, buffer])
    }
    // readProtobufPayload(buffer: Buffer) { }
    // 根据所有的id计算出一个key
    generateUniqueKey(ids: string[]) {
        // 去重
        const uniqueArr = Array.from(new Set(ids))
        // 排序
        uniqueArr.sort()
        // 拼接
        return uniqueArr.join('-')
    }
    // 将收到的Go的int64转换为BigInt的完整值
    private transInt64ToBigInt(data) {
        const { low, high, unsigned } = data
        const bigLow = BigInt(low)
        const bigHigh = BigInt(high)
        const shift = BigInt(32) // 2^32

        if (unsigned) {
            // 无符号处理
            return (bigHigh << shift) + bigLow
        } else {
            // 有符号处理
            // 如果 high 的最高位为1，表示负数
            const isNegative = (bigHigh & (1n << 31n)) !== 0n
            if (isNegative) {
                // 负数处理：将 high 和 low 组合后取补码
                const fullValue = (bigHigh << shift) + bigLow
                return fullValue - (1n << 64n) // 转换为有符号数
            } else {
                // 正数处理
                return (bigHigh << shift) + bigLow
            }
        }
    }
    private createCacheBuffer(buffer: Buffer): CacheBuffer {
        return {
            retryTimes: 0,
            buffer
        }
    }
}

// 将最高位设置为1，表示群聊
function setHighestBitToOne(num) {
    if (typeof num !== 'bigint') {
        num = BigInt(num) // 确保输入是 BigInt 类型
    }
    const mask = 1n << 63n // 创建掩码，第63位为1
    return num | mask // 将最高位设置为1
}

function isGroupUplink(num) {
    if (typeof num !== 'bigint') {
        return false
    }
    const mask = 1n << 63n // 创建掩码，第64位为1
    return (num & mask) !== 0n // 判断第64位是否为1
}
