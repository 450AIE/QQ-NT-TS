import { ref } from "vue";
import { UserInfo } from "./../../../../utils/types/user";
import { defineStore } from "pinia";
import { isEmpty } from "lodash-es";
import { DeviceInfo } from "src/utils/types/device";
const useUserInfoStore = defineStore('userInfoStore', () => {
    const storeKey = 'userInfoStore'
    const userInfo: UserInfo = ref({})
    const setUserInfo = (newUserInfo: UserInfo, isPositive: boolean) => {
        if (isEmpty(newUserInfo)) return false
        userInfo.value = newUserInfo
        return isPositive
    }
    const deviceInfo: DeviceInfo = ref({})
    const setDeviceInfo = (newInfo: DeviceInfo, isPositive: boolean = true) => {
        if (isEmpty(newInfo)) return false
        deviceInfo.value = newInfo
        return isPositive
    }
    return {
        deviceInfo,
        storeKey,
        userInfo,
        setUserInfo,
        setDeviceInfo
    }
})

export default useUserInfoStore
