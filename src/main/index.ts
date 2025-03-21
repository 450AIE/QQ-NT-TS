import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs/promises'
import os from 'os'
import { resolve } from 'path'
import {
    pushThisWindow,
    isHasTheWindow,
    getWindow,
    popThisWindow,
    windowsStack
} from './utils/window/windowStackFunc'
import { WindowsType } from './types'
import systemInfo from './utils/getDeviceInfo'
import { createWindow } from './utils/window/createWindow'
// import net from 'net'
import { CMD } from './types/protobuf'
import { Connection } from "./../utils/tcp/index";
import { WindowPoll } from "./../utils/windowPool/index";

/**
 * 不管这么多了，连接起来TCP再说
 */
const connection = new Connection()
// protobuf必须传递驼峰
ipcMain.on('send-communication-msg', (_, uplinkMsg) => {
    uplinkMsg = JSON.parse(uplinkMsg)
    connection.send(CMD.Uplink, uplinkMsg)
})
ipcMain.on('login', (_, msg) => {
    msg = JSON.parse(msg)
    connection.send(CMD.Login, msg)
})
/**
 * 
 */

/**
 * 
 */
const windowPool = new WindowPoll(5)
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })
    const loginWindow = createWindow(WindowsType.LOGIN_WINDOW)
    loginWindow.on('ready-to-show', () => {
        loginWindow.show()
        pushThisWindow(windowsStack, WindowsType.LOGIN_WINDOW, loginWindow)
    })
    loginWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })
    loginWindow.on('closed', () => {
        popThisWindow(windowsStack, WindowsType.LOGIN_WINDOW)
    })
    const stateManageWindow = createWindow(WindowsType.STATE_MANAGE_WINDOW)
    stateManageWindow.on('ready-to-show', () => {
        // stateManageWindow.show()
        pushThisWindow(windowsStack, WindowsType.STATE_MANAGE_WINDOW, stateManageWindow)
    })
    stateManageWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })
    stateManageWindow.on('closed', () => {
        popThisWindow(windowsStack, WindowsType.STATE_MANAGE_WINDOW)
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        loginWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/login')
        console.log(
            '这个是electron渲染进程所在的URL',
            process.env['ELECTRON_RENDERER_URL'] + '/#/login'
        )
        // communicationWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/communication')
        stateManageWindow?.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/state_manage')
    } else {
        loginWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/login' })
        // communicationWindow.loadFile(join(__dirname, '../renderer/index.html'), {
        //     hash: '/communication'
        // })
        stateManageWindow?.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/state_manage' })
    }
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            const loginWindow = createWindow(WindowsType.LOGIN_WINDOW)
            loginWindow.on('ready-to-show', () => {
                loginWindow.show()
                pushThisWindow(windowsStack, WindowsType.LOGIN_WINDOW, loginWindow)
            })
            loginWindow.webContents.setWindowOpenHandler((details) => {
                shell.openExternal(details.url)
                return { action: 'deny' }
            })
            loginWindow.on('closed', () => {
                popThisWindow(windowsStack, WindowsType.LOGIN_WINDOW)
            })
            // HMR for renderer base on electron-vite cli.
            // Load the remote URL for development or the local html file for production.
            if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
                loginWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/login')
                console.log(
                    '这个是electron渲染进程所在的URL',
                    process.env['ELECTRON_RENDERER_URL'] + '/#/login'
                )
            } else {
                loginWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/login' })
            }
        }
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// 登陆结束，进入主页面
ipcMain.on('create-main-window', () => {
    const mainWindow = createWindow(WindowsType.MAIN_WINDOW)
    const loginWindow = getWindow(windowsStack, WindowsType.LOGIN_WINDOW)
    if (loginWindow) {
        loginWindow.destroy()
    }
    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
        pushThisWindow(windowsStack, WindowsType.MAIN_WINDOW, mainWindow)
    })
    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })
    mainWindow.on('closed', () => {
        popThisWindow(windowsStack, WindowsType.MAIN_WINDOW)
    })
    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/' })
    }
})

