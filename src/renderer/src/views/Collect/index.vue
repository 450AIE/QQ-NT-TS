<script setup>
import AppOperator from '@renderer/components/AppOperate/index.vue'
import CollectBlock from './components/CollectBlock/index.vue'
import SearchBar from '@renderer/components/SearchBar/index.vue'
import LeftOptions from './components/LeftOptions/index.vue'
import useBeforeCreateGetUpdatedPiniaState from '@renderer/hooks/useBeforeCreateGetUpdatedPiniaState'
import useUpdatePiniaStateSync from '../../hooks/useUpdatePiniaStateSync';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
import { onMounted } from 'vue';
defineOptions({
    name:'Collect'
})
useUpdatePiniaStateSync()
useBeforeCreateGetUpdatedPiniaState()
// 存放notes
const scrollHeight = ref(window.innerHeight - 70)
const noteList = ref([])
function openCreateNotWindow(){
    ElectronAPI.createCreateNoteWindow()
}
// onActivated(()=>{
//     console.log('collect activated')
// })
async function readNoteFiles(){
    let res = await ElectronAPI.readAllNoteFiles()
    noteList.value = JSON.parse(res)
}
readNoteFiles()
onMounted(()=>{
    window.onresize = ()=>{
        scrollHeight.value = window.innerHeight - 70
    }
})
onBeforeMount(()=>{
    window.onresize = null
})
</script>


<template>
    <AppOperator class="app-operate"/>
   <div class="container">
        <div class="left">
            <SearchBar :withIcon="false" />
            <div class="options-menu">
                <LeftOptions />
            </div>
            <div class="create-note" @click="openCreateNotWindow">
                创建笔记
            </div>
        </div>
        <div class="right">
            <div class="upper-title">
                <span>全部收藏</span>
            </div>
            <div class="bottom">
                <el-scrollbar :max-height="scrollHeight">
                    <CollectBlock v-for="item in noteList" :key="item.time" :info="item" class="collect-block" />
                </el-scrollbar>
            </div>
        </div>
   </div>
</template>


<style scoped lang="scss">
.app-operate {
    position: absolute;
    top: 0;
    right: 0;
}
.container {
    display: flex;
    height: 100vh;
    width: 100vw;
    .left {
        -webkit-app-region: drag;
        width: 300px;
        height: 100vh;
        position:relative;
        background-color: #fff;
        .create-note {
            cursor: pointer;
            position:absolute;
            display: flex;
            width: 80%;
            justify-content: center;
            align-items: center;
            bottom: 20px;
            left: 50%;
            color: var(--setting-font-color);
            transform: translateX(-50%);
            border:1px solid var(--search-bar-border-bottom-color);
            border-radius:2px;
        }
        .options-menu {
            height: 100%;
            width: 100%;
        }
    }
    .right {
        position: relative;
        flex:1;
        height: 100vh;
        background-color: var(--collect-right-background-color);
        .upper-title {
            height: 70px;
            width: 100%;
            margin-left:20px;
            position: relative;
            border-bottom:1px solid var(--search-bar-border-bottom-color);
            span {
                position: absolute;
                color: var(--normal-font-color);
                bottom: 10px;
                left: 10px;
            }
        }
        .bottom {
            .collect-block {
                &:hover {
                    background-color: var(--collect-block-hover-background-color);
                }
            }
        }
    }
}
</style>
