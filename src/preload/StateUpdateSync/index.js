const { ipcRenderer } = require('electron')

const stateUpdateSync = {
    // removeListenerPiniaStateUpdate: () => ipcRenderer.removeAllListeners('update-pinia-state'),
    /**
     * 下面是重构
     */
    // UI窗口更新通知状态管理窗口更新
    notifyHasWindowStateUpdate: (update) => ipcRenderer.send('has-window-state-update', update),
    // 状态管理窗口监听UI窗口的更新
    onListenHasWindowStateUpdate: (cb) => ipcRenderer.on('notify-update-updateMap', cb),
    // 状态管理窗口监听到UI窗口的更新，并且分发
    notifyWindowUpdateState: (update) => ipcRenderer.send('notify-window-update-state', update),
    // UI窗口接收状态管理窗口的更新
    onListenReceiveUpdateState: (cb) => ipcRenderer.on('receive-update-state', cb),
    // 新UI窗口创建，通知获取最新pinia值
    notifyNewWindowCreated: () => ipcRenderer.send('notify-new-window-created'),
    // 状态管理窗口监听到新UI窗口的创建
    onListenNewWindowCreated: (cb) => ipcRenderer.on('new-window-created', cb),
    // 状态管理窗口发送piniaJSON数据给新创建的UI窗口
    sendFullPiniaState: (jsonPinia, targetId) => ipcRenderer.send('emit-full-pinia-state', jsonPinia, targetId),
    // 新UI窗口创建，监听获取最新pinia值
    onListenLatestPiniaStoreEmit: (cb) => ipcRenderer.once('receive-full-pinia-update', cb),
    // 状态管理窗口卸载前解除对新创建窗口创建的监听
    removeListenNewWindowCreated: () => ipcRenderer.removeAllListeners('new-window-created'),
    // 状态管理窗口卸载前解除对其他窗口状态变化的监听
    removeListenWindowUpdateState: () => ipcRenderer.removeAllListeners('notify-update-updateMap'),
    // UI窗口卸载前，解除对新状态的接收
    removeListenReceiveNewUpdateState: () => ipcRenderer.removeAllListeners('receive-update-state')
}

export default stateUpdateSync
