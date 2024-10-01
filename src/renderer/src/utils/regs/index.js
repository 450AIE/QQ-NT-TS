// 提取出所有img标签
export const imgReg = /<img.*?(?:>|\/>)/gi
// 提取出img中的src
export const srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i
