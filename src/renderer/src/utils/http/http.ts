import useBaseConfigStore from '@renderer/store/BaseConfigStore'
import axios from 'axios'
import { toRefs } from 'vue'

const http = axios.create({
    baseURL: '',
    timeout: 20000,
    adapter: 'fetch'
})
http.interceptors.request.use((request) => {
    const { userInfo } = useBaseConfigStore()
    const userInfoRef = toRefs(userInfo)
    request.headers['token'] = userInfoRef.value.token
    return request
})

http.interceptors.response.use((response) => {
    return response
})

export default http
