import { ref } from 'vue'
import { UserInfo } from './../../../../utils/types/user'
import { defineStore } from 'pinia'
import { isEmpty } from 'lodash-es'
import { DeviceInfo } from 'src/utils/types/device'
import { Message } from './../../../../utils/types/message'
const useUserInfoStore = defineStore('userInfoStore', () => {
    const storeKey = 'userInfoStore'
    const userInfo: UserInfo = ref({})
    const setUserInfo = (newUserInfo: UserInfo, isPositive: boolean) => {
        if (isEmpty(newUserInfo)) return false
        userInfo.value = newUserInfo
        return isPositive
    }
    // 消息列表，用于给SQLITE保存（这个不需要同步）
    const messageMap = ref(new Map<number, Message[]>())
    // 这个消息列表是本地读出来后使用的，上面那个是用来给sqlite缓存用的，上面部分缓存了
    // 就会清除，所以要用这个展示消息
    const localMessageMap = ref(new Map<number, Message[]>())
    const deviceInfo: DeviceInfo = ref({})
    const setDeviceInfo = (newInfo: DeviceInfo, isPositive: boolean = true) => {
        if (isEmpty(newInfo)) return false
        deviceInfo.value = newInfo
        return isPositive
    }
    const addMessage = (key: string, value: Message) => {
        if (messageMap.value.has(key)) {
            messageMap.value.get(key).push(value)
        } else {
            messageMap.value.set(key, [value])
        }
    }
    const clearMessageMap = () => messageMap.value.clear()
    // 退出登陆后要重置
    const clearLocalMessageMap = () => localMessageMap.value.clear()
    const addLocalMessageMap = (key: string, value: Message) => {
        if (localMessageMap.value.has(key)) {
            localMessageMap.value.get(key).push(value)
        } else {
            localMessageMap.value.set(key, [value])
        }
    }
    return {
        deviceInfo,
        storeKey,
        userInfo,
        messageMap,
        localMessageMap,
        setUserInfo,
        setDeviceInfo,
        addMessage,
        clearMessageMap,
        addLocalMessageMap,
        clearLocalMessageMap
    }
})

export default useUserInfoStore
