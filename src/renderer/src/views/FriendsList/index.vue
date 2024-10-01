<script setup>
import InfoBlock from '@renderer/components/InfoBlock/index.vue'
import { onActivated, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { dragHorizontal } from '../../utils/dragFunc'
import AppOerate from '@renderer/components/AppOperate/index.vue'
import SearchBar from '@renderer/components/SearchBar/index.vue'

defineOptions({
    name: 'FriendList'
})
onActivated(() => console.log('friend'))
//这个不确定是否写成响应式
const frendsList = [
    {
        name: '死于死于安乐死',
        img: 'https://s2.loli.net/2024/08/11/TNzyaPnfDLY9utC.jpg',
        latestTime: '' //时间戳
    }
]
const right = ref(null)
//计算好友列表的滚动条出现邻接值
const scrollHeight = ref(window.innerHeight - 70)
const iconType = ref(0)
//要在setup的时候就获取router
const router = useRouter()
//ref元素
const left = ref(null)
const resize = ref(null)

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

//先默认UID为1
function openFriendSession(uid = 1) {
    router.push({ path: '/friend_session', query: { uid } })
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
                        v-for="(item, index) in 11"
                        :key="index"
                        username="死鱼死于安乐死"
                        :time="new Date().getTime()"
                        class="info-block"
                        @click="openFriendSession(1)"
                    ></InfoBlock>
                </el-scrollbar>
            </div>
        </div>
        <div ref="resize" class="resize"></div>
        <div ref="right" class="right-view">
            <!-- <router-view v-slot="{Component}"> -->
            <!-- <keep-alive> -->
            <!-- <component :is="Component" /> -->
            <!-- </keep-alive> -->
            <!-- </router-view> -->
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
    .info-block:hover {
        background-color: var(--background-gray2-color);
    }
}
</style>
