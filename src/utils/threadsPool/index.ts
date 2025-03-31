// 线程池用于处理IO密集任务，读本地的历史消息，进行图片压缩上传就可以使用线程池
import os from 'os'
import { Worker } from 'worker_threads'
class ThreadsPool {
    // 空闲线程数组
    freeThreadWorks: ThreadWorker[]
    taskQueue: any[]
    errTaskQueue: any[]
    threadsNum: number
    constructor(fileUrl: string, threadsNum: number = os.cpus()) {
        for (let i = 0; i < threadsNum; ++i) {
            const worker = new ThreadWorker(fileUrl)
            this.freeThreadWorks.push(worker)
        }
    }
    async enqueueTask(task) {
        this.taskQueue.push(task)
        return await this.run()
    }
    // 返回Promise，这样可以run取到结果
    async run() {
        return new Promise((resolve) => {
            // 有空闲线程
            if (this.freeThreadWorks.length > 0 && this.taskQueue.length > 0) {
                // 取出任务
                const task = this.taskQueue.shift()
                const worker = this.freeThreadWorks.pop()
                const [data, err] = await worker.run(task)
                // 如果出错就重新放回错误队列中等待处理
                if (err) {
                    this.errTaskQueue.push(task)
                }
                // 这个执行完了，返回空闲
                this.freeThreadWorks.push(worker)
                resolve(data)
                this.run()
            }
        })
    }
}

// 工作线程
class ThreadWorker {
    worker: Worker
    resolve: (value: unknown) => void
    constructor(fileUrl: string) {
        this.worker = new Worker(fileUrl)
        // work.on('message')代表收到该worker.ts内postMessage返回的结果
        // 当worker执行完毕postMessage的时候调用resolve，这样await work.run()
        // 就可以知道任务是否完成了
        this.worker.on('message', (data) => {
            this.resolve({ data, err: null })
        })
        // 错误
        this.worker.on('messageerror', (err) => {
            this.resolve({ data: null, err })
        })
    }
    // 每次run传递task交给worker执行
    run(task) {
        // 运行，将收到的task发送给worker
        this.worker.postMessage({ task })
        return new Promise((resolve) => {
            this.resolve = resolve
        })
    }
}

export default new ThreadsPool('./worker.ts')
