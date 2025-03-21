export interface GroupInfo {
    group_id: string
    name: string
    avatar_url: string
    extra: string
    caller_id: string
    device_id: string
    member_ids: string[]
}

export interface GroupMemberInfo {
    user_id: string
    nickname: string
    sex: string
    avatar_url: string
    user_extra: string
    member_type: string
    remarks: string
    extra: string
}
