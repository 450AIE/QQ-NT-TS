import useBaseConfigStore from '../store/BaseConfigStore'
import useUserInfoStore from '../store/UserInfoStore'

/**
 * 当窗口创建时，使用这个钩子，会自动获取最新的pinia状态来更新,
 */
function useBeforeCreateGetUpdatedPiniaState() {
    // ElectronAPI.notifyAllWindowsNewWindowCreated()
    // ElectronAPI.onceListenerToGetUpdatedPiniaState((_, jsonStore) =>
    //     getUpdatedPiniaState(_, jsonStore, isSettingViews)
    // )
    ElectronAPI.notifyNewWindowCreated()
    ElectronAPI.onListenLatestPiniaStoreEmit(getUpdatedPiniaState)
}
/**
 * 调用该store内的所有set方法修改数据，这里暂时都是baseConfigStore和userInfoStore
 * @param {json} jsonStore
 */
function getUpdatedPiniaState(_, jsonStore) {
    // 同步仓库属性
    const [newUserInfoStore, newBaseConfigStore] = JSON.parse(jsonStore)
    // console.log('收到的', newBaseConfigStore, newUserInfoStore)
    const baseConfigStore = useBaseConfigStore()
    const userInfoStore = useUserInfoStore()
    for (const key in baseConfigStore) {
        if (Object.prototype.hasOwnProperty.call(baseConfigStore, key)) {
            // 调用set函数修改state
            if (key.startsWith('set') && typeof baseConfigStore[key] === 'function') {
                // 获取变量名，没有首字母
                const dataNameWithoutFirstChar = key.slice(4)
                // 获取首字母
                const dataNameFirstChar = key.slice(3, 4).toLowerCase()
                const dataName = dataNameFirstChar + dataNameWithoutFirstChar
                // console.log('进入调用了', key, newBaseConfigStore[dataName])
                baseConfigStore[key](newBaseConfigStore[dataName], false)
            }
        }
    }
    for (const key in userInfoStore) {
        if (Object.prototype.hasOwnProperty.call(userInfoStore, key)) {
            // 调用set函数修改state
            if (key.startsWith('set') && typeof userInfoStore[key] === 'function') {
                // 获取变量名，没有首字母
                const dataNameWithoutFirstChar = key.slice(4)
                // 获取首字母
                const dataNameFirstChar = key.slice(3, 4).toLowerCase()
                const dataName = dataNameFirstChar + dataNameWithoutFirstChar
                userInfoStore[key](newUserInfoStore[dataName], false)
            }
        }
    }
}




export default useBeforeCreateGetUpdatedPiniaState
