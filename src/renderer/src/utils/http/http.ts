// import useBaseConfigStore from '@renderer/store/BaseConfigStore'
// import useUserInfoStore from '@renderer/store/UserInfoStore'
import axios from 'axios'
import { requestURLHandler } from './handler'
// import { toRefs } from 'vue'

const http = axios.create({
    baseURL: 'http://47.120.6.54:8004',
    timeout: 20000,
    adapter: 'fetch'
})
http.interceptors.request.use((request) => {
    // const userInfoStore = useUserInfoStore()
    requestURLHandler(request)
    // 自动带上device_id和caller_id
    if (request.data) {
        const user_id = localStorage.getItem('user_id')
        if (user_id) {
            request.data.caller_id = Number(user_id)
        }
        const device_id = localStorage.getItem('device_id')
        if (device_id) {
            request.data.device_id = Number(device_id)
        }
    }
    // 自动带上token
    const token = localStorage.getItem('token')
    if (token) {
        request.headers.Authorization = `Bearer ${token}`
    }
    return request
})

http.interceptors.response.use((response) => {
    return response.data
})

export default http
