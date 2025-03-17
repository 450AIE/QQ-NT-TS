const { ipcRenderer } = require("electron");

const net = {
    // 这个msg应该是body
    sendCommunicationMsg: (msg) => ipcRenderer.send('send-communication-msg', msg),
    listenReceiveCommunicationResponse: (cb) => ipcRenderer.on('receive-communication-response', cb),
    // 这个msg应该是body
    listenReceiveCommunicationMsg: (cb) => ipcRenderer.on('receive-communication-msg', cb),
    sendCommunicationResponse: (data) => ipcRenderer.on('emit-communication-response', data)
}

export default net
