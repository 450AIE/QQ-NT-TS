import { onBeforeUnmount } from 'vue'
import useBaseConfigStore from '../store/BaseConfigStore'
import useUserInfoStore from '../store/UserInfoStore'

/**
 * 调用onListenerPiniaStateUpdate监听pinia状态更新并且更新本窗口的状态，自带onBeforeUnmount移除监听
 */
function useUpdatePiniaStateSync() {
    onBeforeUnmount(() => {
        // console.log('移除监听')
        ElectronAPI.removeListenReceiveNewUpdateState()
    })
    ElectronAPI.onListenReceiveUpdateState(getUpdatedPiniaState)

}


function getUpdatedPiniaState(_, update) {
    update = JSON.parse(update)
    let store
    const baseConfigStore = useBaseConfigStore()
    const userInfoStore = useUserInfoStore()
    if (baseConfigStore.storeKey === update.storeKey) {
        store = baseConfigStore
    } else if (useBaseConfigStore.storeKey === update.storeKey) {
        store = userInfoStore
    }
    // 这里只需要执行单个函数更新即可，而且注意是被动更新
    store[update.func](update.data, false)
}

export default useUpdatePiniaStateSync
