import { BrowserWindow } from 'electron'
import { WindowsType } from '../../main/types/index'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

interface CacheWindow {
    status: 'used' | 'unused'
    type: WindowsType | null
    window: BrowserWindow
}

function createCacheWindow(
    status: 'used' | 'unused',
    type: WindowsType,
    window: BrowserWindow
): CacheWindow {
    return {
        status,
        type,
        window
    }
}

// 暂时每个窗口只允许创建一个
export class WindowPoll {
    cacheNum: number
    private cacheWindow: CacheWindow[]
    // 初始化的时候默认先创建好login窗口和main窗口和state窗口，以后实现
    // 本地缓存后再说跳过login的问题
    constructor(cacheNum: number) {
        this.cacheNum = cacheNum || 3
        this.cacheWindow = []
        for (let i = 0; i < cacheNum; ++i) {
            // 先创建几个默认窗口
            const win = new BrowserWindow({
                width: 600,
                height: 600,
                frame: false,
                show: false,
                webPreferences: {
                    preload: join(__dirname, '../preload/index.js'),
                    webSecurity: false
                }
            })
            this.cacheWindow.push(createCacheWindow('unused', null, win))
        }
        // 默认先创建好login和main，便于快速打开
        this.initWindow(WindowsType.LOGIN_WINDOW, this.cacheWindow[0], true)
        this.cacheWindow[0].status = 'used'
        this.initWindow(WindowsType.MAIN_WINDOW, this.cacheWindow[1], false)
        this.initWindow(WindowsType.STATE_MANAGE_WINDOW, this.cacheWindow[2], false)
        this.cacheWindow[2].status = 'used'
    }
    // 取出一个窗口
    borrowWindow(type: WindowsType) {
        // 1. 先看池子中有无上次放回后可直接复用的
        for (const win of this.cacheWindow) {
            // 如果已经有该页面了，就不能创建了
            if (win.type === type && win.status === 'used') return null
            // 有，直接复用
            if (win.type === type && win.status === 'unused') {
                // 标记为使用了
                win.status = 'used'
                this.initWindow(type, win)
                return win
            }
        }
        // 2. 看有无cache空闲的窗口，取一个复用
        for (const win of this.cacheWindow) {
            if (win.status === 'unused') {
                // 初始化这个窗口，修改它之前的状态
                win.status = 'used'
                // 清空它的内容，避免切换时的闪烁
                this.initWindow(type, win)
                return win
            }
        }
        // 3. 无空闲的，直接新创
        const win = new BrowserWindow({
            width: 600,
            height: 600,
            frame: false,
            show: false,
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                webSecurity: false
            }
        })
        const cacheWindow = createCacheWindow('used', type, win)
        this.cacheWindow.push(cacheWindow)
        // 新创后根据它的类型初始化
        this.initWindow(type, cacheWindow)
        return cacheWindow
    }
    returnWindow(type: WindowsType) {
        // 1. 从池子找到窗口，放回去
        for (const win of this.cacheWindow) {
            if (type === win.type) {
                // 这个隐藏不知道可不可以实现资源节约
                win.status = 'unused'
                // win.window.webContents.executeJavaScript('document.body.innerHTML = "";')
                // win.window.hide()
                // 2. 如果当前窗口数目大于cacheNum总数，那么就销毁这个窗口
                if (this.cacheWindow.length > this.cacheNum) {
                    win.window.destroy()
                    const idx = this.cacheWindow.find((window) => window === win)
                    this.cacheWindow.splice(idx, 1)
                    return
                }
            }
        }
    }
    // 初始化窗口，提供对应的配置
    initWindow(type: WindowsType, cacheWindow: CacheWindow, show: boolean = true) {
        switch (type) {
            case WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW:
                this.initAddFriendsAndGroupWindow(cacheWindow, show)
                break
            case WindowsType.COLLECT_WINDOW:
                this.initCollectWindow(cacheWindow, show)
                break
            case WindowsType.CREATE_NOTE_WINDOW:
                this.initCreateNoteWindow(cacheWindow, show)
                break
            case WindowsType.LOGIN_WINDOW:
                this.initLoginWindow(cacheWindow, show)
                break
            case WindowsType.MAIN_WINDOW:
                this.initMainWindow(cacheWindow, show)
                break
            case WindowsType.SETTING_WINDOW:
                this.initSettingWindow(cacheWindow, show)
                break
            case WindowsType.STATE_MANAGE_WINDOW:
                this.initStateManageWindow(cacheWindow, show)
                break
        }
    }
    getWindow(type: WindowsType) {
        for (const win of this.cacheWindow) {
            if (win.type === type) {
                return win.window
            }
        }
    }
    getAllWindow() {
        return this.cacheWindow
    }
    hideWindow(type: WindowsType) {
        const win = this.cacheWindow.find((i) => i.type === type)
        if (win) {
            win.status = 'unused'
            win.window.hide()
        }
    }
    hideWindowExcept(types: WindowsType[]) {
        this.cacheWindow.forEach(({ type, window }) => {
            if (!types.includes(type)) {
                window.hide()
            }
        })
    }
    private initAddFriendsAndGroupWindow(cacheWindow: CacheWindow, show: boolean = true) {
        const { window: win } = cacheWindow
        cacheWindow.type = WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW
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
        if (show) {
            win.show()
        } else {
            win.hide()
        }
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/add_friend_and_group')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: 'add_friend_and_group'
            })
        }
    }
    private initLoginWindow(cacheWindow: CacheWindow, show: boolean = true) {
        const { window: win } = cacheWindow
        cacheWindow.type = WindowsType.LOGIN_WINDOW
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
        win.on('ready-to-show', () => {
            if (show) {
                win.show()
            } else {
                win.hide()
            }
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
    private initMainWindow(cacheWindow: CacheWindow, show: boolean = true) {
        const { window: win } = cacheWindow
        cacheWindow.type = WindowsType.MAIN_WINDOW
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
        if (show) {
            win.show()
        } else {
            win.hide()
        }
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'])
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: '/'
            })
        }
    }
    private initSettingWindow(cacheWindow: CacheWindow, show: boolean = true) {
        const { window: win } = cacheWindow
        cacheWindow.type = WindowsType.SETTING_WINDOW
        win.setSize(700, 800)
        win.setMinimumSize(700, 800)
        win.setResizable(true)
        win.setAlwaysOnTop(true)
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.SETTING_WINDOW)
        })
        if (show) {
            win.show()
        } else {
            win.hide()
        }
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/setting_global')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: '/setting_global'
            })
        }
    }
    private initStateManageWindow(cacheWindow: CacheWindow, show: boolean = true) {
        const { window: win } = cacheWindow
        cacheWindow.type = WindowsType.STATE_MANAGE_WINDOW
        win.setSize(200, 200)
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.STATE_MANAGE_WINDOW)
        })
        if (show) {
            win.show()
        } else {
            win.hide()
        }
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/state_manage')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: '/state_manage'
            })
        }
    }
    private initCreateNoteWindow(cacheWindow: CacheWindow, show: boolean = true) {
        const { window: win } = cacheWindow
        cacheWindow.type = WindowsType.CREATE_NOTE_WINDOW
        win.setSize(1000, 800)
        win.setMinimumSize(700, 800)
        win.setAlwaysOnTop(false)
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.CREATE_NOTE_WINDOW)
        })
        if (show) {
            win.show()
        } else {
            win.hide()
        }
        // 读取对应的URL
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/create_note')
        } else {
            win.loadFile(join(__dirname, '../renderer/index.html'), {
                hash: '/create_note'
            })
        }
    }
    private initCollectWindow(cacheWindow: CacheWindow, show: boolean = true) {
        const { window: win } = cacheWindow
        cacheWindow.type = WindowsType.COLLECT_WINDOW
        win.setSize(1000, 800)
        win.setMaximumSize(700, 800)
        // 窗口关闭的时候，要归还窗口
        win.on('hide', () => {
            this.returnWindow(WindowsType.COLLECT_WINDOW)
        })
        if (show) {
            win.show()
        } else {
            win.hide()
        }
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
