const { ipcRenderer } = require('electron')

const net = {
    // 这个msg应该是body
    sendCommunicationMsg: (msg) => ipcRenderer.invoke('send-uplink-msg', msg),
    // // 这个msg应该是body
    login: (data) => ipcRenderer.invoke('login', data),
    // 监听下行消息
    onListenDownlinkMsg: (cb) => ipcRenderer.on('receive-downlink-msg', cb)
}

export default net
