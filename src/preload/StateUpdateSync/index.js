const { ipcRenderer } = require('electron')

const stateUpdateSync = {
    notifyAllWindowUpdatePiniaState: (func, args) => ipcRenderer.send('notify-others-update-pinia-state', func, args),
    // cb函数内接收函数名和args,args注意要手动JSON.parse()
    onListenerPiniaStateUpdate: (cb) => ipcRenderer.on('update-pinia-state', cb),
    // 监听新窗口创建，传递的cb内再send数据,传递新的pinia数据给他
    onListenerNewWindowCreated: (cb) => ipcRenderer.on('new-window-created', cb),
    notifyAllWindowsNewWindowCreated: () => ipcRenderer.send('new-window-created'),
    sendUpdatedPiniaStateToNewCreatedWindow: (store) => ipcRenderer.send('send-new-created-window-updated-pinia-state', store),
    // 新创建的窗口内接收传递的store调用set更新，更新后就自动移除
    onceListenerToGetUpdatedPiniaState: (cb) => ipcRenderer.once('receive-new-created-window-updated-pinia-state', cb),
    removeListenerPiniaStateUpdate: () => ipcRenderer.removeAllListeners('update-pinia-state'),
    removeListenerNewWindowCreated: () => ipcRenderer.removeAllListeners('new-window-created')
}

export default stateUpdateSync
