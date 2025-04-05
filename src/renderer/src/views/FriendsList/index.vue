<script lang="ts" setup>
import InfoBlock from '@renderer/components/InfoBlock/index.vue'
import { onActivated, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { dragHorizontal } from '../../utils/dragFunc'
import AppOerate from '@renderer/components/AppOperate/index.vue'
import SearchBar from '@renderer/components/SearchBar/index.vue'
import { getAllFriendsInfoAPI } from '@renderer/api/friends'
import { UserInfo } from 'src/utils/types/user'
import { getAllGroupsInfoAPI } from '@renderer/api/groups'
import { GroupInfo } from 'src/utils/types/group'
import LeftSubOptions from '@renderer/components/LeftSubOptions/index.vue'

defineOptions({
    name: 'FriendList'
})
onActivated(() => console.log('friend'))
//这个不确定是否写成响应式
const friendsList = ref<UserInfo[]>([])
const groupsList = ref<GroupInfo[]>([])
const right = ref(null)
//计算好友列表的滚动条出现邻接值
const scrollHeight = ref(window.innerHeight - 70)
const iconType = ref(0)
//要在setup的时候就获取router
const router = useRouter()
//ref元素
const left = ref(null)
const resize = ref(null)
// 当前正在对话的user_id或者group_id
const isSessionID = ref('')
const userId = localStorage.getItem('user_id')
// const deviceId = localStorage.getItem('device_id')
getAllFriendsInfoAPI().then((res) => {
    // 不能和自己聊天
    friendsList.value = res.filter((i) => i.friend_id !== userId)
})
getAllGroupsInfoAPI().then((res) => {
    groupsList.value = res
})
//水平拖拽函数
onMounted(() => {
    dragHorizontal(resize, left, 220, 450)
    window.onresize = () => {
        scrollHeight.value = window.innerHeight - 70
        //左侧小于最大时，拉长左侧
        // if(left.value.offsetWidth < 530){
        //     left.value.style.width = window.innerWidth - 60 -2 -300 + 'px'
        // }
        //右侧的不变，改变左边
        //左右合并,加上图标
        if (window.innerWidth < 512) {
            left.value.style.width = window.innerWidth - 60 - 2 + 'px'
            iconType.value = 1
        } else {
            iconType.value = 0
            if (window.innerWidth >= 582) {
                left.value.style.width = window.innerWidth - 60 - 2 - 300 + 'px'
            } else {
                left.value.style.width = '220px'
            }
        }
    }
})
//再次清除监听，以防万一，resize上的会自动解绑
onUnmounted(() => {
    document.onmousemove = null
    document.onmouseup = null
    window.onresize = null
})

// 根据传递的参数判断是用户还是群聊
function openFriendSession(user_id) {
    isSessionID.value = 'user' + user_id
    router.push({ path: '/session', query: { type: 'user', user_id } })
}
function openGroupSession(group_id) {
    isSessionID.value = 'group' + group_id
    router.push({ path: '/session', query: { type: 'group', group_id } })
}
</script>

<template>
    <LeftSubOptions />
    <div class="container">
        <div ref="left" class="left-view">
            <SearchBar />
            <div class="scroll">
                <el-scrollbar :max-height="scrollHeight">
                    <InfoBlock
                        v-for="(item, index) in friendsList"
                        :key="item.friend_id"
                        :data="item"
                        :style="{
                            backgroundColor:
                                isSessionID === 'user' + item.friend_id ? '#0090F0' : ''
                        }"
                        class="info-block"
                        @click="() => openFriendSession(item.friend_id)"
                    >
                        <template #info="{ data }">
                            <div class="avatar">
                                <el-avatar :src="data.avatar_url" />
                            </div>
                            <div class="name text-overflow-hidden">
                                {{ data }}
                            </div>
                            <div class="last-dialog text-overflow-hidden">上次对话</div>
                        </template>
                    </InfoBlock>
                    <InfoBlock
                        v-for="(item, index) in groupsList"
                        :key="item.group_id"
                        :data="item"
                        :style="{
                            backgroundColor:
                                isSessionID === 'group' + item.group_id ? '#0090F0' : ''
                        }"
                        class="info-block"
                        @click="() => openGroupSession(item.group_id)"
                    >
                        <template #info="{ data }">
                            <div class="avatar">
                                <el-avatar :src="data.avatar_url" />
                            </div>
                            <div class="name text-overflow-hidden">
                                {{ data }}
                            </div>
                            <div class="last-dialog text-overflow-hidden">上次对话</div>
                        </template>
                    </InfoBlock>
                </el-scrollbar>
            </div>
        </div>
        <div ref="resize" class="resize"></div>
        <div ref="right" class="right-view">
            <router-view />
        </div>
    </div>
    <AppOerate class="app-operate" :type="iconType"></AppOerate>
</template>

<style scoped lang="scss">
.app-operate {
    right: 0;
    top: 0;
}

.container {
    display: flex;
    height: 100vh;
    width: 100%;
    position: relative;

    .left-view {
        flex-shrink: 0;
        position: relative;
        min-width: 220px;
        width: 220px;
        max-width: 450px;
    }

    .resize {
        width: 2px;
        height: 100vh;
        background-color: var(--resize-bar-background-color);
        cursor: ew-resize;
    }

    .right-view {
        flex: 1;
        height: 100vh;
        min-width: 0;
        background-color: var(--background-gray1-color);
    }
    .info-block {
        align-items: center;
        position: relative;
        .avatar {
            display: flex;
            align-items: center;
            position: absolute;
            width: 40px;
            height: 60px;
        }
        .name {
            margin-left: 44px;
        }
        .last-dialog {
            margin-left: 44px;
        }
    }
    .info-block:hover {
        background-color: var(--background-gray2-color);
    }
}
</style>
