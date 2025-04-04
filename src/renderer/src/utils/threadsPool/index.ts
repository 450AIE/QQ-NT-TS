import { ConcurrentTaskQueue } from '../../../../utils/taskQueue/index'

enum WebWorkTask {
    MD5
}

// webWorker线程池，暂时只给MD5专用
export class WebWorkerPool extends ConcurrentTaskQueue {
    private freeWorkers: Worker[]
    private allWorkers: Worker[]
    // 错误任务怎么处理，借鉴唐华洋
    constructor(workerFileURL: string, workerNum: number) {
        super(workerNum)
        this.freeWorkers = []
        this.allWorkers = []
        while (workerNum--) {
            const worker = new Worker(workerFileURL, {
                type: 'module'
            })
            this.freeWorkers.push(worker)
            this.allWorkers.push(worker)
        }
    }
    start() {
        super.start()
    }
    stop() {
        super.stop()
    }
    enqueueTask(data: any) {
        return super.enqueueTask(data)
    }
    runTask() {
        // 传递数据让他执行
        // 但是这里的错误了的任务没有放在errTaskQueue
        while (this.freeWorkers.length > 0 && this.taskList.length > 0) {
            const worker = this.freeWorkers.shift()!
            const { callback: data, resolve, reject } = this.taskList.shift()!
            // 成功or失败
            // 用onXXX就可以每次只挂载最新的了
            worker.onmessage = ({ data }) => {
                // console.log('worker返回的数据', data)
                resolve(data)
                this.freeWorkers.push(worker)
                this.runTask()
            }
            worker.onerror = (err) => {
                // console.error('worker发生错误', err)
                reject(err)
                this.errorTaskList.push({ data, resolve, reject })
                this.freeWorkers.push(worker)
                this.runTask()
            }
            // 我们这里暂时只是MD5专用，将ArrayBuffer所有权转移会更快
            worker.postMessage(data, [data])
        }
    }
    destroy() {
        this.allWorkers.forEach((worker) => worker.terminate())
    }
}

function createWebWorkPool(type: WebWorkTask) {
    switch (type) {
        case WebWorkTask.MD5:
            // 引入WebWorker必须这么写new URL('./md5Worker.ts', import.meta.url)
            return (workerNum) =>
                new WebWorkerPool(new URL('./md5Worker.ts', import.meta.url), workerNum)
    }
    return null
}

export const createMD5WebWorkPool = createWebWorkPool(WebWorkTask.MD5)
