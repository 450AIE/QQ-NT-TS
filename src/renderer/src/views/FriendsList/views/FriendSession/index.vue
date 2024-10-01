<script setup>
import axios from 'axios';
import { onActivated, onMounted, ref } from 'vue';
import TextBubble from '@renderer/components/MessageBubble/TextMessage/index.vue'
import { dragVertical } from '@renderer/utils/dragFunc';
import { topIconList,bottomIconList } from './iconList';
const resizeRef = ref(null)
const bottomRef = ref(null)
const inpRef = ref(null)
const inpMsg = ref('')
const scrollRef = ref(null)
//存放所有消息的数组
const msgArr = ref([])
defineOptions({
    name:'FriendSession'
})
onActivated(()=>console.log('FriendSession'))
onMounted(()=>{
    dragVertical(resizeRef,bottomRef,140,400)
})
async function sendMsg(e){
    if(e.key === 'Enter')  e.preventDefault()
    if(inpRef.value.value !== '' && (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter'))){
        const sendMsg = inpRef.value.value
        msgArr.value.push({direction:'row-reverse',msg:sendMsg})
        inpRef.value.value = ''
        // createMsgBubble(inpRef.value,0)
        //这里没有请求接口，于是自己创建DOM显示消息
        const res = await axios({url:`http://api.qingyunke.com/api.php?key=free&appid=0&msg=${sendMsg}`})
        //这就是返回的消息
        const resMsg = res.data.content
        console.log(resMsg)
        msgArr.value.push({direction:'row',msg:resMsg})
        // createMsgBubble(resMsg,1)
    }
}

//0表示我发的，1表示对方发的
// function createMsgBubble(msg,who){

// }

</script>


<template>
    <div class="container">
        <div class="top ww">
            <div class="username">TH</div>
            <div class="upper-icons" v-for="(item,index) in topIconList" :key="index">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="item"></use>
                </svg>
            </div>
        </div>
        <div class="session-window">
            <el-scrollbar ref="scrollRef">
                <TextBubble  v-for="(item,index) in msgArr" :key="index" :msg="item.msg" :direction="item.direction"></TextBubble>
            </el-scrollbar>
        </div>
        <div class="resize" ref="resizeRef"></div>
        <div class="bottom" ref="bottomRef">
            <div class="bottom-operate ww">
                <div class="bottom-icon" v-for="(item,index) in bottomIconList" :key="index">
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="item"></use>
                    </svg>
                </div>
            </div>
                <textarea  class="msg-inp ww" v-model="inpMsg" ref="inpRef" @keydown="sendMsg"></textarea>
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
    height: 100vh;
    background-color: var(--background-gray1-color);
    .icon:hover {
        fill: #3db0fc;
    }
    .icon {
        fill:var(--icon-fill-color)
    }
    .resize {
        height: 2px;
        width: 100%;
        cursor: s-resize;
        background-color: var(--resize-bar-background-color);
    }
    .ww {
        padding: 0 20px;
    }
    .session-window {
        flex:1;
    }
    .bottom {
        position:relative;
        display: flex;
        flex-direction: column;
        min-height: 120px;
        max-height:400px;
        height: 100px;
        border-top:1px solid var(--friend-session-bottom-border-top-background-color);
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
                border-radius:5px;
                margin-right:15px;
            }
        }
        .bottom-btn-div {
            display: flex;
            position:relative;
            height: 40px;
            align-items: center;
            margin-bottom:5px;
            .bottom-btn {
                position: absolute;
                width: 100px;
                height: 25px;
                right: 20px;
                outline: none;
                border:0;
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
                top:50%;
                transform: translateY(-50%);
                font-size: 14px;
                color:#fff;
            }
            .bottom-btn::after {
                content:'|';
                position: absolute;
                left: 60px;
                top:50%;
                transform: translateY(-50%);
                font-size: 14px;
                color:#80ccff;
            }
        }
        .msg-inp {
            outline: none;
            border: 0;
            resize: none;
            width: 100%;
            flex:1;
            font-size: 16px;
            font-family: 'Microsoft YaHei';
            background-color: var(--background-gray1-color);
        }
    }
    .top {
        display: flex;
        position:relative;
        height: 70px;
        color: var(--normal-font-color);
        border-bottom: 1px solid var(--friend-session-top-border-bottom-background-color);
        align-items: center;
        justify-content: space-between;
        padding-top:20px;
        -webkit-app-region: drag;
        .app-operate {
            position:absolute;
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
