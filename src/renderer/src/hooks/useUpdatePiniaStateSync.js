import { onBeforeUnmount } from 'vue'
import useBaseConfigStore from '../store/baseConfigStore'

/**
 * 调用onListenerPiniaStateUpdate监听pinia状态更新并且更新本窗口的状态，自带onBeforeUnmount移除监听
 */
function useUpdatePiniaStateSync() {
    // console.log('开启监听')
    ElectronAPI.onListenerPiniaStateUpdate(getUpdatedPiniaState)
    onBeforeUnmount(() => {
        // console.log('移除监听')
        ElectronAPI.removeListenerPiniaStateUpdate()
    })
}

function getUpdatedPiniaState(_, func, args) {
    // if(func === 'setSubOptionsManageList')    console.log('调用了',func,'(',...JSON.parse(args),')函数')
    const baseConfigStore = useBaseConfigStore()
    baseConfigStore[func](...JSON.parse(args))
}

export default useUpdatePiniaStateSync
