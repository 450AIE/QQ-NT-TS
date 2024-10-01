<script setup>
import { onActivated, ref } from 'vue';
import AppOperate from '@renderer/components/AppOperate/index.vue'
import { settingGlobalIconList } from './iconList';
import { useRouter } from 'vue-router';
import useBeforeCreateGetUpdatedPiniaState from '@renderer/hooks/useBeforeCreateGetUpdatedPiniaState'
import useUpdatePiniaStateSync from '../../hooks/useUpdatePiniaStateSync';

defineOptions({
    name:'SettingViews'
})
useBeforeCreateGetUpdatedPiniaState(true)
useUpdatePiniaStateSync()
const scrollHeight = ref(window.innerHeight - 70)
window.addEventListener('resize',()=>{
    scrollHeight.value = window.innerHeight - 70
})
// onActivated(()=>console.log('setting'))
const router = useRouter()
//进入路由，打开相应的设置界面
function openSettingView(index){
    if(index === 0){
        router.push('/setting_global/general')
    }
}

</script>


<template>
    <AppOperate class="app-operate" />
    <div class="container">
        <div class="left w">
            <div class="option w" v-for="(item,index) in settingGlobalIconList"
            :key="index" @click="openSettingView(index)">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="item.icon"></use>
                </svg>
                <span class="text">{{ item.text }}</span>
            </div>
        </div>
        <div class="right">
            <router-view />
        </div>
    </div>
</template>


<style scoped lang="scss">
.container {
    height: 100vh;
    width: 100vw;
    display: flex;
    .left {
        width: 200px;
        height: 100vh;
        background-color: var(--setting-left-options-background-color);
        -webkit-app-region: drag;
        padding-top:20px;
        .option {
            display: flex;
            align-items: center;
            width: 100%;
            height: 40px;
            margin-top:10px;
            color: var(--setting-font-color);
            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 20px;
                width: 20px;
                margin-right:10px;
                fill:var(--icon-fill-color)
            }
        }
        .option:hover {
            background-color: var(--setting-left-option-hover-background-color);
            border-radius:10px;
        }
    }
    .right {
        flex:1;
        background-color: var(--background-gray1-color);
        // background-color: orange;
    }
}
.app-operate {
    position:fixed;
    z-index:99;
    right: 0;
    top: 0;
}
</style>
