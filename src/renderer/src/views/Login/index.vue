<script setup>
import AppOperate from '@components/AppOperate/index.vue'
import UserAvatar from '../../assets/user.png'
// import useUpdatePiniaStateSync from '@renderer/hooks/useUpdatePiniaStateSync'
import { ref } from 'vue'
import { registerAPI } from '@renderer/api/login'

// useUpdatePiniaStateSync()
const account = ref('')
const password = ref('')

async function login() {
    // const systemInfo = await ElectronAPI.getDeviceInfo()
    // const response = await registerAPI(systemInfo)
    // 注意将收到的device_id存储好
    // 这里要去请求接口获取设备号，然后打开主页面
    ElectronAPI.createMainWindow()
}
</script>

<template>
    <AppOperate class="operate" />
    <div class="container background-gradient">
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
    position: absolute;
    top: 0;
    right: 0;
}
</style>
