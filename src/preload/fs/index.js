import { ipcRenderer } from 'electron'

const fs = {
    /**
     *
     * @param {string} fileData 传递的时候要自己JSON.stringfy()
     * @param {*} path
     * @returns
     */
    writeBaseConfigStoreFiles: (fileData, path) => ipcRenderer.send('write-baseConfigStore-files', fileData, path),
    /**
     *
     * @returns {string}返回读取的文件，要注意JSON.parse()反序列化
     */
    readBaseConfigStoreFiles: () => ipcRenderer.invoke('read-baseConfigStore-files'),
    appendNoteFiles: (fileData) => ipcRenderer.send('append-note-files', fileData),
    /**
     * 该函数仍然要await接收，因为在主进程就await把所有JSON变成数组了，async函数返回的是Promise
     * @returns {string}返回一个数组，包含所有notes，注意要JSON.parse()反序列化
     */
    readAllNoteFiles: () => ipcRenderer.invoke('read-all-note-files')
}


export default fs
