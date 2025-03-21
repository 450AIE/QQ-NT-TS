// import useUserInfoStore from "./../../renderer/src/store/UserInfoStore/index";
// import useBaseConfigStore from "./../../../../qq-nt/src/renderer/src/store/baseConfigStore";
class UpdateMap {
    updateMap: WeakMap<any, Map<string, { latestTime: number, latestValue: any }>>
    constructor(stores: any[]) {
        // console.log('stores', stores)
        this.updateMap = new WeakMap()
        // 先创建所有仓库的map
        stores.forEach((store) => {
            this.updateMap.set(store, new Map())
        })
        // 获取全部仓库的数据，加入map中存储
        stores.forEach((store) => {
            for (const key in store) {
                // console.log('key', key)
                if (Object.prototype.hasOwnProperty.call(store, key)) {
                    // 不收集函数和symbol类型
                    if (typeof store[key] !== 'function' && typeof store[key] !== 'symbol') {
                        const storeMap = this.updateMap.get(store)
                        storeMap.set(key, { latestTime: 0, latestValue: store[key] })
                    }
                }
            }
        })
    }
    // 取出对应仓库对应字段最新值
    getState(store: any, field: string) {
        if (this.updateMap.has(store)) {
            const storeMap = this.updateMap.get(store)
            if (storeMap.has(field)) {
                const { latestValue } = storeMap.get(filed)
                return latestValue
            }
        }
        return null
    }
    // 设置对应仓库对应字段最新值
    setState(store: any, field: string, latestTime: number, latestValue: any) {
        if (this.updateMap.has(store)) {
            const storeMap = this.updateMap.get(store)
            if (storeMap.has(field)) {
                storeMap.set(field, { latestTime, latestValue })
            }
        }
    }
    // 获取对应字段最后的更新时间，没找到或者没有更新过就是0
    // 触发更新
    getLatestTime(store: any, field: string) {
        if (this.updateMap.has(store)) {
            const storeMap = this.updateMap.get(store)
            if (storeMap.has(field)) {
                const { latestTime } = storeMap.get(field)
                return latestTime
            }
        }
        return 0
    }
}

export interface Update {
    // 触发更新的仓库的标识
    storeKey: string
    // 触发更新的字段
    field: string
    // 触发更新的函数名
    func: string
    // 触发更新的最新值
    data: string
    // 触发更新的时间戳
    time: number
    // 是主动触发的更新还是被动触发的
    // 被动触发的更新不会通知其他窗口更新
    isPositive: boolean
}

// 在IPC通信中传递的就是序列化的Update
export function createUpdate(
    storeKey: string,
    field: string,
    func: string,
    data: string,
    time: number,
    isPositive: boolean
): Update {
    return {
        // 触发更新的仓库的标识
        storeKey,
        // 触发更新的字段
        field,
        // 触发更新的函数名
        func,
        // 触发更新的最新值
        data,
        // 触发更新的时间戳
        time,
        isPositive
    }
}

export default function initUpdateMap(stores: any[]) {
    return new UpdateMap([...stores])
}
