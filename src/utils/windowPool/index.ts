import { BrowserWindow } from "electron";
import { WindowsType } from '../../main/types/index'
import { join } from 'path'
import { is } from "@electron-toolkit/utils";

interface CacheWindow {
    status: 'used' | 'unused'
    type: WindowsType | null,
    window: BrowserWindow
}

function createCacheWindow(status: 'used' | 'unused', type: WindowsType, window: BrowserWindow): CacheWindow {
    return {
        status,
        type,
        window
    }
}

export class WindowPoll {
    cacheNum: number
    cacheWindow: CacheWindow[],
    constructor(cacheNum: number) {
        this.cacheNum = cache
        for (let i = 0; i < cacheNum; ++i) {
            // 先创建几个默认窗口
            const win = new BrowserWindow({
                width: 600,
                height: 600,
                frame: false,
                webPreferences: {
                    preload: join(__dirname, '../preload/index.js'),
                    webSecurity: false
                }
            })
            this.cacheWindow.push(createCacheWindow('unused', null, win))
        }
    }
    // 取出一个窗口
    borrowWindow(type: WindowsType) {
        // 1. 先看池子中有无上次放回后可直接复用的
        for (const win of this.cacheWindow) {
            // 有，直接复用
            if (win.type === type) {
                // 标记为使用了
                win.status = 'used'
                this.initWindow(type, win)
                win.window.show()
                return win
            }
        }
        // 2. 看有无cache空闲的窗口，取一个复用
        for (const win of this.cacheWindow) {
            if (win.status === 'unused') {
                // 初始化这个窗口，修改它之前的状态
                win.status = 'used'
                this.initWindow(type, win)
                win.window.show()
                return win
            }
        }
        // 3. 无空闲的，直接新创
        const win = new BrowserWindow({
            width: 600,
            height: 600,
            frame: false,
            show: false
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                webSecurity: false
            }
        })
        this.cacheWindow.push(createCacheWindow('used', type, win))
        // 新创后根据它的类型初始化
        this.initWindow(type, win)
        win.window.show()
        return win
    }
    returnWindow(type: WindowsType) {
        // 1. 从池子找到窗口，放回去
        for (const win of this.cacheWindow) {
            if (type === win.type) {
                // 这个隐藏不知道可不可以实现资源节约
                win.status = 'unused'
                win.window.hide()
                // 2. 如果当前窗口数目大于cacheNum总数，那么就销毁这个窗口
                if (this.cacheWindow.length > this.cacheNum) {
                    win.window.destroy()
                }
            }
        }
    }
    // 初始化窗口，提供对应的配置
    initWindow(type: WindowsType, window: BrowserWindow) {
        switch (type) {
            case WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW:
                this.initAddFriendsAndGroupWindow(window)
                break
            case WindowsType.COLLECT_WINDOW:
                this.initCollectWindow(window)
                break
            case WindowsType.CREATE_NOTE_WINDOW:
                this.initCreateNoteWindow(window)
                break
            case WindowsType.LOGIN_WINDOW:
                this.initLoginWindow(window)
                break
            case WindowsType.MAIN_WINDOW:
                this.initMainWindow(window)
                break
            case WindowsType.SETTING_WINDOW:
                this.initSettingWindow(window)
                break
            case WindowsType.STATE_MANAGE_WINDOW:
                this.initStateManageWindow(window)
                break
        }
    }
    private initAddFriendsAndGroupWindow(win: BrowserWindow) {
        win.setSize(1000, 800)
        win.setMinimumSize(800, 800)
        win.setResizable(true)
        win.setAlwaysOnTop(true)
        // 这个设置是告诉新在渲染进程打开网页，直接用外部浏览器打开，不
        // 创建新的渲染进程
        win.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url)
            return { action: 'deny' }
        })
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW)
        })
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/add_friend_and_group')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: 'add_friend_and_group'
            })
        }
    }
    private initLoginWindow(win: BrowserWindow) {
        win.setSize(350, 500)
        win.setResizable(false)
        win.setAlwaysOnTop(true)
        win.setMaximizable(false)
        win.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url)
            return { action: 'deny' }
        })
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.LOGIN_WINDOW)
        })
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/login')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: 'login'
            })
        }
    }
    private initMainWindow(win: BrowserWindow) {
        win.setSize(800, 600)
        win.setMinimumSize(600, 600)
        win.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url)
            return { action: 'deny' }
        })
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.MAIN_WINDOW)
        })
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'])
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: '/'
            })
        }
    }
    private initSettingWindow(win: BrowserWindow) {
        win.setSize(700, 800)
        win.setMinimumSize(700, 800)
        win.setResizable(true)
        win.setAlwaysOnTop(true)
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.SETTING_WINDOW)
        })
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/setting')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: '/setting'
            })
        }
    }
    private initStateManageWindow(win: BrowserWindow) {
        win.setSize(200, 200)
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.STATE_MANAGE_WINDOW)
        })
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/state_manage')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: '/state_manage'
            })
        }
    }
    private initCreateNoteWindow(win: BrowserWindow) {
        win.setSize(1000, 800)
        win.setMinimumSize(700, 800)
        win.setAlwaysOnTop(false)
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.CREATE_NOTE_WINDOW)
        })
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/create_note')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: '/create_note'
            })
        }
    }
    private initCollectWindow(win: BrowserWindow) {
        win.setSize(1000, 800)
        win.setMaximumSize(700, 800)
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.COLLECT_WINDOW)
        })
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/collect')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: '/collect'
            })
        }
    }
}


