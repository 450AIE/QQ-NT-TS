<script lang="ts" setup>
import useBeforeCreateGetUpdatedPiniaState from '@renderer/hooks/useBeforeCreateGetUpdatedPiniaState'
import useUpdatePiniaStateSync from '@renderer/hooks/useUpdatePiniaStateSync'
import SearchBar from '@renderer/components/SearchBar/index.vue'
import AppOperate from '@renderer/components/AppOperate/index.vue'
import GroupInfoBlock from '@renderer/views/AddFriendAndGroup/components/GroupInfoBlock/index.vue'
import { ref } from 'vue'

useBeforeCreateGetUpdatedPiniaState()
useUpdatePiniaStateSync()
// 控制选择的标签
const selectedLabelID = ref<string>('user')
const inputValue = ref<string>('')
</script>

<template>
    <AppOperate />
    <div class="container">
        <div class="input-container">
            <SearchBar
                :value="inputValue"
                :set-value="(val) => (inputValue = val)"
                :with-icon="false"
                :bottom-border="false"
            />
        </div>
        <el-tabs
            v-model="selectedLabelID"
            class="tabs"
            @tab-click="(tab) => (selectedLabelID = tab.props.name)"
        >
            <el-tab-pane label="用户" name="user">
                <GroupInfoBlock />
            </el-tab-pane>
            <el-tab-pane label="群聊" name="group">群聊</el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .input-container {
        width: calc(100% - 20px);
        margin: 0 auto;
        margin-top: 10px;
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
    }
}
</style>
