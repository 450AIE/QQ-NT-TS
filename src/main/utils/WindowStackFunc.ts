import { BrowserWindow } from 'electron'
import { QQWindow } from '../types/index'
export function isHasTheWindow(windowStack: Array<QQWindow>, windowName: string) {
    for (let i = 0; i < windowStack.length; ++i) {
        if (windowStack[i].$windowName === windowName) {
            return true
        }
    }
    return false
}

export function pushThisWindow(windowStack: Array<QQWindow>, windowName: string, window: BrowserWindow) {
    windowStack.push({
        $windowName: windowName,
        window
    })
}

export function popThisWindow(windowStack: Array<QQWindow>, windowName: string) {
    for (let i = 0; i < windowStack.length; ++i) {
        if (windowStack[i].$windowName === windowName) {
            windowStack.splice(i, 1)
            return
        }
    }
}

export function getWindow(windowStack: Array<QQWindow>, windowName: string) {
    for (let i = 0; i < windowStack.length; ++i) {
        if (windowStack[i].$windowName === windowName) {
            return windowStack[i].window
        }
    }
    return false
}
