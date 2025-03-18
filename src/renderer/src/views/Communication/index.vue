<script lang="ts" setup>
import { sendCommunicationMsg, startHeartBeatAutomacally } from './utils'
// 自动定时心跳检测
const stopHeartBeat = startHeartBeatAutomacally()
// 该窗口仅仅负责发送网络请求通信。这个收到就代表要发送消息
ElectronAPI.listenReceiveCommunicationMsg(async (_, data: string) => {
    data = JSON.parse(data)
    // 往并发队列里加入任务，消费任务发送消息
    sendCommunicationMsg(data)
})
</script>

<template>
    <div class="container">通信</div>
</template>

<style lang="scss" scoped>
.caontainer {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    -webkit-app-region: drag;
}
</style>
