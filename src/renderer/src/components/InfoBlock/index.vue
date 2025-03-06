<script lang="ts" setup>
import { InfoBlock } from './type'

const { username, time, avatar, height = 80 } = defineProps<InfoBlock>()
</script>

<template>
    <div class="container w" :style="{ height: height + 'px' }">
        <div class="img">放图片这里</div>
        <div class="info">
            <div class="upper">
                <span class="name">{{ 'TH' }}</span>
                <span class="time">{{ time }}</span>
            </div>
            <div class="bottom">消息</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    position: relative;
    background-color: var(--friend-list-and-relationship-manage-background-color);

    .img {
        position: absolute;
        width: 50px;
        height: 50px;
        top: 50%;
        background-color: #fff;
        transform: translateY(-50%);
        margin-left: 10px;
    }

    .info {
        display: flex;
        position: absolute;
        width: 70%;
        height: 50px;
        top: 50%;
        left: 30%;
        transform: translateY(-50%);
        background-color: #f0f0f0;

        .upper {
            .time {
                position: absolute;
                right: 0;
            }
        }

        .bottom {
            position: absolute;
            bottom: 0;
        }
    }
}
</style>
