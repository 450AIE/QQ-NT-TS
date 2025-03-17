import { contextBridge } from 'electron'
import stateUpdateSync from './StateUpdateSync'
import windowManage from './WindowManage'
import fs from './fs'
import net from './net'

contextBridge.exposeInMainWorld('ElectronAPI', {
    ...stateUpdateSync,
    ...windowManage,
    ...fs,
    ...net
})
