import { UserInfo } from 'src/utils/types/user'

export interface TextBubbleProps {
    // 是不是我自己，决定消息的方向
    isMyself: boolean
    // 群聊还是单聊
    type: 'user' | 'group'
    // 消息，暂时只有文本
    message: string
    // 发送该消息的人的信息
    senderInfo: UserInfo
    // 接收该消息的人的id，我需要这个上面发送方和这个接收方
    // 双方的消息来判断是否展示该消息
    receiverId: number
}
