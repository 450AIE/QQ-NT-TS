export function isFormData(v) {
    return getType(v) === 'FormData'
}

function getType(data) {
    return Object.prototype.toString.call(data).slice(8, -1)
}
