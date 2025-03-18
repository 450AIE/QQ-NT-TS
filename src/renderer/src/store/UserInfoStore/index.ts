import { ref } from "vue";
import { UserInfo } from "./../../../../utils/types/user";
import { defineStore } from "pinia";
import { isEmpty } from "lodash";

const useUserInfoStore = defineStore('userInfoStore', () => {
    const storeKey = 'userInfoStore'
    const userInfo: UserInfo = ref({})
    const setUserInfo = (newUserInfo: UserInfo, isPositive: boolean) => {
        if (isEmpty(newUserInfo)) return false
        userInfo.value = newUserInfo
        return isPositive
    }
    return {
        storeKey,
        userInfo,
        setUserInfo
    }
})

export default useUserInfoStore
