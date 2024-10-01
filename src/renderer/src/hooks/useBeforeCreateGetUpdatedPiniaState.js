import useBaseConfigStore from '../store/baseConfigStore'

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
    const baseConfigStore = useBaseConfigStore()
    const store = JSON.parse(jsonStore)
    // console.log('收到的store是:',store)
    for (const key in baseConfigStore) {
        if (baseConfigStore.hasOwnProperty(key)) {
            // 调用set函数修改state
            if (key.startsWith('set') && typeof baseConfigStore[key] === 'function') {
                if (isSettingViews && key == 'setGlobalFontSize') continue
                // 获取变量名，没有首字母
                const dataNameWithoutFirstChar = key.slice(4)
                // 获取首字母
                const dataNameFirstChar = key.slice(3, 4).toLowerCase()
                const dataName = dataNameFirstChar + dataNameWithoutFirstChar
                baseConfigStore[key](store[dataName])
            }
        }
    }
}

export default useBeforeCreateGetUpdatedPiniaState
