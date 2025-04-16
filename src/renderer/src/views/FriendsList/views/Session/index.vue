<script lang="ts" setup>
import { onActivated, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { dragVertical } from '@renderer/utils/dragFunc'
import { topIconList, bottomIconList } from './iconList'
import { useRoute } from 'vue-router'
import { throttle } from 'lodash-es'
import { getUserInfoAPI } from '@renderer/api/user'
import { getGroupInfoAPI } from '@renderer/api/groups'
import TextBubble from '@renderer/components/TextBubble/index.vue'
import useUserInfoStore from '@renderer/store/UserInfoStore'
import DynamicVirtualList from '@renderer/components/DynamicVirtualList/index.vue'
import uploadFileBySlice from '@renderer/utils/fileUpload'
import { sendUplinkMsg } from '@renderer/api/communication'
import { escapeHTML } from '@renderer/utils/safe'

const userInfoStore = useUserInfoStore()
const resizeRef = ref(null)
const bottomRef = ref(null)
const inpRef = ref(null)
const inpMsg = ref('')
const containerRef = ref(null)
const scrollbarHeight = ref(window.innerHeight - 170)
const titleText = ref('')
window.onresize = () => {
    console.log(containerRef.value.offsetHeight)
}
// 如果是双方聊天，保存对方的信息
const userInfo = ref({})
// 如果是群聊聊天，保存群组的信息
const groupInfo = ref({})
let id = 0
//存放所有消息的数组
const msgArr = ref([])
const route = useRoute()
defineOptions({
    name: 'FriendSession'
})
const throttleUpdateScrollbarHeight = throttle(updateScrollbarHeight, 200)
const scrollbarHeightObserver = new ResizeObserver(() => throttleUpdateScrollbarHeight())
// onActivated(() => console.log('FriendSession'))
onMounted(() => {
    dragVertical(resizeRef, bottomRef, 120, 400, throttleUpdateScrollbarHeight)
    scrollbarHeightObserver.observe(bottomRef.value)
    window.onresize = throttle(updateScrollbarHeight, 200)
    updateScrollbarHeight()
    // 注意，这个只是暂时放在这里，负责监听该用户收到的下行消息
    ElectronAPI.onListenDownlinkMsg((_, msg) => {
        console.log('downlink', msg)
    })
    // 用来监听主进程请求最新消息的事件
    ElectronAPI.onListenSendNewAddedMsg(async () => {
        console.log('主进程请求最新消息')
        const msgs = []
        userInfoStore.messageMap.forEach((value) => {
            msgs.push(...value)
        })
        // 将最新消息发送给主进程
        const res = await ElectronAPI.sendNewAddedMsg(JSON.stringify(msgs))
        // 如果成功，那么就要删除缓存的消息，不过可能出现只正确保存了一部分消息的情况
        userInfoStore.clearMessageMap()
        // console.log('这次消息传递的结果', res)
    })
    // 一进入页面就要尝试去获取本地的聊天记录，同时去请求最新的聊天记录，diff对比也可以知道
    // 哪些消息是上传失败的，从而显示感叹号重新上传
    userInfoStore.localMessageMap.forEach((value, receiverId) => {
        if (receiverId !== Number(route.query.user_id || route.query.group_id)) return
        value.forEach((item) => {
            msgArr.value.push({
                isMyself: false,
                ...item,
                id: id++,
                senderInfo: {
                    user_id: item.senderId,
                    username: 'none',
                    avatar_url: 'none'
                }
            })
        })
    })
})
function updateScrollbarHeight() {
    scrollbarHeight.value = containerRef.value.offsetHeight - bottomRef.value.offsetHeight - 70
}
onBeforeUnmount(() => {
    scrollbarHeightObserver.disconnect()
    window.onresize = null
})
function sendMsg(e) {
    if (e.key === 'Enter') e.preventDefault()
    if (
        inpMsg.value !== '' &&
        (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter'))
    ) {
        const msg = escapeHTML(inpMsg.value)
        // 加入该条信息
        msgArr.value.push({ id: id++, message: inpMsg.value, senderInfo: userInfoStore.userInfo })
        // 保存到map中，key为好友的id，value为与该好友的聊天记录
        userInfoStore.addMessage(Number(route.query.user_id || route.query.group_id), {
            receiverId: Number(route.query.user_id || route.query.group_id),
            type: route.query.type,
            senderId: userInfoStore.userInfo.user_id,
            message: msg,
            timestamp: Date.now()
        })
        // 本地的也要加
        userInfoStore.addLocalMessageMap(Number(route.query.user_id || route.query.group_id), {
            receiverId: Number(route.query.user_id || route.query.group_id),
            type: route.query.type,
            senderId: userInfoStore.userInfo.user_id,
            message: inpMsg.value,
            timestamp: Date.now()
        })
        // createMsgBubble(inpRef.value,0)
        // 这里让主进程通知通信进程发送消息
        const deviceId = localStorage.getItem('device_id')
        const userId = localStorage.getItem('user_id')
        sendUplinkMsg({
            uplinkBody: inpMsg.value,
            // 发送方用户的id
            userId,
            // type用来区分是用户还是群聊
            type: route.query.user_id ? 'user' : 'group',
            sessionId: route.query.user_id
                ? Number(route.query.user_id)
                : Number(route.query.group_id),
            deviceId
        })
        inpMsg.value = ''
        // console.log('我的id', userId, '别人的id', route.query.user_id)
        //这就是返回的消息
    }
}
// 监听对方用户发送的信息
// 这个的安装和卸载要注意
// ElectronAPI.onListenReceiveMsg((_, msg) => {})
// 判断是群聊还是用户来获取数据
watch(
    () => route.query,
    () => {
        const {
            query: { type, user_id, group_id }
        } = route
        // 改变了要清空列表，再用新的数据填充
        // msgArr.value =
        //     userInfoStore.localMessageMap.get(Number(user_id || group_id))?.map((item) => {
        //         return {
        //             id: id++,
        //             message: item.message,
        //             senderInfo: {
        //                 user_id: item.senderId,
        //                 username: 'none',
        //                 avatar_url: 'none'
        //             }
        //         }
        //     }) || []
        if (type === 'user') {
            getUserInfoAPI(user_id).then((res) => {
                // console.log('user', res)
                const { username } = res
                userInfo.value = res
                console.log('userInfo', res)
                titleText.value = username
            })
        } else if (type === 'group') {
            getGroupInfoAPI(group_id).then((res) => {
                // console.log('group', res)
                const { avatar_url, group_id, introduction, name } = res
                groupInfo.value = res
                console.log('groupInfo', res)
                titleText.value = name
            })
        }
    },
    {
        immediate: true,
        deep: true
    }
)
// 上传文件，暂时只支持选一个
function uploadFile(e) {
    const file: File = e.target.files[0]
    console.log('选择的文件', file)
    uploadFileBySlice(file)
}
</script>

<template>
    <div class="container" ref="containerRef">
        <div class="top ww">
            <div class="username">{{ titleText }}</div>
            <div class="upper-icons" v-for="(item, index) in topIconList" :key="index">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="item"></use>
                </svg>
            </div>
        </div>
        <div class="session-window">
            <DynamicVirtualList
                :buffer="1"
                :height="scrollbarHeight + 'px'"
                :item-estimate-size="75"
                :item-count="msgArr.length"
                :list-data="msgArr"
                width="100%"
            >
                <template #default="{ data }">
                    <TextBubble
                        :type="route.query.type"
                        :message="data.message"
                        :sender-info="data.userInfo"
                    />
                </template>
            </DynamicVirtualList>
        </div>
        <div class="bottom" ref="bottomRef">
            <div class="resize" ref="resizeRef" />
            <div class="bottom-operate ww">
                <div class="bottom-icon" v-for="(item, index) in bottomIconList" :key="index">
                    <input type="file" class="file-input" id="file-input" @change="uploadFile" />
                    <label :for="item.type">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="item.name"></use>
                        </svg>
                    </label>
                </div>
            </div>
            <textarea class="msg-inp ww" v-model="inpMsg" ref="inpRef" @keydown="sendMsg" />
            <div class="bottom-btn-div">
                <button class="bottom-btn" @click="sendMsg"></button>
                <span class="arrow">
                    <!--这里需要放一个字体图标向下的箭头，然后用旋转控制-->
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    background-color: var(--background-gray1-color);
    .icon:hover {
        fill: #3db0fc;
    }
    .icon {
        fill: var(--icon-fill-color);
    }
    .resize {
        height: 2px;
        width: 100%;
        cursor: s-resize;
        background-color: var(--resize-bar-background-color);
    }
    .file-input {
        display: none;
    }
    .ww {
        padding: 0 20px;
    }
    .session-window {
        position: relative;
        flex: 1;
        .scrollbar {
            position: absolute;
            width: 100%;
        }
    }
    .bottom {
        // position: relative;
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        min-height: 120px;
        max-height: 400px;
        height: 120px;
        border-top: 1px solid var(--friend-session-bottom-border-top-background-color);
        .bottom-operate {
            display: flex;
            align-items: center;
            top: 0;
            left: 0;
            height: 30px;
            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 22px;
                width: 22px;
                flex-shrink: 0;
                border-radius: 5px;
                margin-right: 15px;
            }
        }
        .bottom-btn-div {
            display: flex;
            position: relative;
            height: 40px;
            align-items: center;
            margin-bottom: 5px;
            .bottom-btn {
                position: absolute;
                width: 100px;
                height: 25px;
                right: 20px;
                outline: none;
                border: 0;
                border-radius: 4px;
                background-color: $background-blue-color;
                cursor: pointer;
            }
            .bottom-btn:active {
                background-color: #0086e0;
            }
            .bottom-btn::before {
                content: '发送';
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                color: #fff;
            }
            .bottom-btn::after {
                content: '|';
                position: absolute;
                left: 60px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                color: #80ccff;
            }
        }
        .msg-inp {
            outline: none;
            border: 0;
            resize: none;
            width: 100%;
            flex: 1;
            font-size: 16px;
            font-family: 'Microsoft YaHei';
            background-color: var(--background-gray1-color);
        }
    }
    .top {
        display: flex;
        position: relative;
        height: 70px !important;
        color: var(--normal-font-color);
        border-bottom: 1px solid var(--friend-session-top-border-bottom-background-color);
        align-items: center;
        justify-content: space-between;
        padding-top: 20px;
        -webkit-app-region: drag;
        .app-operate {
            position: absolute;
            right: 0;
            top: 0;
        }
        .username {
            width: 100%;
        }
        .upper-icons {
            display: flex;
            height: 25px;
            width: 25px;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            margin-left: 15px;
            .icon {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
