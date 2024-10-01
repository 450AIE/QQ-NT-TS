<script setup>
import { Search, Plus } from '@element-plus/icons-vue'
defineProps({
    withIcon: {
        required: false,
        type: Boolean,
        default: true
    }
})
defineOptions({
    name: 'SearchBar'
})
// onActivated(()=>{
//     console.log('searchbar activated')
// })
</script>

<template>
    <div class="search w">
        <el-input placeholder="搜索" class="inp" :prefix-icon="Search" />
        <div v-if="withIcon" class="plus-icon-div">
            <el-icon class="plus-icon"><Plus /></el-icon>
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
