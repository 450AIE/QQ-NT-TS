/**
 * @param str 需要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeHTML(str: string) {
    const attrEscapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;', // 防御反引号XSS
        '/': '&#x2F;', // 防御闭合标签
        '=': '&#x3D;', // 防御属性赋值
        '(': '&#x28;', // 防御事件处理器
        ')': '&#x29;',
        '{': '&#x7B;',
        '}': '&#x7D;',
        ':': '&#x3A;' // 防御伪协议（如javascript:）
    }
    return str.replace(/[&<>"'`/=(){}:]/g, (char) => attrEscapeMap[char])
}
/**
 * @param str 需要从解码的字符串
 * @returns 解码后的字符串
 */
export function decodeHTML(str: string) {
    const decodeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#96;': '`',
        '&#x2F;': '/',
        '&#x3D;': '=',
        '&#x28;': '(',
        '&#x29;': ')',
        '&nbsp;': ' '
    }
    return str.replace(
        /&(amp|lt|gt|quot|#39|#96|#x2F|#x3D|#x28|#x29|nbsp);/g,
        (match) => decodeMap[match] || match
    )
}
