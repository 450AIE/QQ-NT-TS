<script setup>
import { Search, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
const props = defineProps({
    withIcon: {
        required: false,
        type: Boolean,
        default: true
    },
    value: {
        required: true,
        type: String,
        default: ''
    },
    setValue: {
        required: true,
        type: Function,
        default: () => {}
    },
    bottomBorder: {
        required: false,
        type: Boolean,
        default: true
    },
    onEnter: {
        required: false,
        type: Function,
        default: () => {}
    }
})
const openCreateGroupWindow = ref(false)
defineOptions({
    name: 'SearchBar'
})
const showDetail = ref(false)
function openAddFriendAndGroupWindow() {
    ElectronAPI.createAddFriendAndGroupWindow()
}
</script>

<template>
    <div
        class="search w"
        :style="{
            borderBottom: props.bottomBorder
                ? '1px solid var(--search-bar-border-bottom-color)'
                : 'none'
        }"
    >
        <el-input
            v-model="props.value"
            placeholder="搜索"
            class="inp"
            :prefix-icon="Search"
            @input="(val) => props.setValue(val)"
            @keydown.enter="props.onEnter"
        />
        <div v-if="props.withIcon" class="plus-icon-div">
            <el-dialog v-model="openCreateGroupWindow" width="500" :show-close="false">
                <CreateGroup :close="() => (openCreateGroupWindow = !openCreateGroupWindow)" />
            </el-dialog>
            <el-icon class="plus-icon" @click="() => (showDetail = !showDetail)"><Plus /></el-icon>
            <!--  加好友，加群聊 -->
            <ul v-if="showDetail" class="detail">
                <li
                    class="detail-item"
                    @click="() => (openCreateGroupWindow = !openCreateGroupWindow)"
                >
                    创建群聊
                </li>
                <li class="detail-item" @click="openAddFriendAndGroupWindow">加好友/群</li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
.search {
    background-color: var(--search-bar-background-color);
    display: flex;
    padding-top: 10px;
    align-items: center;
    height: 70px;
    border-bottom: 1px solid var(--search-bar-border-bottom-color);
    -webkit-app-region: drag;
    .plus-icon-div {
        position: relative;
        display: flex;
        width: 30px;
        height: 30px;
        justify-content: center;
        align-items: center;
        background-color: var(--background-gray2-color);
        border-radius: 4px;
        .plus-icon {
            color: #9f9f9f;
        }
        .detail {
            position: absolute;
            left: 20px;
            width: 100px;
            top: 20px;
            padding: 6px;
            display: flex;
            flex-direction: column;
            // background-color: var(--el-input-background-color);
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 0 0 8px 2px #ccc;
            z-index: 10;
            .detail-item {
                display: flex;
                flex: 1;
                width: auto;
                list-style: none;
                align-items: center;
                &:hover {
                    background-color: #ccc;
                }
            }
        }
    }
    .inp {
        height: 30px;
        flex: 1;
        user-select: none;
        margin-right: 10px;
        border-radius: 4px;
        :deep() {
            .el-input__wrapper {
                background: var(--el-input-background-color);
                box-shadow: 0 0 0 1px var(--el-input-background-color) inset;
            }
            .el-input__wrapper:hover {
                box-shadow: 0 0 0 1px #409eff inset;
            }
        }
    }
}
</style>