//监听关闭，最小化，最大化
ipcMain.on('minimize', () => BrowserWindow.getFocusedWindow()!.minimize())
ipcMain.on('maximize', () => {
    if (BrowserWindow.getFocusedWindow()!.isMaximized()) {
        BrowserWindow.getFocusedWindow()!.restore()
    } else {
        BrowserWindow.getFocusedWindow()!.maximize()
    }
})
//只剩一个页面了会退出app
ipcMain.on('closeWindow', () => BrowserWindow.getFocusedWindow()!.close())
//进入设置界面
ipcMain.on('create-setting-global-window', () => {
    if (isHasTheWindow(windowsStack, WindowsType.SETTING_WINDOW)) return
    const settingWin = createWindow(WindowsType.SETTING_WINDOW)
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        settingWin.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/setting_global')
    } else {
        settingWin.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'setting_global' })
    }
    settingWin.on('ready-to-show', () => {
        settingWin.show()
        pushThisWindow(windowsStack, WindowsType.SETTING_WINDOW, settingWin)
    })
    settingWin.on('closed', () => {
        popThisWindow(windowsStack, WindowsType.SETTING_WINDOW)
    })
})
// 创建收藏页面
ipcMain.on('create-collect-window', () => {
    if (isHasTheWindow(windowsStack, WindowsType.COLLECT_WINDOW)) return
    const collectWin = createWindow(WindowsType.COLLECT_WINDOW)
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        collectWin.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/collect')
    } else {
        collectWin.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'collect' })
    }
    collectWin.on('ready-to-show', () => {
        collectWin.show()
        pushThisWindow(windowsStack, WindowsType.COLLECT_WINDOW, collectWin)
    })
    collectWin.on('closed', () => {
        popThisWindow(windowsStack, WindowsType.COLLECT_WINDOW)
    })
})
// 创建添加好友，群聊的页面
ipcMain.on('create-add-friend-and-group-window', () => {
    if (isHasTheWindow(windowsStack, WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW)) return
    const addFriendsAndGroupWindow = createWindow(WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW)
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        addFriendsAndGroupWindow.loadURL(
            process.env['ELECTRON_RENDERER_URL'] + '/#/add_friend_and_group'
        )
    } else {
        addFriendsAndGroupWindow.loadFile(join(__dirname, '../renderer/index.html'), {
            hash: 'add_friend_and_group'
        })
    }
    addFriendsAndGroupWindow.on('ready-to-show', () => {
        addFriendsAndGroupWindow.show()
        pushThisWindow(
            windowsStack,
            WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW,
            addFriendsAndGroupWindow
        )
    })
    addFriendsAndGroupWindow.on('closed', () => {
        popThisWindow(windowsStack, WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW)
    })
})
ipcMain.on('create-create-note-window', () => {
    // 如果存在当前窗口就不再创建
    if (isHasTheWindow(windowsStack, WindowsType.CREATE_NOTE_WINDOW)) return
    const createNoteWin = createWindow(WindowsType.CREATE_NOTE_WINDOW)
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        createNoteWin.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/create_note')
    } else {
        createNoteWin.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'create_note' })
    }
    createNoteWin.on('ready-to-show', () => {
        createNoteWin.show()
        pushThisWindow(windowsStack, WindowsType.CREATE_NOTE_WINDOW, createNoteWin)
    })
    createNoteWin.on('closed', () => {
        popThisWindow(windowsStack, WindowsType.CREATE_NOTE_WINDOW)
    })
})
ipcMain.on('create-login-window', () => {
    const loginWindow = createWindow(WindowsType.LOGIN_WINDOW)
    loginWindow.on('ready-to-show', () => {
        loginWindow.show()
        pushThisWindow(windowsStack, WindowsType.LOGIN_WINDOW, loginWindow)

        // 将其他页面都删除掉
        windowsStack.forEach((win) => {
            const window = win.window
            if (window === loginWindow) return
            if (window && !window.isDestroyed()) {
                window.destroy()
            }
        })
    })
    loginWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })
    loginWindow.on('closed', () => {
        popThisWindow(windowsStack, WindowsType.LOGIN_WINDOW)
    })
    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        loginWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/login')
        console.log(
            '这个是electron渲染进程所在的URL',
            process.env['ELECTRON_RENDERER_URL'] + '/#/login'
        )
    } else {
        loginWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/login' })
    }
})
ipcMain.on('write-baseConfigStore-files', (_, fileData) => {
    try {
        // console.log(resolve(__dirname,'./baseConfigStore.json'))
        // console.log(resolve(app.getPath('userData'),'./baseConfigStore.json'))
        // console.log('写文件')
        return fs.writeFile(
            resolve(app.getPath('userData'), './baseConfigStore.DAT'),
            fileData,
            'utf-8'
        )
    } catch (error) {
        console.dir(error)
    }
})
ipcMain.handle('read-baseConfigStore-files', () => {
    try {
        return fs.readFile(resolve(app.getPath('userData'), './baseConfigStore.DAT'), 'utf-8')
    } catch (error) {
        console.dir(error)
    }
})
// 将撰写的笔记保存到本地
// ipcMain.on('write-note-files',(_,fileData)=>{
//     try {
//         return fs.writeFile(resolve(app.getPath('userData'),'./notes.DAT'),fileData,'utf-8')
//     }catch(error){
//         console.dir(error)
//     }
// })
// 读取笔记
ipcMain.handle('read-all-note-files', async () => {
    try {
        const res = await fs.readFile(resolve(app.getPath('userData'), './notes.DAT'), 'utf-8')
        let arr = res.split('\r\n')
        // 去掉最后一个只有换行符的元素
        arr = arr.slice(0, arr.length - 1)
        const len = arr.length
        for (let i = 0; i < len; ++i) {
            arr[i] = JSON.parse(arr[i])
        }
        // Electron内不可以直接传递对象，所以序列化
        return JSON.stringify(arr)
    } catch (error) {
        console.dir(error)
    }
})
// 获取系统信息
ipcMain.handle('get-system-info', () => systemInfo)
// 将撰写的笔记保存到本地
ipcMain.on('append-note-files', (_, fileData) => {
    try {
        return fs.appendFile(
            resolve(app.getPath('userData'), './notes.DAT'),
            fileData + os.EOL,
            'utf-8'
        )
    } catch (error) {
        console.dir(error)
    }
})
// // 调试专用监听
// ipcMain.handle('tcp',()=>{

