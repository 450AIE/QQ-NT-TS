import { BrowserWindow } from "electron";
import { WindowsType } from "../../types";
import { join } from "path";
import { windowsStack } from "./windowStackFunc";

// 工厂模式创建窗口
export function createWindow(windowName: WindowsType) {
    switch (windowName) {
        case WindowsType.MAIN_WINDOW:
            return new BrowserWindow({
                width: 800,
                height: 600,
                minHeight: 600,
                minWidth: 600,
                show: false,
                frame: false,
                autoHideMenuBar: true,
                alwaysOnTop: true,
                webPreferences: {
                    preload: join(__dirname, '../preload/index.js'),
                    sandbox: false,
                    webSecurity: false
                }
            })
        case WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW:
            return new BrowserWindow({
                // parent: windowsStack[windowsStack.length - 1].window,
                width: 1000,
                height: 800,
                minWidth: 700,
                show: false,
                minHeight: 800,
                resizable: true,
                alwaysOnTop: true,
                frame: false,
                webPreferences: {
                    preload: join(__dirname, '../preload/index.js'),
                    webSecurity: false
                }
            })
        case WindowsType.COLLECT_WINDOW:
            return new BrowserWindow({
                parent: windowsStack[windowsStack.length - 1].window,
                width: 1000,
                height: 800,
                minWidth: 700,
                show: false,
                minHeight: 800,
                resizable: true,
                alwaysOnTop: true,
                frame: false,
                webPreferences: {
                    preload: join(__dirname, '../preload/index.js'),
                    webSecurity: false
                }
            })
        case WindowsType.CREATE_NOTE_WINDOW:
            return new BrowserWindow({
                parent: windowsStack[windowsStack.length - 1].window,
                width: 1000,
                height: 800,
                minWidth: 700,
                show: false,
                minHeight: 800,
                resizable: true,
                alwaysOnTop: true,
                frame: false,
                webPreferences: {
                    preload: join(__dirname, '../preload/index.js'),
                    webSecurity: false
                }
            })
        case WindowsType.LOGIN_WINDOW:
            return new BrowserWindow({
                width: 350,
                height: 500,
                show: false,
                frame: false,
                resizable: false,
                autoHideMenuBar: true,
                alwaysOnTop: true,
                webPreferences: {
                    preload: join(__dirname, '../preload/index.js'),
                    sandbox: false,
                    webSecurity: false
                }
            })
        case WindowsType.SETTING_WINDOW:
            return new BrowserWindow({
                parent: windowsStack[windowsStack.length - 1].window,
                width: 700,
                height: 800,
                minWidth: 700,
                show: false,
                minHeight: 800,
                resizable: true,
                alwaysOnTop: true,
                frame: false,
                webPreferences: {
                    preload: join(__dirname, '../preload/index.js'),
                    webSecurity: false
                }
            })

    }
}