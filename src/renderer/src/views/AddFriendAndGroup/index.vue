<script lang="ts" setup>
import useBeforeCreateGetUpdatedPiniaState from '@renderer/hooks/useBeforeCreateGetUpdatedPiniaState'
import useUpdatePiniaStateSync from '@renderer/hooks/useUpdatePiniaStateSync'
import SearchBar from '@renderer/components/SearchBar/index.vue'
import AppOperate from '@renderer/components/AppOperate/index.vue'
import InfoBlock from '@renderer/components/InfoBlock/index.vue'
import { useReactiveHeight } from '@renderer/hooks/useReactiveHeight'
// import GroupInfoBlock from '@renderer/views/AddFriendAndGroup/components/GroupInfoBlock/index.vue'
import { ref } from 'vue'

useBeforeCreateGetUpdatedPiniaState()
useUpdatePiniaStateSync()
// 控制选择的标签
const selectedLabelID = ref<string>('user')
const inputValue = ref<string>('')
const scrollHeight = useReactiveHeight(140)
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
            />
        </div>
        <el-tabs
            v-model="selectedLabelID"
            class="tabs"
            @tab-click="(tab) => (selectedLabelID = tab.props.name)"
        >
            <el-tab-pane label="用户" name="user">
                <el-scrollbar :height="scrollHeight">
                    <!-- <GroupInfoBlock /> -->
                    <InfoBlock v-for="(item, idx) in 11" :key="idx" class="info-block">
                        <template #info>
                            <span>用户名称</span>
                        </template>
                        <template #button>
                            <el-button>加入</el-button>
                        </template>
                    </InfoBlock>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="群聊" name="group">
                <el-scrollbar :height="scrollHeight">
                    <!-- <GroupInfoBlock /> -->
                    <InfoBlock v-for="(item, idx) in 11" :key="idx" class="info-block">
                        <template #info>
                            <span>群聊名称</span>
                        </template>
                        <template #button>
                            <el-button>加入</el-button>
                        </template>
                    </InfoBlock>
                </el-scrollbar>
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
        .info-block {
            margin-bottom: 10px;
            border-radius: 10px;
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
