import http from '@renderer/utils/http/http'
import { DeviceInfo } from '@utils/types/device'

// 注册提供设备信息
export function registerAPI(info: DeviceInfo) {
    return http({
        url: '/register/device',
        method: 'POST',
        headers: {
            ...info
        }
    })
}
// 设备号应该在拦截器自动带上
export function loginAPI(username: string, password: string, device_id: string) {
    return http({
        url: '/signin',
        method: 'POST',
        data: {
            username,
            password,
            device_id
        }
    })
}
