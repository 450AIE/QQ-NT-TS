// 负责让发送消息加入该并发任务队列，然后为这个回调开启定时器id，没收到ACK自动重发。

import { TimeoutError } from "../error"

// 同时在网络不佳的时候，这里面可以存储挂起的任务，在网络恢复后重新执行
class ConcurrentTaskQueue {
    constructor(maxNum) {
        this.maxNum = maxNum || 1
        this.taskList = []
        // 专门存放未解决的任务
        this.unresolvedTaskList = []
        this.isRunning = false
        this.runningTaskNum = 0
    }
    enqueueTask(task) {
        this.taskList.push(task)
        if (this.isRunning) {
            this.run()
        }
    }
    start() {
        this.isRunning = true
        this.run()
    }
    run() {
        while (this.runningTaskNum < this.maxNum && this.isRunning && this.taskList.length > 0) {
            const task = this.taskList.shift()
            this.runningTaskNum++
            Promise.resolve(task())
                .catch((err) => {
                    // 发生了错误要将根据这个任务错误类型处理
                    // 1. 超时，重新放到任务队列尾部
                    if (err instanceof TimeoutError) {
                        this.enqueueTask(task)
                    }
                    // 2. 其他错误，放到未解决的任务队列中，等待之后处理
                    this.unresolvedTaskList.push(task)
                })
                .finally(() => {
                    this.runningTaskNum--
                    this.run()
                })
        }
    }
    stop() {
        this.isRunning = false
    }
}

export default new ConcurrentTaskQueue(10)
