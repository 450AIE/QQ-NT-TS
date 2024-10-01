<script setup>
import { settingIconList } from './iconList'

function settingOperate(index) {
    if (index === 6) {
        ElectronAPI.createSettingGlobalWindow()
    }
}
// onActivated(()=>console.log('setting'))
// onDeactivated(()=>console.log('desetting'))
</script>

<template>
    <div class="container">
        <div
            v-for="(item, index) in settingIconList"
            :key="index"
            class="column"
            @click="settingOperate(index)"
        >
            <svg class="icon" aria-hidden="true">
                <use :xlink:href="item.icon"></use>
            </svg>
            <span class="text">{{ item.text }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
@keyframes iconAnimation {
    0% {
        font-weight: 700;
    }

    40% {
        width: 22px;
        height: 22px;
    }

    70% {
        width: 20px;
        height: 20px;
    }

    95% {
        width: 21px;
        height: 21px;
    }

    100% {
        width: 20px;
        height: 20px;
        font-weight: 400;
    }
}

.container {
    display: flex;
    flex-direction: column;
    height: 280px !important;
    width: 200px;
    border-radius: 4px;
    padding: 6px 0;
    color: var(--normal-font-color);
    opacity: 0.85;
    box-shadow: 0 10px 6px 4px var(--sub-setting-popover-background-color);
    background-color: var(--sub-setting-popover-background-color) !important;
    // background:linear-gradient(to bottom, rgba(255,255,255,0.1),rgba(255,255,255,0.7))!important;
    backdrop-filter: blur(14px) !important;

    .column {
        display: flex;
        width: 220px;
        align-items: center;
        margin: 0 10px;
        font-size: 16px !important;
        flex: 1;

        .icon {
            fill: var(--icon-fill-color);
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            margin: 0 10px;
        }
    }

    .column:hover {
        border-radius: 4px;
        background-color: var(--background-gray2-color);

        .icon {
            animation: iconAnimation 0.3s ease;
        }
    }
}
</style>
