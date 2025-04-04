import { InternalAxiosRequestConfig } from 'axios'

export function requestURLHandler(request: InternalAxiosRequestConfig<any>) {
    const { url } = request
    if (url.startsWith('/')) {
        return
    } else {
        request.baseURL = ''
    }
}
