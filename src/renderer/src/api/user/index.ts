import http from '@renderer/utils/http/http'

export function getUserInfoAPI(user_id: string, caller_id: string, device_id: string) {
    return http({
        url: '/v1/user/get',
        data: {
            user_id,
            caller_id,
            device_id
        }
    })
}

export function updateUserInfoAPI(nickname: string, sex: string, avatar_url: string, extra: string, caller_id: string, device_id: string) {
    return http({
        url: "/v1/user/update",
        data: {
            nickname,
            sex,
            avatar_url,
            extra,
            caller_id,
            device_id
        }
    })
}

export function searchUserAPI(key: string, caller_id: string, device_id: stirng) {
    return http({
        url: '/v1/user/search',
        data: {
            key,
            caller_id,
            device_id
        }
    })
}