export interface Message {
    // 消息的内容
    message: string
    // 消息的发送者id
    senderId: number
    // 消息的接收者id
    receiverId: number
    // 消息的时间戳
    timestamp: number
    type: 'user' | 'group'
}
