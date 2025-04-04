import http from '@renderer/utils/http/http'

export function uploadFileAPI(formData: FormData) {
    return http({
        url: 'http://localhost:8004/upload',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
