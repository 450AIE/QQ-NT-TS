// import protobuf from 'protobufjs'
import $root from './message.js'
import { CMD } from '../../types/protobuf.js'
// const CMD = $root.lookupType('CMD')
const Data = $root.lookupType('pb.Data')
const LoginMsg = $root.lookupType('pb.LoginMsg')
const UplinkMsg = $root.lookupType('pb.UplinkMsg')
const DownlinkMsg = $root.lookupType('pb.DownlinkMsg')
const HeartbeatMsg = $root.lookupType('pb.HeartbeatMsg')
const ReconnMsg = $root.lookupType('pb.ReconnMsg')
const AckMsg = $root.lookupType('pb.AckMsg')

type ProtoBuf = CMD | Data | LoginMsg | UplinkMsg | DownlinkMsg | HeartbeatMsg | ReconnMsg | AckMsg

const makeBufferMap = new Map()
const decodeMap = new Map()
// function verifyMaker(type: ProtoBuf) {
//     const errMsg: string = type.verify.bind(null, type)
//     if (errMsg) {
//         throw new Error(errMsg)
//         return false
//     }
//     return true
// }

// // 验证器
// export const verifyData = verifyMaker(Data)
// export const verifyLoginMsg = verifyMaker(LoginMsg)
// export const verifyUplinkMsg = verifyMaker(UplinkMsg)
// export const verifyDownlinkMsg = verifyMaker(DownlinkMsg)
// export const verifyHeartbeatMsg = verifyMaker(HeartbeatMsg)
// export const verifyReconnMsg = verifyMaker(ReconnMsg)
// export const VerifyAckMsg = verifyMaker(AckMsg)

function bufferMaker(type: ProtoBuf) {
    return (payload: unknown) => {
        const message = type.create(payload)
        return type.encode(message).finish()
    }
}

// buffer生成器
export const makeDatabuffer = bufferMaker(Data)
export const makeLoginMsgbuffer = bufferMaker(LoginMsg)
export const makeUplinkMsgbuffer = bufferMaker(UplinkMsg)
export const makeDownlinkMsgbuffer = bufferMaker(DownlinkMsg)
export const makeHeartbeatMsgbuffer = bufferMaker(HeartbeatMsg)
export const makeReconnMsgbuffer = bufferMaker(ReconnMsg)
export const makeAckMsgbuffer = bufferMaker(AckMsg)

makeBufferMap.set(CMD.Login, makeLoginMsgbuffer)
makeBufferMap.set(CMD.Ack, makeAckMsgbuffer)
makeBufferMap.set(CMD.Downlink, makeDownlinkMsgbuffer)
makeBufferMap.set(CMD.Heartbeat, makeHeartbeatMsgbuffer)
makeBufferMap.set(CMD.Reconn, makeReconnMsgbuffer)
makeBufferMap.set(CMD.Uplink, makeUplinkMsgbuffer)

export function makeDataProtoBuf(cmd: CMD, payload: any) {
    const makeBuffer = makeBufferMap.get(cmd)
    const data = {
        cmd,
        payload: makeBuffer(payload)
    }
    return makeDatabuffer(data)
}

function decodeMaker(type: ProtoBuf) {
    return (payload: unknown) => {
        return type.decode(payload)
    }
}

// 解析器
const decodeDatabufferOrigin = decodeMaker(Data)
const decodeLoginMsgbuffer = decodeMaker(LoginMsg)
const decodeUplinkMsgbuffer = decodeMaker(UplinkMsg)
const decodeDownlinkMsgbuffer = decodeMaker(DownlinkMsg)
const decodeHeartbeatMsgbuffer = decodeMaker(HeartbeatMsg)
const decodeReconnMsgbuffer = decodeMaker(ReconnMsg)
const decodeAckMsgbuffer = decodeMaker(AckMsg)

decodeMap.set(CMD.Login, decodeLoginMsgbuffer)
decodeMap.set(CMD.Ack, decodeAckMsgbuffer)
decodeMap.set(CMD.Downlink, decodeDownlinkMsgbuffer)
decodeMap.set(CMD.Heartbeat, decodeHeartbeatMsgbuffer)
decodeMap.set(CMD.Reconn, decodeReconnMsgbuffer)
decodeMap.set(CMD.Uplink, decodeUplinkMsgbuffer)

// 解析器
export function decodeDataBuffer(buffer) {
    const data = decodeDatabufferOrigin(buffer)
    const cmd = data.cmd
    const decoder = decodeMap.get(cmd)
    const payload = decoder(data.payload)
    return {
        cmd,
        payload
    }
}
