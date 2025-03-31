import { isErrorTask } from '../types/judge'

export class ConcurrentTaskQueue {
    taskList: Task[]
    errorTaskList: any[]
    maxConcurrentNum: number
    isRunning: boolean
    runningTaskNum: number
    constructor(maxConcurrentNum) {
        this.maxConcurrentNum = maxConcurrentNum || 20
        this.taskList = []
        this.errorTaskList = []
        this.isRunning = false
        this.runningTaskNum = 0
    }
    start() {
        this.isRunning = true
        this.run()
    }
    run() {
        while (
            this.runningTaskNum < this.maxConcurrentNum &&
            (this.taskList.length > 0 || this.errorTaskList.length > 0)
        ) {
            let task
            // 优先取出err任务执行
            if (this.errorTaskList.length > 0) {
                task = this.errorTaskList.shift()
                if (task.retryTimes > 4) {
                    throw new Error('errTaskQueue出现任务反复失败，抛错')
                }
            } else {
                task = this.taskList.shift()
            }
            const { callback } = task
            this.runningTaskNum++
            Promise.resolve(callback()).then(
                (res) => {
                    console.log('task运行成功', res)
                    this.runningTaskNum--
                    this.run()
                },
                // 运行失败就放弃errTaskList等待处理
                (err) => {
                    console.log('task运行失败', err)
                    if (isErrorTask(task)) {
                        task.retryTimes++
                    } else {
                        task = createErrorTask(callback)
                    }
                    this.errorTaskList.push(task)
                    this.runningTaskNum--
                    this.run()
                }
            )
        }
    }
    stop() {
        this.isRunning = false
    }
    enqueueTask(task: Task) {
        this.taskList.push(task)
        if (this.isRunning) {
            this.run()
        }
    }
}

export class Task {
    constructor(public callback: Function) { }
}

export function createTask(cb: Function) {
    return new Task(cb)
}

export class ErrorTask {
    constructor(
        public callback: Function,
        public retryTimes: number
    ) { }
}

export function createErrorTask(cb: Function, retryTimes: number = 0) {
    return new ErrorTask(cb, retryTimes)
}
