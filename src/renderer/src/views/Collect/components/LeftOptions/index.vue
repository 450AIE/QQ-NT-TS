<script setup>
import { ref } from 'vue';
import iconList from './iconList';
const leftIconList = ref(iconList)

</script>


<template>
   <div class="container">
        <div class="option" v-for="item in leftIconList" :key="item.text">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.icon"></use>
            </svg>
            <span class="text">{{ item.text }}</span>
        </div>
   </div>
</template>


<style scoped lang="scss">
.container {
    -webkit-app-region: drag;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 10px;
    width: 220px;
    height: 100%;
    background-color: var(--collect-block-background-color);
    .option {
        display: flex;
        align-items: center;
        width: 280px;
        height: 40px;
        color: var(--sub-options-manage-font-color);
        margin-bottom:10px;
        border-radius: 10px;
        &:hover {
            background-color: var(--collect-left-option-hover-background-color);
        }
        .icon {
            margin-left:10px;
            height: 25px;
            width: 25px;
            fill:var(--icon-fill-color)
        }
        .text {
            margin-left:10px;
        }
    }
}
</style>