// })
ipcMain.on('emit-communication-response', (e, response) => {
    //将对应的响应返回给聊天的主窗口
    const win = getWindow(windowsStack, WindowsType.MAIN_WINDOW)
    console.log('通信进程发送给main的响应', response)
    if (win) {
        win.webContents.send('receive-communication-response', response)
    }
})
/**
 * 重构
 */
ipcMain.on('has-window-state-update', (_, update: string) => {
    const win = getWindow(windowsStack, WindowsType.STATE_MANAGE_WINDOW)
    // console.log('render给statemanage')
    if (win) {
        win.webContents.send('notify-update-updateMap', update)
    }
})

ipcMain.on('notify-window-update-state', (_, update: string) => {
    // console.log('statemanage传递的update为')
    windowsStack.forEach(win => {
        // 通状态管理窗口略过
        if (win.$windowName === WindowsType.STATE_MANAGE_WINDOW) {
            return
        }
        if (win.window) {
            win.window.webContents.send('receive-update-state', update)
        }
    })
})

ipcMain.on('notify-new-window-created', (e) => {
    // console.log('新窗口创建了')
    const stateWin = getWindow(windowsStack, WindowsType.STATE_MANAGE_WINDOW)
    if (stateWin) {
        stateWin.webContents.send('new-window-created', e.processId)
    }
})

ipcMain.on('emit-full-pinia-state', (e, jsonStore, targetId) => {
    // console.log('statemanage传递full pinia给新创建的窗口')
    const win = findRendererProcessById(targetId)
    // console.log('找到的win', !!win, targetId)
    if (win) {
        win.webContents.send('receive-full-pinia-update', jsonStore)
    }
})


function findRendererProcessById(processId) {
    const windows = BrowserWindow.getAllWindows();
    for (const win of windows) {
        const webContents = win.webContents;
        if (webContents && webContents.getProcessId() === processId) {
            return win; // 返回匹配的渲染进程
        }
    }
    return null; // 如果未找到匹配的渲染进程，返回 null
}



