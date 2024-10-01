<script setup>
import { useRouter } from 'vue-router'
import SettingOptions from '@renderer/components/SettingOptions/index.vue'
import { watch, onBeforeUnmount, onMounted, ref, onActivated } from 'vue'
import lightQQLogo from '../../assets/light-QQ-logo.png'
import darkQQLogo from '../../assets/dark-QQ-logo.png'
import useBaseConfigStore from '../../store/baseConfigStore'
import { storeToRefs } from 'pinia'
import useUpdatePiniaStateSync from '@renderer/hooks/useUpdatePiniaStateSync'
// import useBeforeCreateGetUpdatedPiniaState from '@renderer/hooks/useBeforeCreateGetUpdatedPiniaState'
// 监听pinia更新
useUpdatePiniaStateSync()
defineOptions({
    name: 'LeftSubOptions'
})
onActivated(() => {
    console.log('leftsuboptions activated')
})
// console.log('全局fontSize:',document.querySelector('#app').setProperty('--global-font-size','30px'))
// useBeforeCreateGetUpdatedPiniaState()
const baseConfigStore = useBaseConfigStore()
// 控制显示在左边的图标
const upperIcons = ref([])
// 控制被收纳的图标
const foldedIcons = ref([])
const { bottomIconList, upperIconList, isDarkTheme } = storeToRefs(baseConfigStore)
const showManageLeftSubWindow = () => {
    ElectronAPI.showManageLeftSubWindow()
}
// 一进入就要读取baseConfigStore的设置，注意，只有第一次才读取，之后切换到这个路由就不读取
// 了，否则会读取旧的状态。或者卸载前就写入配置，这样每次读取就读取新的。
// 当前选择：卸载前写入配置
async function readBaseConfigStoreFiles() {
    let res = await ElectronAPI.readBaseConfigStoreFiles()
    res = JSON.parse(res)
    // console.log('本地读取的store为:',res)
    // console.log('读取到的本地存储的baseConfigStore文件:',res)
    for (const key in baseConfigStore) {
        if (baseConfigStore.hasOwnProperty(key)) {
            // 调用set函数修改state
            if (key.startsWith('set') && typeof baseConfigStore[key] === 'function') {
                // 获取变量名，没有首字母
                const dataNameWithoutFirstChar = key.slice(4)
                // 获取首字母
                const dataNameFirstChar = key.slice(3, 4).toLowerCase()
                const dataName = dataNameFirstChar + dataNameWithoutFirstChar
                baseConfigStore[key](res[dataName])
            }
        }
    }
}
// setInterval(()=>console.log(baseConfigStore.subOptionsManageList),2000)
readBaseConfigStoreFiles()
//设置界面的组件
const settingOptionsComponent = ref(null)
const router = useRouter()
//路由跳转
function transRouter(subOptionIndex) {
    let path = undefined
    if (subOptionIndex === 0) {
        path = '/'
    } else if (subOptionIndex === 1) {
        path = '/relationship_manage'
    }
    router.push(path)
}
// 监听新窗口的创建，将当前的pinia状态传递给该窗口（但是不敢确定该组件内的pinia状态是否最新）
ElectronAPI.onListenerNewWindowCreated(() => {
    ElectronAPI.sendUpdatedPiniaStateToNewCreatedWindow(JSON.stringify(baseConfigStore))
})
//点击底部的操作。最下面是0，从下网上增大
function bottomOperate(index) {
    if (index === 0) {
        //如果组件打开了再次点击就关闭
        if (settingOptionsComponent.value) {
            settingOptionsComponent.value = null
        } else {
            settingOptionsComponent.value = SettingOptions
        }
        // 收藏
    } else if (index === 1) {
        ElectronAPI.createCollectWindow()
    }
}
// 卸载前清除IPC的监听，避免内存泄漏，并且写入配置
onBeforeUnmount(() => {
    // console.log('卸载前的store:',baseConfigStore)
    ElectronAPI.writeBaseConfigStoreFiles(JSON.stringify(baseConfigStore))
    ElectronAPI.removeListenerNewWindowCreated()
    window.removeEventListener('resize', onListenerWindowHeightToUnfoldIcons)
})
onMounted(() => {
    window.addEventListener('resize', onListenerWindowHeightToUnfoldIcons)
    console.log(
        getComputedStyle(document.querySelector('.app')).getPropertyValue('--global-font-size')
    )
})
// 监听窗口高度，控制收纳左侧多余的图标
// 同时要watch变化
function onListenerWindowHeightToUnfoldIcons() {
    // 上面的logo和头像占85
    // 下面的图标每个高45
    const windowHeight = window.innerHeight
    // 每个图标占据45高度
    // 已经选择了的所有options数目，排除了5个固定的
    const selectedIconsSum = upperIconList.value.length - 5
    const restHeight = windowHeight - 85 - (5 + 4) * 45
    // console.log('剩余高度',restHeight)
    // console.log('当前有的多余图标数目',addedIconSum)
    const newIconSum = parseInt(restHeight / 45)
    // 要收纳的总数
    const foldedIconsSum = selectedIconsSum - newIconSum
    // console.log('当前可以存放数目为',newIconSum)
    upperIcons.value = [...upperIconList.value.slice(0, 5 + newIconSum)]
    // selectedIconsSum === 0的话slice(5,5)得到的也是[]
    foldedIcons.value = [...upperIconList.value.slice(5, 5 + foldedIconsSum)]
}
// 实现见监听upperIconList改变从而改变左侧的显示
watch(
    upperIconList,
    () => {
        const selectedIconsSum = upperIconList.value.length - 5
        const windowHeight = window.innerHeight
        const restHeight = windowHeight - 85 - (5 + 4) * 45
        const newIconSum = parseInt(restHeight / 45)
        const foldedIconsSum = selectedIconsSum - newIconSum
        upperIcons.value = [...upperIconList.value.slice(0, 5 + newIconSum)]
        foldedIcons.value = [...upperIconList.value.slice(5, 5 + foldedIconsSum)]
    },
    {
        deep: true,
        immediate: true
    }
)
</script>

