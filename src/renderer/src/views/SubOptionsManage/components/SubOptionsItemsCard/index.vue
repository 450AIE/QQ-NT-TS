<script setup>
// import useBeforeCreateGetUpdatedPiniaState from '@/renderer/src/hooks/useBeforeCreateGetUpdatedPiniaState';
import useUpdatePiniaStateSync from '@renderer/hooks/useUpdatePiniaStateSync.js';
import useBaseConfigStore from '@renderer/store/baseConfigStore';
import { Minus, Plus } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
// useUpdatePiniaStateSync()
// useBeforeCreateGetUpdatedPiniaState()
const {isDarkTheme} = storeToRefs(useBaseConfigStore())
const props = defineProps({
    option:{
        required:true,
        type:Object
    }
})

function operateOption(){
    props.option.status = !props.option.status
}
</script>


<template>
    <div class="container">
        <div class="icon-plus"  :style="{backgroundColor: option.status === false ? '#e5f5ff' : '#f4e4e1'}"
         @click="operateOption" v-if="!isDarkTheme">
            <el-icon :color="option.status === false ? '#2cabff' : '#f18f80'">
                <Plus v-if="option.status === false"/>
                <Minus  v-else />
            </el-icon>
        </div>
        <div class="icon-plus"  :style="{backgroundColor: option.status === false ? '#2e3843' : '#473633'}"
        @click="operateOption" v-else>
            <el-icon :color="option.status === false ? '#095cb1' : '#aa4331'">
                <Plus v-if="option.status === false"/>
                <Minus  v-else />
            </el-icon>
        </div>
        <div class="item">
            <div class="icon-item">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="option.icon"></use>
                </svg>
            </div>
            <div class="text">
                {{ option.text }}
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
.container {
    position: relative;
    display: flex;
    width: 60px;
    height: 60px;
    background-color: var(--sub-options-manage-item-card-background-color);
    justify-content: center;
    align-content: center;
    border-radius: 6px;
    .text {
        position:absolute;
        display: flex;
        justify-content: center;
        width: 100%;
        bottom: 0;
        left: 0;
        font-size: 12px;
        margin-bottom:10px;
        color: #9c9c9c;
    }
    .icon-item {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        padding:0 20px 23px 20px;
        background-color: var(--sub-options-manage-item-card-background-color);
        border-radius: 10px;
        .icon {
            fill: var(--icon-fill-color);
            width: 100%;
            height: 100px;
        }
    }
    .icon-plus {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 3px;
        top: 3px;
        width: 14px;
        height: 14px;
        z-index:99;
        border-radius :4px;
    }
}
</style>
