<script lang="ts" setup>
import { toRefs, ref, onMounted, onUpdated, watch } from 'vue'
import { DynamicVirtualListProps } from './type'
const props = defineProps<DynamicVirtualListProps>()
const { width, height, itemEstimateSize, itemCount, listData, buffer } = toRefs(props)
const viewCount = ref(Math.ceil(parseInt(height.value) / itemEstimateSize.value))
let start = 0
let end = start + viewCount + buffer.value
// 包含了所有的子项DOM
const itemRefs = ref([])
const renderList = ref(listData.value.slice(start, end))
// 记录该将可视区拉下多少
const translateY = ref(0)
const containerRef = ref(null)
// 虽然不准确，但是似乎都是这么做的。这么来估计页面上可以展示的数目
// 所有子项的位置信息
const itemPositions = ref(
    listData.value.map((item, index) => ({
        id: item.id,
        height: itemEstimateSize.value,
        top: index * itemEstimateSize.value,
        bottom: (index + 1) * itemEstimateSize.value
    }))
)
// 首先用传递的初始预估值计算出fill的初始预估高度
const fillHeight = ref(itemEstimateSize.value * itemCount.value)
function updateVirtualListContent() {
    // 滚动距离
    const scrollTop = containerRef.value.scrollTop
    // 1. 计算可视区域元素的位置，并将对应的itemPositions信息修改
    itemRefs.value.forEach((item) => {
        // DOM上绑定id为idx，就是它在itemPositions中的索引，我们当前
        // 为一个函数，找到它在listData中的idx作为id
        const idx = Number(item.id)
        // 现在获取实际高度
        const curHeight = item.offsetHeight
        // 以前的高度
        const preHeight = itemPositions.value[idx].height
        itemPositions.value[idx].height = curHeight
        // 计算出diff，当前idx之后的元素会因为当前元素高度的更新而受到影响，
        // 也即是后面的元素的都要下移diff这么高(top和bottom都 + diff)
        const diff = curHeight - preHeight
        // 更新这个的bottom
        itemPositions.value[idx].bottom = itemPositions.value[idx].bottom + diff
        for (let i = idx + 1; i < itemPositions.value.length; ++i) {
            const item = itemPositions.value[i]
            item.top += diff
            item.bottom += diff
        }
    })
    // 2. 更新fill的高度 (就是最后一个元素的bottom高度)
    fillHeight.value =
        itemPositions.value.length > 0
            ? itemPositions.value[itemPositions.value.length - 1].bottom
            : height.value
    // 3. 更新start和end
    start = findFirstVisibleElementIdx(scrollTop)
    start = Math.max(0, start - buffer.value)
    end = Math.min(start + viewCount.value + 2 * buffer.value, listData.value.length)
    // 4. 更新renderList
    renderList.value = listData.value.slice(start, end)
    // 5. 更新translateY，如果当前页面上的总数不够buffer*2 + viewCount的数目，那么就不移动
    // translateY
    if (listData.value.length > buffer.value * 2 + viewCount.value) {
        translateY.value = start >= 1 ? itemPositions.value[start - 1].bottom : 0
    }
}
// 找到可视区的第一个元素，这个元素应该是第一个bottom大于scrollTop的
// top肯定是递增的，因为列表是往下排着的
function findFirstVisibleElementIdx(scrollTop) {
    let left = 0
    let right = itemPositions.value.length - 1
    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        if (itemPositions.value[mid].bottom < scrollTop) {
            left = mid + 1
        } else if (itemPositions.value[mid].bottom > scrollTop) {
            right = mid - 1
        } else {
            return mid
        }
    }
    // right还是left?
    return left
}
function findNewAddedMsg() {
    const temp = []
    listData.value.forEach((data) => {
        let { id } = data
        id = Number(id)
        // 找不到，新增的
        if (!itemPositions.value.find((i) => i.id == id)) {
            temp.push({
                id,
                height: itemEstimateSize.value,
                // 这些top和bottom要根据当前itemPostions的最后一项以此更新
                top: id * itemEstimateSize.value,
                bottom: (id + 1) * itemEstimateSize.value
            })
        }
    })
    return temp
}
onMounted(() => {
    updateVirtualListContent()
})
// 传递的虚拟列表项本身可能不含表示第几项的idx，我们要用这个数据在原本的listData中的idx暂时作为idx
function findItemIdx(item) {
    return listData.value.findIndex((i) => i === item)
}
watch(
    () => listData.value,
    () => {
        // 假设当前只会push追加，我们找到新增的部分消息push进去（就是id不存在于itemPositions
        // 的就是新增的）
        // 新增前的最后一个元素，新增的元素的top和bottom要在它的基础上增加
        const newAddedMsg = findNewAddedMsg()
        if (itemPositions.value.length > 0) {
            let preLastIdx = itemPositions.value.length - 1
            for (const msg of newAddedMsg) {
                itemPositions.value.push(msg)
                msg.top = itemPositions.value[preLastIdx++].bottom
                msg.bottom = msg.top + itemEstimateSize.value
            }
        } else {
            for (const msg of newAddedMsg) {
                itemPositions.value.push(msg)
            }
        }
        updateVirtualListContent()
    },
    {
        deep: true
    }
)
watch(
    () => height.value,
    () => {
        viewCount.value = Math.ceil(parseInt(height.value) / itemEstimateSize.value)
        updateVirtualListContent()
    }
)
</script>

<template>
    <!-- <button @click="() => console.log(itemPositions, start, end)">点我调试</button> -->
    <div
        class="container beautify-scrollbar"
        :style="{ height: height + 'px', width: width }"
        ref="containerRef"
        @scroll="updateVirtualListContent"
    >
        <div class="fill" :style="{ height: fillHeight + 'px' }" />
        <ul
            class="content"
            :style="{
                transform: `translateY(${translateY}px)`
            }"
        >
            <!-- 这个itemRefs始终收集到的都是展示在页面上的元素DOM，不在页面上的收集不到 -->
            <!-- 如果原本的数据没有id，那就map产生id -->
            <li v-for="(item, idx) in renderList" :key="item.id" ref="itemRefs" :id="item.id">
                <slot :data="item"></slot>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.container {
    overflow: auto;
    position: relative;
    .content {
        list-style: none;
        width: 100%;
        position: absolute;
        top: 0;
    }
}
</style>
