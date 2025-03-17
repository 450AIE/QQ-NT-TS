import { WindowsType } from '../window-type'

export interface QQWindow {
    $windowName: string
    window: WindowsType
}
export enum WindowsType {
    COLLECT_WINDOW,
    CREATE_NOTE_WINDOW,
    SETTING_WINDOW,
    MAIN_WINDOW,
    ADD_FRIENDS_AND_GROUP_WINDOW,
    LOGIN_WINDOW,
    COMMUNICATION_WINDOW,
    STATE_MANAGE
}
