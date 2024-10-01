<script setup>
import LeftSubOptions from '@renderer/components/LeftSubOptions/index.vue'
import { Plus , Search } from '@element-plus/icons-vue';
import { onMounted , ref , onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import InfoBlock from '@renderer/components/InfoBlock/index.vue'
import { menuFriendArr,menuGroupArr } from './menuList';
import { dragHorizontal } from '../../utils/dragFunc';
import AppOperate from '@renderer/components/AppOperate/index.vue'
import SearchBar from '@renderer/components/SearchBar/index.vue'
const scrollHeight = ref(window.innerHeight - 70)
window.addEventListener('resize',()=>{
    scrollHeight.value = window.innerHeight -70
})
//标记选择的模式，0位好友，1为群聊
const chooseRelationship = ref(0)
//要在setup的时候就获取router
const router = useRouter()
//ref元素
const right = ref(null)
const left = ref(null)
const resize  = ref(null)
//水平拖拽函数
onMounted(()=>{
    dragHorizontal(resize,left,220,450)
    window.onresize = ()=>{
        scrollHeight.value = window.innerHeight -70
        //左侧小于最大时，拉长左侧
        // if(left.value.offsetWidth < 530){
        //     left.value.style.width = window.innerWidth - 60 -2 -300 + 'px'
        // }
        //右侧的不变，改变左边
        //左右合并,加上图标
        if(window.innerWidth < 512){
            left.value.style.width = window.innerWidth - 60 -2 + 'px'
            iconType.value = 1
        }else{
            iconType.value = 0
            if(window.innerWidth >= 582){
                left.value.style.width = window.innerWidth - 60 -2 -300 + 'px'
            }else{
                left.value.style.width = '220px'
            }
        }
    }
})
//再次清除监听，以防万一，resize上的会自动解绑
onUnmounted(()=>{
    document.onmousemove = null
    document.onmouseup = null
    window.onresize = null
})


</script>

<template>
    <AppOperate class="app-operate" />
    <LeftSubOptions></LeftSubOptions>
    <div class="container">
        <div class="left-view" ref="left">
            <SearchBar />
            <el-scrollbar :max-height="scrollHeight" class="scroll">
                <div class="friend-manage w">好友管理器</div>
                <div class="informs">
                    <div class="friend-inform w">好友通知</div>
                    <div class="group-inform w">群通知</div>
                </div>
                <div class="seg-div">
                    <el-segmented :options="['好友','群聊']" class="seg"
                    @change="()=>chooseRelationship = chooseRelationship === 1 ? 0 : 1"
                    ></el-segmented>
                </div>
                <div class="el-collapse-div">
                    <el-collapse class="el-collapse">
                        <div v-if="chooseRelationship === 0">
                            <el-collapse-item :title="item" class="item" v-for="(item,index) in menuFriendArr" :key="index">
                                <InfoBlock v-for="item in 2" class="info-block"></InfoBlock>
                            </el-collapse-item>
                        </div>
                        <div v-else>
                            <el-collapse-item :title="item" class="item" v-for="(item,index) in menuGroupArr" :key="index">
                                <InfoBlock v-for="item in 2" class="info-block"></InfoBlock>
                            </el-collapse-item>
                        </div>
                    </el-collapse>
                </div>
            </el-scrollbar>
        </div>
        <div class="resize" ref="resize"></div>
        <div class="right-view" ref="right">
            <router-view />
        </div>
    </div>
</template>


<style scoped lang="scss">
.app-operate {
    top: 0;
    right: 0;
}
.container {
    display: flex;
    width: 100%;
    height: 100vh;
    .right-view {
        height: 100vh;
        flex:1;
        background-color: var(--background-gray1-color);
    }
    .left-view {
        flex-shrink: 0;
        min-width: 220px;
        width: 220px;
        max-width: 450px;
        float: left;
        .friend-manage {
            display: flex;
            align-items: center;
            justify-content: center;
            border:1px solid var(--friend-manage-button-border-color);
            margin:10px;
            padding:5px 0;
            font-size: 14px;
            border-radius: 4px;
            &:hover {
                background: var(--friend-manage-button-hover-background-color);
            }
        }
        .scroll {
            color: var(--friend-list-and-relationship-manage-font-color);
            background-color: var(--friend-list-and-relationship-manage-background-color);
            .informs {
                border-bottom: 1px solid var(--group-info-column-border-bottom-background-color);
                display: flex;
                flex-direction: column;
                .friend-inform ,
                 .group-inform {
                    position:relative;
                    display: flex;
                    flex:1;
                    padding:10px;
                    font-size: 14px;
                    align-items: center;
                }
                .friend-inform:hover ,
                .group-inform:hover {
                    background-color: var(--background-gray2-color);
                }
            }
            .seg-div {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top:10px;
                .seg {
                    color: var(--friend-list-and-relationship-manage-font-color);
                    width: 100%;
                    margin:0 20px;
                    background-color: var(--background-gray2-color);
                    :deep(){
                        .el-segmented__group {
                            position:relative;
                            .el-segmented__item {
                                &:hover {
                                    color: var(--friend-list-and-relationship-manage-font-color);
                                    background-color: var(--segment-hover-block-background-color);
                                }
                            }
                        }
                    }
                }
            }
            .el-collapse-div {
                .el-collapse {
                    border:0;
                    .item {
                        :deep(){
                            .el-collapse-item__header {
                                background-color: var(--friend-list-and-relationship-manage-background-color);
                                position:relative;
                                border:0;
                                color: var(--friend-list-and-relationship-manage-font-color);
                                padding-left:35px;
                                .el-collapse-item__arrow {
                                    position:absolute;
                                    left: 10px;
                                    top:50%;
                                    transform: translateY(-50%);
                                }
                                .el-collapse-item__arrow.is-active {
                                    transform: translateY(-50%) rotate(90deg)
                                }
                            }
                            .el-collapse-item__wrap {
                                border:0;
                                .el-collapse-item__content {
                                    padding:0;
                                }
                            }
                        }
                    }
                    .info-block:hover {
                        background-color: var(--background-gray2-color);
                    }
                }

            }
        }
    }
    .resize {
        width: 2px;
        height: 100vh;
        float: left;
        cursor: ew-resize;
        background-color: var(--resize-bar-background-color);
    }
    .right-view {
        float: left;
    }
}
</style>
