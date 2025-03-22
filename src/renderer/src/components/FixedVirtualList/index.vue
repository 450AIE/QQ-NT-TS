<script lang="ts" setup>
import { toRefs, ref, onMounted, watch, onUpdated } from 'vue'
import { FixedVirtualListProps } from './type'
const props = defineProps<FixedVirtualListProps>()
const renderList = ref([])
const { itemCount, itemSize, listData, buffer, width, height } = toRefs(props)
const containerRef = ref(null)
const transformY = ref(0)
let start = 0
let end = 0
// 表示页面上可以展现几个
const viewCount = ref(Math.ceil(parseInt(height.value) / itemSize.value))
onMounted(() => {
    updateVirtualListContent()
})
// 高度改变了，要更新viewCount的值
watch(
    () => height.value,
    () => {
        viewCount.value = Math.ceil(parseInt(height.value) / itemSize.value)
    }
)
watch(
    () => listData.value,
    () => {
        updateVirtualListContent()
    }
)
// 滑动就更新虚拟列表数据
function updateVirtualListContent() {
    // 1. 获取滚动上去的高度
    const scrollTop = containerRef.value.scrollTop
    // 2. 滚动掉的部分
    const scrolledNum = Math.floor(scrollTop / itemSize.value)
    // 3. 计算start
    start = Math.max(0, scrolledNum - buffer.value)
    // 4. 计算end
    end = Math.min(itemCount.value, start + viewCount.value + 2 * buffer.value)
    // 5. 计算transformY
    transformY.value = start === 0 ? 0 : start * itemSize.value
    // 这里可以实现触底请求
    if (end >= itemCount.value) {
    }
    renderList.value = listData.value.slice(start, end)
}
</script>

<template>
    <div
        class="container"
        :style="{ width: props.width, height: props.height }"
        ref="containerRef"
        @scroll="updateVirtualListContent"
    >
        <div class="fill" :style="{ height: props.itemSize * props.itemCount + 'px' }" />
        <ul class="content" :style="{ transform: `translateY(${transformY}px)` }">
            <li v-for="(item, idx) in renderList" :key="idx">
                <slot :data="item"> </slot>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    overflow: auto !important;
    .content {
        width: 100%;
        position: absolute;
        // height: 100%;
        top: 0;
        list-style: none;
    }
}
</style>
