import { imgReg, srcReg } from '@renderer/utils/regs'
class Note {
    // 暂无
    videoUrlArr = []
    pictureUrlArr: Array<string> = []
    time: number
    source = ''
    // 暂未实现
    fileUrlArr: Array<string> = []
    content = null
    title: string = ''
    type = ''
    constructor(htmlStr: string, title = '', type) {
        this.type = type
        this.title = title
        this.extractImg(htmlStr)
        this.time = new Date().getTime()
    }
    // 提取其中img的src链接
    extractImg(htmlStr: string) {
        const imgArr = htmlStr.match(imgReg)
        for (let i = 0; i < imgArr!.length; i++) {
            const src = imgArr![i].match(srcReg)
            this.pictureUrlArr.push(src![1])
        }
    }
}
export default Note
