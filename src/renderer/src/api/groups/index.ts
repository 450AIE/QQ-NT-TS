import http from '@renderer/utils/http/http'

export function createGroupAPI(
    name: string,
    member_ids: string[],
    introduction?: string,
    avatar_url?: string,
    extra?: string
) {
    return http({
        url: '/v1/group/create',
        method: 'POST',
        data: {
            name,
            member_ids,
            introduction,
            avatar_url,
            extra
        }
    })
}

export function setGroupInfoAPI(
    group_id: string,
    avatar_url: string,
    name: string,
    introduction: string,
    extra: string,
    caller_id: string,
    device_id: string
) {
    return http({
        url: '/v1/group/update',
        method: 'POST',
        data: {
            group_id,
            avatar_url,
            name,
            introduction,
            extra,
            caller_id,
            device_id
        }
    })
}

export function getGroupInfoAPI(group_id: string) {
    return http({
        url: '/v1/group/get',
        method: 'POST',
        data: {
            group_id
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
}

export function getAllGroupsInfoAPI() {
    return http({
        url: '/v1/group/all',
        method: 'POST',
        data: {},
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
}

export function addGroupMemberAPI(
    group_id: string,
    user_ids: string[],
    caller_id: string,
    device_id: string
) {
    return http({
        url: '/v1/group-member/add',
        method: 'POST',
        data: {
            group_id,
            user_ids,
            caller_id,
            device_id
        }
    })
}

export function setGroupMemberAPI(
    group_id: string,
    user_id: string,
    member_type: string,
    remarks: string,
    extra: string,
    caller_id: string,
    device_id: string
) {
    return http({
        url: '/v1/group-member/update',
        method: 'POST',
        data: {
            group_id,
            user_id,
            member_type,
            remarks,
            extra,
            caller_id,
            device_id
        }
    })
}

export function deleteGroupMemberAPI(
    group_id: string,
    user_id: string,
    caller_id: string,
    device_id: string
) {
    return http({
        url: '/v1/group-member/update',
        method: 'POST',
        data: {
            group_id,
            user_id,
            caller_id,
            device_id
        }
    })
}

export function getGroupMemberInfoAPI(
    group_id: string,
    user_id: string,
    caller_id: string,
    device_id: string
) {
    return http({
        url: '/v1/group-member/get',
        method: 'POST',
        data: {
            group_id,
            user_id,
            caller_id,
            device_id
        }
    })
}
