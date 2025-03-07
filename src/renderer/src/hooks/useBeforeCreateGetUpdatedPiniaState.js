import useBaseConfigStore from '../store/BaseConfigStore'
import useUserInfoStore from '../store/UserInfoStore'

/**
 * 当窗口创建时，使用这个钩子，会自动获取最新的pinia状态来更新,
 */
function useBeforeCreateGetUpdatedPiniaState(isSettingViews = false) {
    ElectronAPI.notifyAllWindowsNewWindowCreated()
    ElectronAPI.onceListenerToGetUpdatedPiniaState((_, jsonStore) =>
        getUpdatedPiniaState(_, jsonStore, isSettingViews)
    )
}
/**
 * 调用该store内的所有set方法修改数据，这里暂时都是baseConfigStore
 * @param {json} jsonStore
 */
function getUpdatedPiniaState(_, jsonStore, isSettingViews = false) {
    // 同步仓库属性
    let store
    const { storeName } = JSON.parse(jsonStore)
    if (storeName === 'baseConfigStore') {
        store = useBaseConfigStore()
    } else if (storeName === 'userInfoStore') {
        store = useUserInfoStore()
    }
    for (const key in store) {
        if (Object.prototype.hasOwnProperty.call(store, key)) {
            // 调用set函数修改state
            if (key.startsWith('set') && typeof store[key] === 'function') {
                if (isSettingViews && key == 'setGlobalFontSize') continue
                // 获取变量名，没有首字母
                const dataNameWithoutFirstChar = key.slice(4)
                // 获取首字母
                const dataNameFirstChar = key.slice(3, 4).toLowerCase()
                const dataName = dataNameFirstChar + dataNameWithoutFirstChar
                store[key](store[dataName])
            }
        }
    }
}

export default useBeforeCreateGetUpdatedPiniaState
