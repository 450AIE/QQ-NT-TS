<script setup lang="ts">
import { ref, watch } from 'vue'
import InfoBlock from '@renderer/components/InfoBlock/index.vue'
import { useRoute } from 'vue-router'
import { useReactiveHeight } from '@renderer/hooks/useReactiveHeight'
import { agreeFriendApplicationAPI, getFriendApplicationListAPI } from '@renderer/api/friends'
import { getAllGroupsInfoAPI } from '@renderer/api/groups'
import { UserInfo } from 'src/utils/types/user'
import { GroupInfo } from 'src/utils/types/group'

let notificationList = ref<UserInfo[] | GroupInfo[]>([])
const scrollbarHeight = useReactiveHeight(80)
const route = useRoute()
// 根据params判断当前是好友通知还是群通知
if (route.params.type == 'user') {
    // 获取全部通知，并展示
    getFriendApplicationListAPI().then((res) => {
        notificationList.value = res
    })
} else if (route.params.type == 'group') {
    getAllGroupsInfoAPI().then((res) => {})
}
// 监听query值的变化
watch(
    () => route.params.type,
    (newType, oldType) => {
        if (route.params.type == 'user') {
            // 获取全部通知，并展示
            getFriendApplicationListAPI().then((res) => {
                console.log('查看', res)
            })
        } else if (route.params.type == 'group') {
            getAllGroupsInfoAPI().then((res) => {})
        }
    }
)

// function agreeFriendApplication(user_id: string, remarks?: string = '') {
//     agreeFriendApplicationAPI(user_id)
// }

function agreeApplication(id) {
    if (route.params.type === 'user') {
        agreeFriendApplicationAPI(id)
    } else if (route.params.type == 'group') {
    }
}
</script>

<template>
    <div class="container-a">
        <div class="title-container">
            <span class="title">
                {{ route.params.type === 'user' ? '好友通知' : '群通知' }}
            </span>
        </div>
        <div class="content-container">
            <div class="virtual-list-container">
                <!-- 先无限滚动，后虚拟列表 -->
                <el-scrollbar :height="scrollbarHeight">
                    <InfoBlock
                        v-for="(item, idx) in notificationList"
                        :key="idx"
                        class="info-block"
                    >
                        <template #info> {{ item.nickname }} </template>
                        <template #button>
                            <el-button @click="() => agreeApplication(item.friend_id)"
                                >同意</el-button
                            >
                        </template>
                    </InfoBlock>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container-a {
    .title-container {
        position: relative;
        height: 70px;
        width: 100%;
        .title {
            position: absolute;
            left: 20px;
            top: 25px;
            font-size: 18px;
        }
    }
    .content-container {
        height: calc(100vh - 70px);
        .virtual-list-container {
            margin: 0 auto;
            width: 80%;
            max-width: 700px;
            .info-block {
                margin-bottom: 10px;
                border-radius: 10px;
            }
        }
    }
}
</style>
