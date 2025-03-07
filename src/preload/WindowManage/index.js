const { ipcRenderer } = require('electron')

const windowManage = {
    // startFriendSessionWindow:(uid)=>ipcRenderer.send('start-friend-session-window',uid)
    minimize: () => ipcRenderer.send('minimize'),
    maximize: () => ipcRenderer.send('maximize'),
    closeWindow: () => ipcRenderer.send('closeWindow'),
    createSettingGlobalWindow: () => ipcRenderer.send('create-setting-global-window'),
    createCollectWindow: () => ipcRenderer.send('create-collect-window'),
    createCreateNoteWindow: () => ipcRenderer.send('create-create-note-window'),
    createAddFriendAndGroupWindow: () => ipcRenderer.send('create-add-friend-and-group-window'),
    createMainWindow: () => ipcRenderer.send('create-main-window'),
    createLoginWindow: () => ipcRenderer.send('create-login-window')
}

export default windowManage
