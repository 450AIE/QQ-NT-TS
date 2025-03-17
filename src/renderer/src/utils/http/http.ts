// import useBaseConfigStore from '@renderer/store/BaseConfigStore'
// import useUserInfoStore from '@renderer/store/UserInfoStore'
import axios from 'axios'
// import { toRefs } from 'vue'

const http = axios.create({
    baseURL: 'http://47.120.6.54:8004',
    timeout: 20000,
    adapter: 'fetch'
})
http.interceptors.request.use((request) => {
    // const { userInfo } = useUserInfoStore()
    // const { deviceInfo } = useBaseConfigStore()
    // const userInfoRef = toRefs(userInfo)
    // 自动带上token
    // request.headers.token = userInfoRef.value.token
    // 自动带上device_id和caller_id
    // request.data.device_id = deviceInfo.device_id
    // request.data.caller_id = userInfoRef.value.user_id
    //
    const token = localStorage.getItem('token')
    if (token) {
        request.headers['token'] = `Bearer ${token}`
    }
    return request
})

http.interceptors.response.use((response) => {
    return response.data
})

export default http
