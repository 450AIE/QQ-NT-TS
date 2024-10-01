import { contextBridge } from 'electron'
import stateUpdateSync from './StateUpdateSync'
import windowManage from './WindowManage'
import fs from './fs'

contextBridge.exposeInMainWorld('ElectronAPI', {
    ...stateUpdateSync,
    ...windowManage,
    ...fs
})
