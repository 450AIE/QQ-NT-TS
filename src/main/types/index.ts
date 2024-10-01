import { BrowserWindow } from 'electron'

export interface QQWindow {
    $windowName: string
    window: BrowserWindow
}
