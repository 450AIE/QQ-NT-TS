import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import fs from 'fs/promises'
import os from 'os'
import { resolve } from 'path'
import { WindowsType } from './types'
import systemInfo from './utils/getDeviceInfo'
import { CMD } from './types/protobuf'
import { Connection } from './../utils/tcp/index'
import { WindowPoll } from './../utils/windowPool/index'
import { ConcurrentTaskQueue } from './../utils/taskQueue/index'
// 消息数据库实例
import { MessageDBInstance } from './../utils/db/index'
// 标记是否获取了本地消息，避免重复获取，只有退出登陆并重新登陆时才会获取
let isGettedLocalMsg = 0
let windowPool: WindowPoll
// 客户端主动推送的消息加入到任务队列中
const concurrentTaskQueue = new ConcurrentTaskQueue(20)
// TCP连接实例
const connection = new Connection()
// protobuf必须传递驼峰
ipcMain.handle('send-uplink-msg', (_, uplinkMsg) => {
    uplinkMsg = JSON.parse(uplinkMsg)
    return concurrentTaskQueue.enqueueTask(() => connection.send(CMD.Uplink, uplinkMsg))
})
ipcMain.handle('login', (_, msg) => {
    msg = JSON.parse(msg)
    return concurrentTaskQueue.enqueueTask(() => connection.send(CMD.Login, msg))
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })
    windowPool = new WindowPoll(5)
    connection.windowPool = windowPool
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            windowPool.borrowWindow(WindowsType.LOGIN_WINDOW)
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
    windowPool.borrowWindow(WindowsType.MAIN_WINDOW)
    windowPool.hideWindow(WindowsType.LOGIN_WINDOW)
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
// ipcMain.on('closeWindow', () => BrowserWindow.getFocusedWindow()!.close())
ipcMain.on('closeWindow', () => {
    BrowserWindow.getFocusedWindow()!.hide()
    const allWindows = windowPool.getAllUsedWindow()
    // 如果只有状态管理窗口了，那么就关闭app
    if (allWindows.length === 1 && allWindows[0].type === WindowsType.STATE_MANAGE_WINDOW) {
        app.exit()
    }
})
//进入设置界面
ipcMain.on('create-setting-global-window', () => {
    windowPool.borrowWindow(WindowsType.SETTING_WINDOW)
})
// 创建收藏页面
ipcMain.on('create-collect-window', () => {
    windowPool.borrowWindow(WindowsType.COLLECT_WINDOW)
})
// 创建添加好友，群聊的页面
ipcMain.on('create-add-friend-and-group-window', () => {
    windowPool.borrowWindow(WindowsType.ADD_FRIENDS_AND_GROUP_WINDOW)
})
ipcMain.on('create-create-note-window', () => {
    windowPool.borrowWindow(WindowsType.CREATE_NOTE_WINDOW)
})
ipcMain.on('create-login-window', async () => {
    await windowPool.borrowWindow(WindowsType.LOGIN_WINDOW)
    // 标记false，这样进入mainUI的时候就可以重新获取本地消息了
    isGettedLocalMsg = 1
    windowPool.hideWindowExcept([WindowsType.LOGIN_WINDOW])
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
/**
 * 重构
 */
ipcMain.on('has-window-state-update', (_, update: string) => {
    const { window: win } = windowPool.getWindow(WindowsType.STATE_MANAGE_WINDOW)
    // console.log('render给状态管理进程')
    if (win) {
        win.webContents.send('notify-update-updateMap', update)
    }
})

ipcMain.on('notify-window-update-state', (_, update: string) => {
    const allWindow = windowPool.getAllWindow()
    // console.log('状态管理进程通知别人更新')
    allWindow.forEach(({ window, type }) => {
        // 通状态管理窗口略过
        if (type === WindowsType.STATE_MANAGE_WINDOW) {
            return
        }
        if (window) {
            window.webContents.send('receive-update-state', update)
        }
    })
})

ipcMain.on('notify-new-window-created', (e) => {
    // console.log('新窗口创建了')
    const { window: stateWin } = windowPool.getWindow(WindowsType.STATE_MANAGE_WINDOW)
    if (stateWin) {
        stateWin.webContents.send('new-window-created', e.processId)
    }
})

ipcMain.on('emit-full-pinia-state', (e, jsonStore, targetId) => {
    // console.log('statemanage传递full pinia给新创建的窗口', jsonStore)
    const win = findRendererProcessById(targetId)
    // console.log('找到的win', !!win, targetId)
    if (win) {
        win.webContents.send('receive-full-pinia-update', jsonStore)
    }
})

function findRendererProcessById(processId) {
    const windows = BrowserWindow.getAllWindows()
    for (const win of windows) {
        const webContents = win.webContents
        if (webContents && webContents.getProcessId() === processId) {
            return win // 返回匹配的渲染进程
        }
    }
    return null // 如果未找到匹配的渲染进程，返回 null
}
/**
 * 监听数据库操作
 */

// 2. 主进程收到消息后，通知数据库操作，并且返回Promise表示是否成功
ipcMain.handle('send-new-added-message', (_, message) => {
    message = JSON.parse(message)
    if (message.length > 0) {
        if (!MessageDBInstance.messageTableExists()) {
            MessageDBInstance.createMessageTable()
        }
        message.forEach((msg) => {
            MessageDBInstance.insertMessage(msg)
        })
    }
})
// 定时同步本地SQLite
// setInterval(() => {
//     // 1. 主进程请求获取最新的消息
//     const mainWindow = windowPool.getWindow(WindowsType.MAIN_WINDOW)
//     if (mainWindow.window) {
//         mainWindow.window.webContents.send('get-new-added-message')
//     }
// }, 5000)

// 4. 登陆OK后，要获取本地SQLite数据库中的消息
ipcMain.handle('get-local-communication-msgs', async () => {
    // 如果已经获取了本地消息，就不再获取了
    if (isGettedLocalMsg >= 2) return '[]'
    isGettedLocalMsg++
    // 不存在表就创建表，然后返回空
    if (!MessageDBInstance.messageTableExists()) {
        console.log('表不存在，创建表')
        MessageDBInstance.createMessageTable()
        return '[]'
    } else {
        // 查询所有的消息
        const messages = await MessageDBInstance.getAllMessages()
        // console.log('主进程推送本地消息', messages)
        return JSON.stringify(messages)
    }
})
