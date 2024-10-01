const { ipcRenderer } = require('electron')

const windowManage = {
    showManageLeftSubWindow: () => ipcRenderer.send('create-sub-manage-window'),
    // startFriendSessionWindow:(uid)=>ipcRenderer.send('start-friend-session-window',uid)
    minimize: () => ipcRenderer.send('minimize'),
    maximize: () => ipcRenderer.send('maximize'),
    closeWindow: () => ipcRenderer.send('closeWindow'),
    closeSubManageWindow: () => ipcRenderer.send('close-sub-manage-window'),
    createSettingGlobalWindow: () => ipcRenderer.send('create-setting-global-window'),
    createCollectWindow: () => ipcRenderer.send('create-collect-window'),
    createCreateNoteWindow: () => ipcRenderer.send('create-create-note-window')
}

export default windowManage
