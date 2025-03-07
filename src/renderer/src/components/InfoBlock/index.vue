<script lang="ts" setup>
import { InfoBlock } from './type/index'

const props = defineProps<InfoBlock>()
</script>

<template>
    <div
        class="container w"
        :style="{ height: props.height || '100px', width: props.width || '100%' }"
    >
        <div class="img-container">{{ props.avatar_url }}</div>
        <div class="info-container text-overflow-hidden">
            <slot name="info" :data="props.data"> </slot>
        </div>
        <div class="btn-container text-overflow-hidden" v-if="$slots.button">
            <!-- v-if="$slots.button"实现没有写该插槽就不占空间 -->
            <slot name="button" :data="props.data"></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    user-select: none;
    align-items: center;
    min-height: 60px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    background-color: var(--friend-list-and-relationship-manage-background-color);

    .img-container {
        width: 60px;
        height: 60px;
        background-color: #fff;
    }

    .info-container {
        margin: auto 0;
        display: flex;
        flex: 1;
        height: 60px;
        background-color: #f0f0f0;
        flex-direction: column;
        align-content: center;
    }
    .btn-container {
        width: 100px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
