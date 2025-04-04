// wasm为预处理好的二进制，性能高
import { md5 } from 'hash-wasm'
// 负责将收到的buffer计算出一个md5作为标识符
self.addEventListener('message', async ({ data }) => {
    const hash = await md5(new Uint8Array(data))
    // 计算完毕，返回
    self.postMessage(hash)
})
