<script lang="ts" setup>
import { getUserInfoAPI } from '@renderer/api/user'
import { UserInfo } from 'src/utils/types/user'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const friendInfo = ref<UserInfo>({})
function transToSession() {
    router.push({ path: `/session`, query: { type: 'user', user_id: friendInfo.value.user_id } })
}
watch(
    () => route.params,
    () => {
        const { friendId } = route.params
        getUserInfoAPI(friendId).then((res) => {
            friendInfo.value = res
        })
    },
    {
        deep: true,
        immediate: true
    }
)
</script>

<template>
    <div class="container">
        <div class="avatar-container">
            <el-avatar class="avatar" :src="friendInfo.avatar_url" />
            <div class="name">{{ friendInfo.username ?? '后端之神' }}</div>
            <div class="id">{{ friendInfo.user_id ?? 'id暂无' }}</div>
            <div class="status">{{ '状态（暂未实现）' }}</div>
        </div>
        <ul class="info-container">
            <li class="basic-info">基础信息</li>
            <li class="introduce">{{ friendInfo.extra ?? '暂无自我介绍' }}</li>
            <li class="friend-type">好友分组（暂未实现）</li>
            <li class="signature">签名（暂未实现）</li>
        </ul>
        <div class="btn-container">
            <el-button class="share btn">分享</el-button>
            <el-button class="communication btn">音视频通话</el-button>
            <el-button class="send-msg btn" type="primary" @click="transToSession"
                >发消息</el-button
            >
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    height: 100%;
    width: 100%;
    // background-color: lightcoral;
    .avatar-container {
        position: absolute;
        top: 50px;
        height: 160px;
        left: 50%;
        transform: translateX(-50%);
        // background-color: red;
        width: 80%;
        max-width: 1000px;
        .avatar {
            position: absolute;
            top: 50%;
            height: 100px;
            width: 100px;
            transform: translateY(-50%);
        }
        .name {
            position: absolute;
            top: 30px;
            left: 128px;
        }
        .id {
            position: absolute;
            top: 64px;
            left: 128px;
        }
        .status {
            position: absolute;
            top: 100px;
            left: 128px;
        }
    }
    .info-container {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 240px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        list-style: none;
        max-width: 1000px;
        // background-color: lightblue;
        li {
            height: 35px;
            display: flex;
            align-items: center;
        }
    }
    .btn-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 100%;
        height: 60px;
        bottom: 20%;
        .btn {
            width: 100px;
            height: 30px;
        }
    }
}
</style>
