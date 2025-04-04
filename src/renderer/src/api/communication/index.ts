import useUserInfoStore from '@renderer/store/UserInfoStore'
import http from '@renderer/utils/http/http'
import { CMD } from '../../../../main/types/protobuf'
import { makeDataProtoBuf } from '../../../../main/utils/protobuf/protobuf'

interface CommunicationMsg {
    userId: string
    type: string
    sessionId: number
    deviceId: string
}

export function sendUplinkMsg(msg: CommunicationMsg) {
    ElectronAPI.sendCommunicationMsg(JSON.stringify(msg))
}