<template>
    <div class="container">
        <div class="title">
            <img :src="isDarkTheme ? darkQQLogo : lightQQLogo" alt="" />
        </div>
        <div class="img">
            <img src="../../assets/user.png" alt="" />
        </div>
        <div
            v-for="(item, index) in upperIcons"
            :key="index"
            class="upper-option"
            @click="transRouter(index)"
        >
            <el-popover
                placement="right"
                trigger="hover"
                width="50"
                :disabled="index !== 4"
                hide-after="100"
                popper-class="popper"
            >
                <template #reference>
                    <svg class="icon bg" aria-hidden="true">
                        <use :xlink:href="item"></use>
                    </svg>
                </template>
                <div v-if="foldedIcons.length !== 0" @click="showManageLeftSubWindow">
                    <div
                        v-for="(itemm, indexx) in foldedIcons"
                        :key="indexx"
                        :style="{
                            margin: '5px 0 5px 0'
                        }"
                    >
                        <svg aria-hidden="true" width="25" height="30">
                            <use :xlink:href="item"></use>
                        </svg>
                    </div>
                </div>
                <div v-else @click="showManageLeftSubWindow">管理</div>
            </el-popover>
        </div>
        <div
            v-for="(item, index) in bottomIconList"
            :key="index"
            class="bottom-option"
            :style="{ bottom: index * 40 + 'px' }"
            @click="bottomOperate(index)"
        >
            <svg class="icon blue" aria-hidden="true">
                <use :xlink:href="item"></use>
            </svg>
        </div>
        <keep-alive>
            <component :is="settingOptionsComponent" class="setting" />
        </keep-alive>
    </div>
</template>

<style scoped lang="scss">
.container {
    position: relative;
    display: flex;
    width: 60px !important;
    flex-direction: column;
    flex-shrink: 0;
    align-items: center;
    height: 100vh;
    -webkit-app-region: drag;
    background-color: var(--background-gray1-color);
    overflow: visible;

    .setting {
        position: absolute;
        left: 60px;
        z-index: 99;
        width: 220px !important;
        // width: 300px!important;
        bottom: 6px;
    }

    .active {
        content: attr(text);
        position: absolute;
        z-index: 10;
        color: pink;
        mask: linear-gradient(to left, red, transparent);
        -webkit-mask: linear-gradient(to left, red, transparent);
        transition: all 0.4s ease;
    }

    .upper-option {
        fill: var(--icon-fill-color);
        margin: 5px;

        :deep() {
            min-width: 10px;
        }
    }

    .bottom-option {
        fill: var(--icon-fill-color);
        position: absolute;
        // bottom: 10px;
        margin: 5px;
    }

    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        width: 35px;
        height: 35px;
        padding: 8px;
    }

    .bg:hover {
        background-color: var(--sub-icon-hover-background-color, #e9e9e9);
        border-radius: 10px;
    }

    .blue:hover {
        fill: #0099ff;
    }

    .img {
        flex-shrink: 0;
        margin: 10px 5px;
        width: 35px;
        height: 35px;

        img {
            width: 100%;
            height: 100%;
            border-radius: 35px;
            object-fit: cover;
        }
    }

    .title {
        position: relative;
        margin: 6px 10px;
        flex-shrink: 0;
        width: 40px;
        height: 25px;

        img {
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
