<script lang="ts" setup>
import AppOperate from '@components/AppOperate/index.vue'
import UserAvatar from '../../assets/user.png'
import useUpdatePiniaStateSync from '@renderer/hooks/useUpdatePiniaStateSync'
import { onMounted, onUpdated, ref } from 'vue'
import { loginAPI, registerAPI } from '@renderer/api/login'
import { getUserInfoAPI } from '@renderer/api/user'
import useUserInfoStore from '@renderer/store/UserInfoStore'

useUpdatePiniaStateSync()
const account = ref('')
const password = ref('')
const userInfoStore = useUserInfoStore()
async function login() {
    const systemInfo = await ElectronAPI.getDeviceInfo()
    localStorage.setItem('device', JSON.stringify(systemInfo))
    // 注意将收到的device_id存储好
    // 这里要去请求接口获取设备号
    let response = await registerAPI(systemInfo)
    // // 先实现聊天功能，后迁移状态管理
    const { device_id } = response
    localStorage.setItem('device_id', device_id)
    response = await loginAPI(account.value, password.value, device_id)
    const { token, user_id } = response
    localStorage.setItem('token', token)
    localStorage.setItem('user_id', user_id)
    // 发送protobuf登陆
    await ElectronAPI.login(JSON.stringify({ userId: user_id, deviceId: device_id }))
    account.value = ''
    password.value = ''
    ElectronAPI.createMainWindow()
}
</script>

<template>
    <div class="container background-gradient">
        <AppOperate class="operate" :type="2" />
        <div class="avatar-container">
            <el-avatar class="avatar" :src="UserAvatar" />
        </div>
        <el-input class="account-inp" v-model="account" placeholder="输入QQ账号" />
        <el-input class="password-inp" v-model="password" show-password placeholder="输入QQ密码" />
        <el-button class="login-btn" :disabled="!account || !password" @click="login"
            >登陆</el-button
        >
    </div>
</template>

<style lang="scss" scoped>
.background-gradient {
    background: linear-gradient(to bottom, #e0f7fa, #ffffff);
}

.container {
    -webkit-app-region: drag;
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .avatar-container {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        .avatar {
            height: 120px;
            width: 120px;
        }
    }
    .account-inp {
        position: absolute;
        top: 200px;
        width: 80%;
        height: 50px;
        border-radius: 10px;
        left: 50%;
        transform: translateX(-50%);
    }
    .password-inp {
        position: absolute;
        top: 270px;
        width: 80%;
        height: 50px;
        border-radius: 10px;
        left: 50%;
        transform: translateX(-50%);
    }
    .login-btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 40px;
        background-color: #97d6ff;
        color: #fff;
        border-radius: 10px;
        bottom: 100px;
    }
}

.operate {
    -webkit-app-region: no-drag;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 120;
}
</style>
