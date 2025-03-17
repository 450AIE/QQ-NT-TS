import http from '@renderer/utils/http/http'
import { DeviceInfo } from '@utils/types/device'

// 注册提供设备信息
export function registerAPI(info: DeviceInfo) {
    console.log(info)
    return http({
        url: '/register/device',
        method: 'POST',
        headers: {
            ['Sdk-Version']: info.sdkVersion,
            ['System-Version']: info.systemVersion === 'Not Applicable' ? 'PC' : info.systemVersion,
            Brand: info.brand,
            Model: info.model
        }
    })
}
// 设备号应该在拦截器自动带上
export function loginAPI(username: string, password: string, device_id: string | number) {
    return http({
        url: '/signin',
        method: 'POST',
        data: {
            username,
            password,
            device_id: String(device_id)
        }
    })
}
