// /* eslint-disable no-case-declarations */
// // 负责让发送消息加入该并发任务队列，然后为这个回调开启定时器id，没收到ACK自动重发。
// // import { TimeoutError } from '../error'
// // import net from "./../../preload/net/index";
// import net from "net"
// // 什么时候runningTaskNum--呢？就是收到了对应ack报文后就会--
// export class ConcurrentTaskQueue {
//     // 当前遍历到的Task
//     current: Task | null
//     maxConcurrentNum: number
//     isRunning: boolean
//     runningTaskNum: number
//     taskLink: Task
//     taskLinkLength: number
//     sessionIdToTaskNodeMap: Map<string, Task>
//     constructor(maxConcurrentNum) {
//         this.maxConcurrentNum = maxConcurrentNum || 10
//         // this.taskList = []
//         // 双向链表，遍历各个任务，遍历到这个头结点就跳过
//         this.taskLink = new Task()
//         this.isRunning = false
//         this.runningTaskNum = 0
//         this.current = this.taskLink
//         this.sessionIdToTaskNodeMap = new Map()
//     }
//     enqueueTask(task: Task) {
//         // 双向链表的尾部插入
//         this.insertTask(task)
//         this.taskLinkLength++
//         if (this.isRunning) {
//             this.run()
//         }
//     }
//     start() {
//         this.isRunning = true
//         this.run()
//     }
//     run() {
//         // 长度 > 0才继续
//         while (
//             this.runningTaskNum < this.maxConcurrentNum &&
//             this.taskLinkLength > 0 &&
//             this.isRunning
//         ) {
//             // 跳过头结点
//             if (this.current === this.taskLink) {
//                 this.current = this.current.next
//                 this.run()
//             }
//             // 1. 判断任务当前状态
//             switch (this.current?.status) {
//                 // 当前任务正在执行，略过
//                 case 'executing':
//                     this.current = this.current.next
//                     break
//                 // 当前任务已经完成了
//                 case 'fulfiled':
//                     const sessionID = this.current.sessionID
//                     this.current = this.current.next
//                     this.removeTask(sessionID)
//                     break
//                 // 当前任务失败了，先不处理
//                 case 'rejected':
//                     break
//                 // 未执行的任务，触发执行
//                 case 'unexecute':
//                     this.runningTaskNum++
//                     this.current.execute()
//                     this.current = this.current.next
//                     break
//             }
//             this.run()
//         }
//     }
//     // 插到链表尾部，同时加入到map中
//     insertTask(task: Task) {
//         const last = this.taskLink.pre
//         last.next = task
//         task.next = this.taskLink
//         this.taskLink.pre = task
//         task.pre = last
//         this.sessionIdToTaskNodeMap.set(task.sessionID, task)
//     }
//     // 从链表中删除，同时从map中删除
//     removeTask(sessionID: string) {
//         if (this.sessionIdToTaskNodeMap.has(sessionID)) {
//             const node = this.sessionIdToTaskNodeMap.get(sessionID)
//             const next = node.next
//             const pre = node.pre
//             next.pre = pre
//             pre.next = next
//             this.sessionIdToTaskNodeMap.delete(sessionID)
//         }
//     }
//     // 收到ACK，说明这个任务完成了，runningTaskNum--
//     receiveACK(sessionID: string) {
//         this.runningTaskNum--
//         this.taskLinkLength--
//         this.removeTask(sessionID)
//         // 继续执行接下来的任务
//         this.run()
//     }
//     stop() {
//         this.isRunning = false
//     }
// }

// export class Task {
//     type: 'uplink' | 'heartBeat'
//     timeoutID: number
//     // 标记这个msg的id便于收到ACK后直接从map中找到这个node
//     sessionID: number
//     timeoutTimes: number
//     callback: Function
//     data: Uint8Array
//     status: 'unexecute' | 'executing' | 'fulfiled' | 'rejected'
//     // socket客户端，TCP
//     clinet: net.Socket
//     next: Task
//     pre: Task
//     constructor(type: 'uplink' | 'heartBeat', client: net.Socket, callback: Function) {
//         this.type = type
//         this.callback = callback
//         this.data = null
//         this.timeoutID = null
//         this.status = 'unexecute'
//         this.timeoutTimes = 0
//         this.sessionID = sessionID || undefined
//         this.pre = this
//         this.next = this
//         this.clinet = client
//     }
//     execute() {
//         this.status = 'executing'
//         this.callback()
//         if (this.timeoutTimes >= 3) {
//             this.reject()
//             return
//         }
//         this.timeoutID = setTimeout(() => {
//             this.timeoutTimes++
//             if (this.status !== 'fulfiled') {
//                 this.execute()
//             }
//         }, 10000)
//     }
//     // 3次传递失败，停止
//     reject() {
//         this.status = 'rejected'
//     }
//     // 收到了对应的ACK，停止定时器
//     fulfil() {
//         this.status = 'fulfiled'
//         clearTimeout(this.timeoutID)
//     }
// }

// export default new ConcurrentTaskQueue(100)






