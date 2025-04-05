import { ipcRenderer } from 'electron'

const db = {
    // 监听主进程请求最新消息的事件
    onListenSendNewAddedMsg: (cb) => {
        // 避免重复挂载监听
        if (ipcRenderer.listenerCount('get-new-added-message') !== 0) {
            ipcRenderer.removeAllListeners('get-new-added-message')
        }
        return ipcRenderer.on('get-new-added-message', cb)
    },
    // 监听到上述事件后，发送最新消息的事件
    sendNewAddedMsg: (msg) => ipcRenderer.invoke('send-new-added-message', msg),
    // 读取本地SQLite数据库中的消息
    getLocalCommunicationMsgs: () => ipcRenderer.invoke('get-local-communication-msgs')
}

export default db
