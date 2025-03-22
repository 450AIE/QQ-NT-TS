<script lang="ts" setup>
import useBeforeCreateGetUpdatedPiniaState from '@renderer/hooks/useBeforeCreateGetUpdatedPiniaState'
import useUpdatePiniaStateSync from '@renderer/hooks/useUpdatePiniaStateSync'
import SearchBar from '@renderer/components/SearchBar/index.vue'
import AppOperate from '@renderer/components/AppOperate/index.vue'
import InfoBlock from '@renderer/components/InfoBlock/index.vue'
import { useReactiveHeight } from '@renderer/hooks/useReactiveHeight'
// import GroupInfoBlock from '@renderer/views/AddFriendAndGroup/components/GroupInfoBlock/index.vue'
import { ref } from 'vue'
import { searchUserAPI } from '@renderer/api/user'
import { UserInfo } from 'src/utils/types/user'
import { GroupInfo } from 'src/utils/types/group'
import { applyForBeingFriendAPI } from '@renderer/api/friends'
import FixedVirtualList from '@renderer/components/FixedVirtualList/index.vue'

useBeforeCreateGetUpdatedPiniaState()
useUpdatePiniaStateSync()
const userId = localStorage.getItem('user_id')
// 请求到的所哟数据，用来渲染
const userRenderList = ref<UserInfo[]>([])
const groupRenderList = ref<GroupInfo[]>([])
// 控制选择的标签
const selectedLabelID = ref<'user' | 'group'>('user')
const inputValue = ref<string>('')
const scrollHeight = useReactiveHeight(140)
async function search() {
    if (selectedLabelID.value === 'user') {
        const res = await searchUserAPI(inputValue.value)
        // 过滤掉自己
        if (res) {
            userRenderList.value = res.filter((i) => i.user_id != userId)
        }
    } else if (selectedLabelID.value === 'group') {
    }
}
async function applyToAddFriend(user_id: string, remarks?: string = '', desc?: string = '') {
    await applyForBeingFriendAPI(user_id, remarks, desc)
}
</script>

<template>
    <div class="container">
        <AppOperate class="app-operate" />
        <div class="input-container">
            <SearchBar
                :value="inputValue"
                :set-value="(val) => (inputValue = val)"
                :with-icon="false"
                :bottom-border="false"
                :on-enter="search"
            />
        </div>
        <el-tabs
            v-model="selectedLabelID"
            class="tabs"
            @tab-click="(tab) => (selectedLabelID = tab.props.name)"
        >
            <el-tab-pane label="用户" name="user">
                <FixedVirtualList
                    :height="scrollHeight + 'px'"
                    :list-data="userRenderList"
                    :item-size="100"
                    :item-count="userRenderList.length"
                    :buffer="5"
                    width="100%"
                    class="virtual-list"
                >
                    <template #default="{ data }">
                        <InfoBlock class="info-block">
                            <template #info>
                                <div class="info">
                                    <el-avatar :src="data.avatar_url" class="avatar" />
                                    <span class="username">{{ data.username }}</span>
                                    <span class="userid">{{ data.user_id || '暂无' }}</span>
                                </div>
                            </template>
                            <template #button>
                                <el-button @click="() => applyToAddFriend(data.user_id)"
                                    >添加</el-button
                                >
                            </template>
                        </InfoBlock>
                    </template>
                </FixedVirtualList>
            </el-tab-pane>
            <el-tab-pane label="群聊" name="group">
                <FixedVirtualList
                    :height="scrollHeight + 'px'"
                    :list-data="groupRenderList"
                    :item-size="100"
                    :item-count="groupRenderList.length"
                    :buffer="5"
                    width="100%"
                    class="virtual-list"
                >
                    <template #default="{ data }">
                        <InfoBlock class="info-block">
                            <template #info>
                                <div class="info">
                                    <el-avatar :src="data.avatar_url" class="avatar" />
                                    <span class="username">{{ data.username }}</span>
                                    <span class="userid">{{ data.user_id || '暂无' }}</span>
                                </div>
                            </template>
                            <template #button>
                                <el-button @click="() => applyToAddFriend(data.user_id)"
                                    >添加</el-button
                                >
                            </template>
                        </InfoBlock>
                    </template>
                </FixedVirtualList>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="scss" scoped>
.container {
    -webkit-app-region: drag;
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 1;
    .input-container {
        position: relative;
        top: 20px;
        width: calc(100% - 20px);
        margin: 0 auto;
    }
    .tabs {
        margin: 0 20px;
        :deep() {
            .el-tabs__nav-scroll {
                &::after {
                    background-color: 'none';
                    height: 0px;
                }
            }
        }
        .virtual-list {
        }
        .info-block {
            margin-bottom: 10px;
            border-radius: 10px;
            .info {
                position: relative;
                height: 100%;
                .avatar {
                    position: absolute;
                    top: 50%;
                    height: 45px;
                    width: 45px;
                    transform: translateY(-50%);
                    left: 5px;
                    margin: auto 0;
                }
                .username {
                    position: absolute;
                    left: 55px;
                    top: 8px;
                }
                .userid {
                    position: absolute;
                    left: 55px;
                    bottom: 8px;
                }
            }
        }
    }
}
.app-operate {
    position: absolute;
    background-color: #fff;
    -webkit-app-region: no-drag;
    z-index: 9;
}
</style>
