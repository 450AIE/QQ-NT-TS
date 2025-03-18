<script setup lang="ts">
import useUserInfoStore from '@renderer/store/UserInfoStore'
import updateMap, { createUpdate, Update } from '../../../../utils/updateMap/index'
import initUpdateMap from '../../../../utils/updateMap/index'
import useBaseConfigStore from '@renderer/store/BaseConfigStore'
import { onBeforeUnmount } from 'vue'
const userStore = useUserInfoStore()
const baseConfigStore = useBaseConfigStore()
const UpdateMap = initUpdateMap([userStore, baseConfigStore])
// 监听其他窗口的状态更新，并更新自己的updateMap以及分发更新
ElectronAPI.onListenHasWindowStateUpdate((_, data: string) => {
    const update: Update = JSON.parse(data)
    let store
    if (userStore.storeKey === update.storeKey) {
        store = userStore
    } else if (baseConfigStore.storeKey === update.storeKey) {
        store = baseConfigStore
    }
    const lastTime = UpdateMap.getLatestTime(store, update.field)
    // 这是收到后面触发的更新，需要更新updateMap的值，并分发更新
    if (lastTime < update.time) {
        UpdateMap.setState(store, update.field, update.time, update.data)
        // 自己也要更新自己的pinia，用来之后给新创建的窗口状态
        store[update.func](update.data, false)
    } else {
        // 这个表示收到的是异步后到的先触发的更新，抛弃，也不分发
        return
    }
    // 创建新的更新并通知其他窗口更新
    const createdUpdate = createUpdate(
        update.storeKey,
        update.field,
        update.func,
        update.data,
        update.time,
        false
    )
    ElectronAPI.notifyWindowUpdateState(JSON.stringify(createdUpdate))
})
// 监听新窗口创建，发送完整pinia
ElectronAPI.onListenNewWindowCreated((_, frameId) => {
    ElectronAPI.sendFullPiniaState(JSON.stringify([userStore, baseConfigStore]), frameId)
})
onBeforeUnmount(() => {
    ElectronAPI.removeListenNewWindowCreated()
    ElectronAPI.removeListenWindowUpdateState()
})
</script>

<template>
    <div class="container">状态管理</div>
    <div>
        <el-button @click="() => console.log(UpdateMap)">点击我查看UpdateMap</el-button>
    </div>
</template>

<style lang="scss" scoped>
.caontainer {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    -webkit-app-region: drag;
}
</style>
