import { BrowserWindow } from 'electron'

export interface QQWindow {
    $windowName: WindowsType
    window: BrowserWindow
}

export enum WindowsType {
    COLLECT_WINDOW,
    CREATE_NOTE_WINDOW,
    SETTING_WINDOW,
    MAIN_WINDOW,
    ADD_FRIENDS_AND_GROUP_WINDOW,
    LOGIN_WINDOW,
    STATE_MANAGE_WINDOW
}
