import { ref } from 'vue'
import { createMD5WebWorkPool } from '../threadsPool'
import { ConcurrentTaskQueue } from './../../../../utils/taskQueue/index'
import { uploadFileAPI } from '@renderer/api/upload'
type FileHash = string
type FileSlice = FormData
// webWorker线程池多线程md5标识符标识
const md5WebWorkerPool = createMD5WebWorkPool(10)
const concurrentTaskQueue = new ConcurrentTaskQueue(10)
// 如果分块上传失败了就保存到这个map中，等待手动点击感叹号上传
// 也就是断点续传。在程序关闭的时候会保存这个Map的文件hash和分块的hash到本地存储中
const sliceMap = new Map<FileHash, FileSlice[]>()

/**
 * 断点上传，点击感叹号重新上传
 * @param fileHash 对应文件的hash值
 */
export function reUploadFileSlice(fileHash: FileHash) {
    // 获取所有缓存的分块上传
    if (sliceMap.has(fileHash)) {
        const fileSlices = sliceMap.get(fileHash)
        fileSlices?.forEach((slice) => {
            concurrentTaskQueue
                .enqueueTask(() => uploadFileAPI(slice))
                .then(
                    () => {
                        // 上传成功就删除该分块
                        const idx = fileSlices.indexOf(slice)
                        if (idx !== -1) {
                            fileSlices.splice(idx, 1)
                        }
                    },
                    (err) => {
                        // 失败暂且未知
                    }
                )
        })
    }
}

function cutFileToArrayBufferSlice(file: File) {
    // 1. 设置分片大小
    const sliceSize = getSliceSize(file)
    // 2. 开始分片为Blob
    const blobs = sliceFile(file, sliceSize)
    // 3. 将Blob转换为ArrayBuffer。Blob要转换为ArrayBuffer才可以在webWorker中transfer控制权
    return Promise.all(blobs.map((blob) => blob.arrayBuffer()))
}

/**
 * 0-5MB	        不分片
 * 5-20MB	        1MB
 * 20-50MB	        2MB
 * 50-200MB	        4MB
 * 200MB-1GB	    10MB
 * >1GB	            10-20MB
 */
function getSliceSize(file: File) {
    const { size } = file
    if (size <= 5 * 1024 * 1024) return size // 不分片
    if (size <= 20 * 1024 * 1024) return 1 * 1024 * 1024
    if (size <= 50 * 1024 * 1024) return 2 * 1024 * 1024
    if (size <= 200 * 1024 * 1024) return 4 * 1024 * 1024
    return 10 * 1024 * 1024 // 默认10MB
}

/**
 *
 * @param file 文件
 * @param sliceSize 切片大小
 * @returns 返回切出的切片数组，是Blob[]
 */
function sliceFile(file: File, sliceSize: number) {
    const slices: Blob[] = []
    let offset = 0
    while (offset < file.size) {
        const slice = file.slice(offset, offset + sliceSize)
        slices.push(slice)
        offset += sliceSize
    }
    return slices
}

/**
 * 分片上传文件，返回当前上传的进度
 * @param file
 */
async function uploadFileBySlice(file: File) {
    const uploadedSize = ref(0)
    const { size: fileSize, name: fileName } = file
    // console.log('file', file)
    // 1. 切为分片，等待全部切完
    const sliceBlobs = await cutFileToArrayBufferSlice(file)
    const sliceSum = sliceBlobs.length
    // 2. 计算文件本身的hash
    const fileHash = await md5WebWorkerPool.enqueueTask(await file.arrayBuffer())
    // 3. 计算每一个的md5
    for (let i = 0; i < sliceSum; ++i) {
        const slice = sliceBlobs[i]
        // 将计算当前slice的md5的任务加入webWorker的线程池中
        md5WebWorkerPool.enqueueTask(slice).then(
            // 当md5计算出来后，就加入并发队列中发送请求上传
            async (md5) => {
                console.log('md5计算完成', md5)
                const sliceFormData = createFormData(
                    slice,
                    md5,
                    fileHash,
                    fileSize,
                    fileName,
                    sliceSum,
                    i + 1
                )
                // 如果多次自动重新上传失败，就会reject，就会进入catch保存该分块
                concurrentTaskQueue
                    .enqueueTask(() => uploadFileAPI(sliceFormData))
                    .catch((err) => {
                        if (sliceMap.has(fileHash)) {
                            sliceMap.set(fileHash, [sliceFormData])
                        } else {
                            sliceMap.get(fileHash).push(sliceFormData)
                        }
                    })
                // 这个文件上传成功，增加已上传的大小
                uploadedSize.value += slice.size
            },
            (err) => {
                console.error('md5计算出错', err)
            }
        )
    }
    return uploadedSize.value / fileSize
}

function createFormData(
    slice: ArrayBuffer,
    sliceHash: string,
    fileHash: string,
    fileSize: number,
    name: string,
    sliceSum: number,
    sliceIndex: number
) {
    console.log('创建formData', slice, sliceHash, fileHash, fileSize, name, sliceSum, sliceIndex)
    const formData = new FormData()
    formData.append('file', slice)
    formData.set('name', name)
    formData.set('fileSize', fileSize)
    formData.set('sliceHash', sliceHash)
    formData.set('fileHash', fileHash)
    formData.set('sliceSum', sliceSum)
    formData.set('sliceIndex', sliceIndex)
    return formData
}

export default uploadFileBySlice
