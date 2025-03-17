export enum CMD {
    Login, //登陆
    Uplink, //上行
    Downlink, //下行
    Heartbeat, //心跳
    Reconn, //重连
    Ack //确认
    //同步sync
}

export interface Data {
    cmd: CMD
    payload: Uint8Array
}

//以下类型消息将会序列化和反序列化到Data的payload中

export interface LoginMsg {
    device_id: number
    user_id: number
    login_body: Uint8Array //有效负载
}

export interface UplinkMsg {
    device_id: number
    user_id: number
    client_id: number
    session_id: number
    uplink_body: Uint8Array //有效负载
}

export interface DownlinkMsg {
    seq: number //最后一条消息id
    sender_id: number //发送者id
    session_id: number //会话id
    downlink_body: Uint8Array //有效负载
}

export interface HeartbeatMsg {
    heartbeat_body: Uint8Array //有效负载
}

export interface ReconnMsg {
    conn_id: number //断开的连接oldConnID
    reconn_body: Uint8Array //有效负载
}

//AckMsg:
//注意:client_id 是用于回复上行消息, export interface_id 是回复下行消息
export interface AckMsg {
    code: number //ack码
    message: string //信息
    toType: CMD //ack哪种消息
    conn_id: number //用户id
    user_id: number //用户id
    device_id: number //设备id
    client_id: number //局部消息序列号
    message_id: number //最后一条消息id
    session_id: number //会话id
}
