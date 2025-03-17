import useUserInfoStore from '@renderer/store/UserInfoStore'
import http from '@renderer/utils/http/http'
import { CMD } from '../../../../main/types/protobuf'
import { makeDataProtoBuf } from "../../../../main/utils/protobuf/protobuf";
const textEncoder = new TextEncoder()

export function LoginProtobuf(login_body = null) {
    const {
        device_id,
        userInfo: { user_id }
    } = useUserInfoStore()
    return http({
        url: '',
        headers: { 'Content-Type': 'application/octet-stream' },
        data: makeDataProtoBuf(CMD.Login, { device_id, user_id, login_body })
    })
}
// 用户只需要传递uplink_body，也就是msg，而我们需要自动带上device_id,client_id,session_id
export function UplinkProtobuf(data: { user_id: string, uplink_body: string } = null) {
    const { user_id, uplink_body } = data
    const { device_id } = useUserInfoStore()
    // 将消息变为二进制
    const uplinkBody = textEncoder.encode(uplink_body)
    return http({
        url: '/data',
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        data: makeDataProtoBuf(CMD.Uplink, {
            deviceId: device_id,
            userId: user_id,
            uplinkBody,
            clientId: 1,
            sessionId: 1
        })
    })
}



export function downlinkProtobuf(downlink_body = null) {
    const {
        device_id,
        userInfo: { user_id }
    } = useUserInfoStore()
    return http({
        url: '',
        headers: { 'Content-Type': 'application/octet-stream' },
        data: makeDataProtoBuf(CMD.Downlink, {
            device_id,
            user_id,
            downlink_body,
            clent_id,
            session_id,
            seq
        })
    })
}

export function heaetBeatProtobuf(heartbeat_body = null) {
    return http({
        url: '',
        headers: { 'Content-Type': 'application/octet-stream' },
        data: makeDataProtoBuf(CMD.Heartbeat, { heartbeat_body })
    })
}

export function reconnectProtobuf(reconn_body = null) {
    return http({
        url: '',
        headers: { 'Content-Type': 'application/octet-stream' },
        data: makeDataProtoBuf(CMD.Reconn, { reconn_body, conn_id })
    })
}

export function ackProtobuf() {
    return http({
        url: '',
        headers: { 'Content-Type': 'application/octet-stream' },
        data: makeDataProtoBuf(CMD.Ack, {
            code,
            message,
            toType,
            conn_id,
            user_id,
            device_id,
            client_id,
            message_id,
            session_id
        })
    })
}
