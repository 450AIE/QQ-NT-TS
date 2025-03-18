import { ackProtobuf, heaetBeatProtobuf, LoginProtobuf, UplinkProtobuf } from '@renderer/api/communication'
import TaskQueue from '../../../../../utils/taskQueue/index'
import { TimeoutError } from "../../../../../utils/error/index";
// 定期加入任务队列，自动发送心跳包
export function startHeartBeatAutomacally(time = 100000) {
    let stopHeartTimes = 0
    const id = setInterval(() => {
        TaskQueue.enqueueTask(() => {
            try {
                heaetBeatProtobuf()
            } catch (err) {
                // 这个可以取到外面的stopHeartTimes吗？注意
                stopHeartTimes++
                // 3次心脏停止跳动，断开连接
                // eslint-disable-next-line no-empty
                if (stopHeartTimes >= 3) {
                }
            }
        })
    }, time)
    return clearInterval.bind(null, id)
}
// 发送消息，同样加入并发队列
export function sendCommunicationMsg(data: { user_id: string, uplink_body: string }) {
    TaskQueue.enqueueTask(async () => {
        try {
            /**
             * 再进入时如果已经收到了对应的ACK报文，就停止继续发送。
             * 我们当前是超时了就发送，应该不用额外检测
             */
            // 正常情况，发送消息，然后传递给主窗口
            const response = await UplinkProtobuf(data)
            ElectronAPI.sendCommunicationResponse(response)
            // 回复ACK消息，ACK消息不会主动重传
            sendAckMsg()
        } catch (err) {
            // 发生了错误要将根据这个任务错误类型处理
            // 1. 超时，重新放到任务队列尾部
            if (err.code === 'ECONNABORTED') {
                throw new TimeoutError('超时，重新放入任务队列尾部')
            } else {
                // 2. 其他错误，放到未解决的任务队列中，等待之后处理
                throw new Error('不是超时错误，是请求错误')
            }
            // throw new Error('发送上行消息，但是响应下行消息失败')
        }
    })
}

export function login() {
    // 这个登陆的优先级似乎应该最高，因为它必须第一个执行。不过其实进入主窗口的时候
    // 就会执行这个，所以必定第一个执行
    // TaskQueue.enqueueTask(() => {
    LoginProtobuf()
    // })
}

// 收到下行的消息后，回复ACK，这个应该优先级很高，立刻执行
export function sendAckMsg() {
    ackProtobuf()
}

// 还要实现如果已经收到的数据再次被收到，就要返回对应的ACK
