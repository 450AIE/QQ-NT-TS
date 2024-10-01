/**
 * 用在好友列表的时间标识
 * @param {*} time
 */
export function friendSessionTimeFormat(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()

    const oneDay = 24 * 60 * 60 * 1000
    const diffDays = Math.floor((now - date) / oneDay)

    if (diffDays === 0) {
        // 今天
        return date.toTimeString().slice(0, 5) // 返回 HH:MM 格式
    } else if (diffDays === 1) {
        // 昨天
        return '昨天'
    } else if (diffDays <= 7) {
        // 上周
        const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        return `上周${daysOfWeek[date.getDay()]}`
    } else {
        // 更早的时间
        return (
            date.toISOString().slice(0, 10).replace(/-/g, '/') +
            ' ' +
            date.toTimeString().slice(0, 5)
        )
    }
}

/**
 * 用于'收藏'的文件的日期标识
 * @param {*} time
 */
export function collectTimeFormat(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()

    const isToday = date.toDateString() === now.toDateString()
    const isYesterday = (now - date) / (1000 * 60 * 60 * 24) === 1

    const timeString = date.toTimeString().slice(0, 5) // 获取 HH:MM 格式

    if (isToday) {
        return `今天 ${timeString}`
    } else if (isYesterday) {
        return `昨天 ${timeString}`
    } else {
        return date.toISOString().slice(0, 10).replace(/-/g, ':') // 返回 YYYY:MM:DD 格式
    }
}
