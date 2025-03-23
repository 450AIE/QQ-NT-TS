const { ipcRenderer } = require("electron");

const net = {
    // 这个msg应该是body
    sendCommunicationMsg: (msg) => ipcRenderer.send('send-uplink-msg', msg),
    // listenReceiveCommunicationResponse: (cb) => ipcRenderer.on('receive-communication-response', cb),
    // // 这个msg应该是body
    login: (data) => ipcRenderer.send('login', data),
    // 监听下行消息
    onListenDownlinkMsg: (cb) => ipcRenderer.on('receive-downlink-msg', cb)
    // listenReceiveCommunicationMsg: (cb) => ipcRenderer.on('receive-communication-msg', cb),
    // sendCommunicationResponse: (data) => ipcRenderer.on('emit-communication-response', data)
}

export default net
