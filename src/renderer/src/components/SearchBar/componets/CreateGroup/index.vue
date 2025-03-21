<script setup lang="ts">
import SearchBar from '@renderer/components/SearchBar/index.vue'
import Collapse from '@renderer/components/Collapse/index.vue'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { UserInfo } from 'src/utils/types/user'
import { getAllFriendsInfoAPI } from '@renderer/api/friends'
import { menuFriendArr } from './menuList'
import { throttle } from 'lodash-es'
import { createGroupAPI } from '@renderer/api/groups'
// 之后应该要通过id来区分类别
const renderList = ref(menuFriendArr)
const containerRef = ref(null)
const scrollHeight = ref(310)
const props = defineProps<{ close: Function }>()
const friendList = ref<UserInfo>([])
const selectedList = ref([])
const throttleUpdate = throttle(updateScrollHeight, 200)
getAllFriendsInfoAPI().then((res) => {
    friendList.value = res
    // 这里暂时一次性加入
    renderList.value.forEach((arr) => {
        arr.details = friendList.value.map((friend) => ({
            status: false,
            ...friend
        }))
    })
})
onMounted(() => {
    window.addEventListener('resize', throttleUpdate)
    updateScrollHeight()
})
onBeforeMount(() => {
    window.removeEventListener('resize', throttleUpdate)
})
function updateScrollHeight() {
    scrollHeight.value = containerRef.value.offsetHeight - 90
}
async function createGroup() {
    const memberIds = []
    selectedList.value.forEach((i) => memberIds.push(i.friend_id))
    await createGroupAPI(memberIds.join('和'), memberIds)
    props.close()
}
watch(
    () => renderList.value,
    () => {
        const temp = []
        renderList.value.forEach(({ details }) => {
            details.forEach((item) => {
                if (item.status) {
                    temp.push(item)
                }
            })
        })
        selectedList.value = temp
    },
    {
        deep: true
    }
)
</script>

<template>
    <div class="container" ref="containerRef">
        <el-row :style="{ height: '100%' }">
            <el-col :span="12">
                <el-row :span="6">
                    <SearchBar :with-icon="false" class="search-bar" :bottom-border="false" />
                    <div class="sort">
                        <span>按分类创建</span>
                        <span class="more">更多</span>
                    </div>
                </el-row>
                <el-row :span="18">
                    <div class="select-friend-title">选择好友创建</div>
                    <el-scrollbar :max-height="scrollHeight" class="scrollbar">
                        <Collapse :info="renderList" class="collapse">
                            <template #prefix="{ data }">
                                <input
                                    type="checkbox"
                                    @change="() => (data.status = !data.status)"
                                />
                            </template>
                            <template #info="{ data }">
                                {{ data }}
                            </template>
                        </Collapse>
                    </el-scrollbar>
                </el-row>
            </el-col>
            <el-col :span="12" class="right">
                <div class="right-title">创建群聊</div>
                <el-scrollbar> </el-scrollbar>
                <el-button class="confirm-btn" @click="createGroup">确定</el-button>
                <el-button class="cancel-btn" @click="props.close">取消</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss" scoped>
.container {
    height: 400px;
    width: 100%;
    overflow: hidden;
    .search-bar {
        position: relative;
        top: -20px;
        padding: 0;
    }
    .sort {
        position: absolute;
        top: 34px;
        display: flex;
        width: 94%;
        justify-content: space-between;
    }
    .right {
        position: relative;
        .right-title {
            position: absolute;
            font-size: 16px;
            left: 10px;
        }
    }
    .select-friend-title {
        width: 100%;
    }
    .scrollbar {
        width: 100%;
    }
    .collapse {
        position: relative;
        height: 100%;
    }
    .confirm-btn {
        position: absolute;
        bottom: 10px;
        right: 100px;
        height: 30px;
    }
    .cancel-btn {
        position: absolute;
        bottom: 10px;
        right: 20px;
        height: 30px;
    }
}
</style>
