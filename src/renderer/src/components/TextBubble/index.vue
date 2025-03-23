<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, toRefs } from 'vue'
import { TextBubbleProps } from './type'
import { throttle } from 'lodash-es'

const props = defineProps<TextBubbleProps>()
const containerRef = ref(null)
const textBubbleMaxWidth = ref(300)
const { isMyself, message, type, senderInfo } = toRefs(props)
const throttleUpdateTextBubbleMaxWidth = throttle(updateTextBubbleMaxWidth, 200)
function updateTextBubbleMaxWidth() {
    textBubbleMaxWidth.value = containerRef.value.offsetWidth * 0.8 - 40
}
onMounted(() => {
    updateTextBubbleMaxWidth()
    window.addEventListener('resize', throttleUpdateTextBubbleMaxWidth)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', throttleUpdateTextBubbleMaxWidth)
})
</script>

<template>
    <div class="container" ref="containerRef">
        <div class="up">
            <span class="time"></span>
        </div>
        <div
            class="bottom"
            :style="{
                flexDirection: isMyself ? 'row' : 'row-reverse'
            }"
        >
            <div class="user">
                <el-avatar class="avatar" />
            </div>
            <div class="content">
                <span
                    class="username"
                    :style="{
                        left: isMyself ? '0' : ''
                    }"
                    >{{ senderInfo?.username || '后端之神' }}</span
                >
                <div
                    class="message-container"
                    :style="{
                        maxWidth: textBubbleMaxWidth + 'px',
                        float: isMyself ? 'left' : 'right'
                    }"
                >
                    <span class="message">{{ message }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    .up {
        display: flex;
        width: 100%;
        height: 30px;
        justify-self: center;
        align-items: center;
    }
    .bottom {
        display: flex;
        flex-direction: row;
        flex: 1;
        .user {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 60px;
            .avatar {
                width: 40px;
                height: 40px;
            }
        }
        .content {
            position: relative;
            height: 100%;
            width: 100%;
            flex: 1;
            .username {
                position: absolute;
                right: 0;
                top: 0;
            }
            .message-container {
                float: right;
                margin-top: 24px;
                background-color: red;
                .message {
                    width: 100%;
                    overflow: auto;
                    white-space: wrap;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
            }
        }
    }
}
</style>
