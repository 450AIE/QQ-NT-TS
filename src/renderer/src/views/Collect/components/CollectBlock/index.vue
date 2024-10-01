<script setup>
import { collectTimeFormat } from '@renderer/utils/timeFormat';

defineProps({
    info:{
        required:false,
        type:Object,
        default:null
    },
    height:{
        required:false,
        type:String,
        default:'100px'
    },
    width:{
        required:false,
        type:String,
        default:'100%'
    }
})
</script>


<template>
   <div class="container" :style="{width:width,height:height}">
        <div class="left">
            <div class="picture" v-if="info.pictureUrlArr.length > 0">
                <img :src="info.pictureUrlArr[0]" alt="">
            </div>
            <div class="text">
                {{ info.content }}
            </div>
        </div>
        <div class="right-info">
            <span class="time">{{ collectTimeFormat(info.time)  }}</span>
            <span class="source">{{ info.source || '未知来源' }}</span>
        </div>
   </div>
</template>

<style scoped lang="scss">
.container {
    position: relative;
    background-color: var(--background-gray1-color);
    height: 100px;
    .left {
        .picture {
            position: absolute;
            width: 80px;
            height: 80px;
            top: 50%;
            left: 5%;
            transform: translateY(-50%);
            border-radius:5px;
            img {
                height: 100%;
                width: 100%;
            }
        }
    }
    .right-info {
        position: absolute;
        width: 40%;
        height:100%;
        bottom: 10px;
        right: 20px;
        color: #aaa;
        .time {
            position:absolute;
            right: 0;
            bottom: 20px;
        }
        .source {
            position:absolute;
            right: 0;
            bottom: 5px;
        }
    }
}
</style>
