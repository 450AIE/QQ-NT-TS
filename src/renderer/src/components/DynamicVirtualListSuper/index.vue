<script lang="ts" setup>
import { toRefs, ref, onMounted, onUpdated, watch } from 'vue'
import {
    createDoublyLinkList,
    createLinkNode,
    DoublyLinkList,
    DynamicVirtualListProps,
    ItemID,
    ItemInfo,
    LinkNode
} from './type'
const props = defineProps<DynamicVirtualListProps>()
const { width, height, itemEstimateSize, itemCount, listData, buffer } = toRefs(props)
const viewCount = ref(Math.ceil(parseInt(height.value) / itemEstimateSize.value))
// let start = 0
let start: LinkNode<ItemInfo>
let end: LinkNode<ItemInfo>
// let end = start + viewCount + buffer.value
// 缓存所有子项的位置信息
const itemsMap = new Map<ItemID, LinkNode<ItemInfo>>()
// 链表
const linkList = createDoublyLinkList<ItemInfo>()
// 初始化链表
function initLinkList() {
    // 清空现有的链表和Map
    linkList.vHead.next = linkList.vHead
    linkList.vHead.pre = linkList.vHead
    linkList.length = 0
    itemsMap.clear()

    // 初始化每个节点
    let currentTop = 0
    listData.value.forEach((item) => {
        const node = createLinkNode<ItemInfo>({
            id: item.id,
            data: item,
            top: currentTop,
            height: itemEstimateSize.value,
            bottom: currentTop + itemEstimateSize.value
        })
        itemsMap.set(item.id, node)
        linkList.insertTail(node)
        currentTop += itemEstimateSize.value
    })

    // 设置初始的start和end
    start = linkList.vHead.next
    end = start
    let tempBuffer = buffer.value
    while (end.next !== linkList.vHead && tempBuffer > 0) {
        end = end.next
        tempBuffer--
    }
}

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
        const id = item.id
        // 现在获取实际高度
        const curHeight = item.offsetHeight
        // 获取这个id对应的链表节点
        const node = itemsMap.get(id)
        if (!node) return

        // 以前的高度
        const preHeight = node.value.height
        // 更新高度
        node.value.height = curHeight
        // 计算出diff，当前idx之后的元素会因为当前元素高度的更新而受到影响，
        // 也即是后面的元素的都要下移diff这么高(top和bottom都 + diff)
        const diff = curHeight - preHeight
        node.value.bottom += diff
        let current = node.next
        while (current !== linkList.vHead) {
            current.value.top += diff
            current.value.bottom += diff
            current = current.next
        }
    })
    fillHeight.value =
        linkList.getListLength() > 0 ? linkList.getLastNode().value.bottom : height.value
    // 3. 更新start和end
    start = findFirstVisibleElementIdx(scrollTop)
    const originStart = start
    end = start
    let tempBuffer = buffer.value
    // 计算start - buffer后的起始点
    while (start.pre !== linkList.vHead && tempBuffer > 0) {
        start = start.pre
        tempBuffer--
    }
    tempBuffer = 2 * buffer.value + viewCount.value
    // start = Math.max(0, start - buffer.value)
    // end = Math.min(start + viewCount.value + 2 * buffer.value, listData.value.length)
    while (end.next !== linkList.vHead && tempBuffer > 0) {
        end = end.next
        tempBuffer--
    }
    // 4. 更新renderList
    // renderList.value = listData.value.slice(start, end)
    const arr = []
    while (start !== end) {
        arr.push(start.value.data)
        start = start.next
    }
    renderList.value = arr
    // 5. 更新translateY，如果当前页面上的总数不够buffer*2 + viewCount的数目，那么就不移动
    // translateY.value
    if (listData.value.length > buffer.value * 2 + viewCount.value) {
        console.log(
            'translateY:',
            originStart.pre !== linkList.vHead && originStart !== linkList.vHead
                ? originStart.pre.value.bottom
                : 0
        )
        // translateY.value = start > 0 ? itemPositions.value[start - 1].bottom : 0
        translateY.value =
            originStart.pre !== linkList.vHead && originStart !== linkList.vHead
                ? originStart.pre.value.bottom
                : 0
    }
}
// 找到可视区的第一个元素，这个元素应该是第一个bottom大于scrollTop的
// top肯定是递增的，因为列表是往下排着的
function findFirstVisibleElementIdx(scrollTop): LinkNode<ItemInfo> {
    let current = linkList.vHead.next
    while (current !== linkList.vHead && current.value.bottom <= scrollTop) {
        current = current.next
    }
    return current
}
onMounted(() => {
    initLinkList()
    updateVirtualListContent()
})
// 传递的虚拟列表项本身可能不含表示第几项的idx，我们要用这个数据在原本的listData中的idx暂时作为idx
function findItemIdx(item) {
    return listData.value.findIndex((i) => i === item)
}
watch(
    () => listData.value,
    () => {
        // console.log('改变了，现在的链表和数组', linkList, listData.value)
        diff(linkList, listData)
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
function diff(linkList: DoublyLinkList<ItemInfo>, newArr: Ref<any[], any[]>) {
    // 原数组改变了，我们要diff找到区别，然后将链表进行对应的修改
    // 完整版打算用Vue2的双端diff，但是目前我们只考虑头尾增加的情况
    const len = newArr.value.length
    const vHead = linkList.vHead
    if (linkList.length === 0) {
        // 初始化每个节点
        let currentTop = 0
        newArr.value.forEach((item) => {
            const node = createLinkNode<ItemInfo>({
                id: item.id,
                data: item,
                top: currentTop,
                height: itemEstimateSize.value,
                bottom: currentTop + itemEstimateSize.value
            })
            itemsMap.set(item.id, node)
            linkList.insertTail(node)
            currentTop += itemEstimateSize.value
        })

        // 设置初始的start和end
        start = linkList.vHead.next
        end = start
        let tempBuffer = buffer.value
        while (end.next !== linkList.vHead && tempBuffer > 0) {
            end = end.next
            tempBuffer--
        }
    }
    // 有新增元素
    if (len > linkList.length) {
        // 如果第一个元素不同，那么头部有增加，如果最后一个元素不同，那么
        // 尾部有增加
        const isHeadAdded = newArr.value[0] !== vHead.next.value?.data
        const isTailAdded = newArr.value[len - 1] !== vHead.pre.value?.data

        if (isHeadAdded) {
            console.log('头部新增节点')
            // 1. 找出新增了几个元素
            let newItemsCount = 0
            for (let i = 0; i < len; i++) {
                if (newArr.value[i] === vHead.next.value.data) {
                    break
                }
                newItemsCount++
            }

            // 2. 创建新增的几个元素的LinkNode
            const newNodes: LinkNode<ItemInfo>[] = []
            for (let i = newItemsCount - 1; i >= 0; i--) {
                const item = newArr.value[i]
                const node = createLinkNode<ItemInfo>({
                    id: item.id,
                    data: item,
                    top: 0,
                    height: itemEstimateSize.value,
                    bottom: itemEstimateSize.value
                })
                newNodes.push(node)
                itemsMap.set(item.id, node)
            }

            // 3. 将这些新增的LinkNode插入链表
            newNodes.forEach((node) => {
                linkList.insertHead(node)
            })

            // 4. 更新后续节点的位置信息
            let current = vHead.next
            let offset = newItemsCount * itemEstimateSize.value
            while (current !== vHead) {
                current.value.top += offset
                current.value.bottom += offset
                current = current.next
            }
        }

        if (isTailAdded) {
            console.log('尾部新增节点')
            // 1. 找出新增了几个元素
            let newItemsCount = 0
            for (let i = len - 1; i >= 0; i--) {
                if (newArr.value[i] === vHead.pre.value?.data) {
                    break
                }
                newItemsCount++
            }

            // 2. 创建新增的几个元素的LinkNode
            const lastNode = vHead.pre
            let currentTop = lastNode.value?.bottom || itemEstimateSize.value

            for (let i = len - newItemsCount; i < len; i++) {
                const item = newArr.value[i]
                const node = createLinkNode<ItemInfo>({
                    id: item.id,
                    data: item,
                    top: currentTop,
                    height: itemEstimateSize.value,
                    bottom: currentTop + itemEstimateSize.value
                })
                itemsMap.set(item.id, node)
                linkList.insertTail(node)
                currentTop += itemEstimateSize.value
            }
        }
    } else {
        // 暂时没有撤销消息，所以这里代表元素没变，只是内容变了
    }
}
</script>

<template>
    <div
        class="container-11 beautify-scrollbar"
        :style="{ height: height, width: width }"
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
            <li v-for="(item, idx) in renderList" :key="item.id" ref="itemRefs" :id="item.id">
                <slot :data="item"></slot>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.container-11 {
    overflow: auto;
    position: relative;
    // transform: translateY(0px);
    .content {
        list-style: none;
        width: 100%;
        position: absolute;
        top: 0;
    }
}
</style>
