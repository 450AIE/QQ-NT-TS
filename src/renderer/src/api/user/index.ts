import http from '@renderer/utils/http/http'

export function getUserInfoAPI(user_id: string, caller_id: string, device_id: string) {
    return http({
        url: '/v1/user/get',
        method: 'POST',
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
        method: 'POST',
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
        method: 'POST',
        data: {
            key,
            caller_id,
            device_id
        }
    })
}
// 转图片为URL
export async function getPictureURL(file) {
    const formData = new FormData()
    formData.append('image', file)
    const response = await http({
        url: 'http://geek.itheima.net/v1_0/upload',
        method: 'POST',
        data: formData
    })
    return response.data.url
}
