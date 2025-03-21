import http from '@renderer/utils/http/http'

export function getUserInfoAPI(user_id: string) {
    return http({
        url: '/v1/user/get',
        method: 'POST',
        data: {
            user_id
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
}

export function updateUserInfoAPI(
    nickname: string,
    sex: string,
    avatar_url: string,
    extra: string,
) {
    return http({
        url: '/v1/user/update',
        method: 'POST',
        data: {
            nickname,
            sex,
            avatar_url,
            extra,
            // caller_id,
            // device_id
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
}

// key是用户名
export function searchUserAPI(key: string) {
    return http({
        url: '/v1/user/search',
        method: 'POST',
        data: {
            key,
            // caller_id,
            // device_id
        },
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
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
