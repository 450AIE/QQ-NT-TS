<script setup>
import { onBeforeUpdate, ref } from 'vue'
import { normalIconList, normalIconListWithFold } from './iconList'
//0普通，1带折叠
const props = defineProps({
    type: {
        required: false,
        type: Number,
        default: 0
    }
})
let len = 0
const operateIconList = ref([])
if (props.type === 0) {
    operateIconList.value = normalIconList
} else if (props.type === 1) {
    operateIconList.value = normalIconListWithFold
}
len = operateIconList.value.length
onBeforeUpdate(() => {
    if (props.type === 0) {
        operateIconList.value = normalIconList
    } else if (props.type === 1) {
        operateIconList.value = normalIconListWithFold
    }
    len = operateIconList.value.length
})

function appOperate(type) {
    if (type === '#icon-zuixiaohua') {
        ElectronAPI.minimize()
    } else if (type === '#icon-zuidahua') {
        ElectronAPI.maximize()
    } else if (type === '#icon-guanbi') {
        ElectronAPI.closeWindow()
    }
}
</script>

<template>
    <div class="container" :style="{ width: len * 40 + 'px!important' }">
        <svg
            v-for="(item, index) in operateIconList"
            :key="index"
            class="icon"
            aria-hidden="true"
            :style="{ right: (len - 1 - index) * 40 + 'px' }"
            @click="appOperate(item)"
        >
            <use :xlink:href="item"></use>
        </svg>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    align-items: center;
    position: absolute !important;
    height: 25px !important;
    z-index: 99;
    background-color: var(--app-operate-background-color);

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 40px;
        height: 25px;
        padding: 5px;
        fill: var(--app-operate-icon-color);
    }

    .icon:hover {
        background-color: var(--app-operate-hover-background-color);
    }

    .icon:last-child:hover {
        background-color: #c42b1c;
        fill: #fff;
    }
}
</style>
