import { parentPort } from "worker_threads"
console.log('工作线程开始工作')
// 监听主线程发送的消息
parentPort.on('message', ({ task }) => {
    // 执行完毕后发送会主线程
    parentPort?.postMessage(await task())
})
