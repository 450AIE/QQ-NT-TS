import { ref } from "vue";
import { UserInfo } from "./../../../../utils/types/user";
import { defineStore } from "pinia";
import { isEqual } from "lodash";

const useUserInfoStore = defineStore('userInfoStore', () => {
    const storeName = 'userInfoStore'
    const userInfo: UserInfo = ref({})
    const setUserInfo = (newUserInfo: UserInfo) => {
        if (isEqual(userInfo.value, newUserInfo)) return false
        userInfo.value = newUserInfo
        return true
    }
    return {
        storeName,
        userInfo,
        setUserInfo
    }
})

export default useUserInfoStore
