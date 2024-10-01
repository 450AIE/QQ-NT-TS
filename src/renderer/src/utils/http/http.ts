import { isFormData } from '../isType'

async function http(options) {
    let { url, method, data, params, headers } = options
    if (url) {
        if (params) {
            params = new URLSearchParams(params).toString()
            url += `?${params}`
        }
        // 图片用formdata类型，不需要序列化，其他的要序列化
        if (!isFormData(data)) {
            data = JSON.stringify(data)
        }
        // if(!headers){
        //     headers = data && {
        //         'Content-Type':'application/json'
        //     }
        // }
        const res = await fetch(url, {
            method: method || 'GET',
            body: data ? data : null,
            headers
        })
        // 返回2xx
        if (res.ok) {
        } else {
            // 缓存未过期
            if (res.status === 304) {
                // token失效
            } else if (res.status === 401) {
            }
        }
        return res.json()
    }
}

export default http
