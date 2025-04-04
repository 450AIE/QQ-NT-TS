export class ConcurrentTaskQueue {
    taskList: Task[]
    errorTaskList: Task[]
    maxConcurrentNum: number
    isRunning: boolean
    runningTaskNum: number
    constructor(maxConcurrentNum) {
        this.maxConcurrentNum = maxConcurrentNum || 20
        this.taskList = []
        this.errorTaskList = []
        this.isRunning = true
        this.runningTaskNum = 0
    }
    start() {
        this.isRunning = true
        this.runTask()
    }
    runTask() {
        while (
            this.runningTaskNum < this.maxConcurrentNum &&
            (this.taskList.length > 0 || this.errorTaskList.length > 0)
        ) {
            let task: Task
            // 优先取出err任务执行
            if (this.errorTaskList.length > 0) {
                task = this.errorTaskList.shift()
                // 反复失败的任务暂时先抛弃
                if (task.retryTimes > 4) {
                    console.error('errTaskQueue出现任务反复失败', task)
                    continue
                }
            } else {
                task = this.taskList.shift()
            }
            const { callback, resolve, reject } = task
            this.runningTaskNum++
            Promise.resolve(callback()).then(
                (res) => {
                    console.log('task运行成功', res)
                    // 完成该任务
                    resolve(res)
                    this.runningTaskNum--
                    this.runTask()
                },
                // 运行失败就放弃errTaskList等待处理
                (err) => {
                    console.log('task运行失败', err)
                    // 失败该任务
                    reject(err)
                    task.retryTimes++
                    this.errorTaskList.push(task)
                    this.runningTaskNum--
                    this.runTask()
                }
            )
        }
    }
    stop() {
        this.isRunning = false
    }
    // 外面可以await enqueueTask()获得这个任务的完成情况
    enqueueTask(callback: any) {
        return new Promise((resolve, reject) => {
            this.taskList.push(createTask(callback, resolve, reject))
            if (this.isRunning) {
                this.runTask()
            }
        })
    }
}

export class Task {
    constructor(
        // 对于普通的任务队列，这个应该是函数，但是对于webWorker，应该是传递的buffer数据
        public callback: any,
        public resolve: (value: any) => void,
        public reject: (value: any) => void,
        public retryTimes: number
    ) {}
}

export function createTask(
    cb: any,
    resolve: (value: any) => void,
    reject: (value: any) => void,
    retryTimes: number = 0
) {
    return new Task(cb, resolve, reject, retryTimes)
}
