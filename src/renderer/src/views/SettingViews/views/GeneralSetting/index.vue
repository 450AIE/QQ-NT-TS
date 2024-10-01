<script setup>
import useUpdatePiniaStateSync from '@renderer/hooks/useUpdatePiniaStateSync';
import useBeforeCreateGetUpdatedPiniaState from '@renderer/hooks/useBeforeCreateGetUpdatedPiniaState';
import useBaseConfigStore from '@renderer/store/baseConfigStore';
import SettingOptionDetailCard from '@renderer/views/SettingViews/components/SettingOptionDetailCard/index.vue'
import { storeToRefs } from 'pinia';
import {  ref } from 'vue';
//切换白天黑夜
const dayRef = ref(null)
const nightRef = ref(null)
function changeTheme(e){
    if(e.target.dataset.id === '0'){
        dayRef.value.classList.add('active')
        nightRef.value.classList.remove('active')
    }else if(e.target.dataset.id === '1'){
        dayRef.value.classList.remove('active')
        nightRef.value.classList.add('active')
    }
    shiftTheme(e)
}
const baseConfigStore = useBaseConfigStore()
function shiftTheme(e){
    // 白天
    if(e.target.dataset.id === '0' && baseConfigStore.isDarkTheme){
        baseConfigStore.setIsDarkTheme(false)
    // 黑夜
    }else if(e.target.dataset.id === '1' && !baseConfigStore.isDarkTheme){
        baseConfigStore.setIsDarkTheme(true)
    }
}
// onActivated(()=>console.log('general setting'))
// 字体大小
const {globalFontSize} = storeToRefs(baseConfigStore)
function changeGlobalFontSize(newFontSize){
    baseConfigStore.setGlobalFontSize(newFontSize,true)
}
// onBeforeUnmount(()=>ElectronAPI.writeBaseConfigStoreFiles(JSON.stringify(baseConfigStore)))
</script>


<template>
    <div class="container">
        <div class="title">
            <span class="title-text">通用</span>
        </div>
        <div class="scroll">
            <SettingOptionDetailCard title="外观设置" :height="150">
                <template  class="theme-card" @click="changeTheme">
                    <div class="theme" ref="dayRef" :class="{'active':!baseConfigStore.isDarkTheme}">
                        <img src="../../../../assets/dayTheme.png" data-id="0" alt="">
                        <span>白天模式</span>
                    </div>
                    <div class="theme" ref="nightRef" :class="{'active':baseConfigStore.isDarkTheme}">
                        <img src="../../../../assets/nightTheme.png" data-id="1" alt="">
                        <span>夜间模式</span>
                    </div>
                </template>
            </SettingOptionDetailCard>
            <SettingOptionDetailCard title="字体大小" :height="80">
                <template #default>
                    <div  class="font-size-card">
                        <el-slider :step="2" v-model="globalFontSize"
                         show-stops :min="12" :max="24" class="font-size-slider"
                         @change="changeGlobalFontSize" />
                        <span class="font-size-small">小</span>
                        <span class="font-size-normal">标准</span>
                        <span class="font-size-big">大</span>
                    </div>
                </template>
            </SettingOptionDetailCard>
        </div>
    </div>
</template>


<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    width: 100%;
    .scroll {
        flex:1;
        padding:20px 20px 0 20px;
        .theme-card {
            padding:0 10px;
            height: 100%;
            flex-shrink: 0;
            display: flex;
            // align-items: center;
            .theme {
                position: relative;
                overflow: visible;
                display: flex;
                flex-direction: column;
                // position:relative;
                width: 120px;
                height: 100px;
                margin-right:15px;
                margin-top:10px;
                // overflow: visible;
                img {
                    width: 100px;
                    height: 80px;
                    border-radius: 4px;
                    margin-bottom:6px;
                }
                span {
                    // font-size: 24px;
                    position: absolute;
                    top: 85px;
                    left: 0;
                }
            }
            .theme.active {
                img {
                    border: 2px solid $background-blue-color;
                    border-radius: 6px;
                }
            }
        }
        .font-size-card {
            overflow: visible;
            position: relative;
            display: flex;
            align-items: center;
            padding:10px 20px 20px 20px;
            height: 100%;
            .font-size-slider {
                overflow: visible;
                :deep(){
                    .el-slider__runway {
                        overflow: visible;
                        .el-slider__button-wrapper {
                            overflow: visible;
                            display: flex;
                            align-items: center;
                        }
                    }
                }
            }
            .font-size-small {
                position: absolute;
                left: 14px;
                top:30px;
            }
            .font-size-normal {
                position: absolute;
                left: 148px;
                top:30px;
            }
            .font-size-big {
                position: absolute;
                right:16px;
                top:30px;
            }
        }
    }
    .title {
        position:relative;
        width:100%;
        height: 70px;
        color: var(--setting-font-color);
        // background-color: orange;
        border-bottom: 1px solid var(--setting-top-border-bottom-background-color);
        .title-text {
            position:absolute;
            left: 20px;
            bottom: 10px;
        }
    }
}
</style>
