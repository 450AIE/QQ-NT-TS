<script setup>
import { ref, watch } from 'vue'
import InfoBlock from '@renderer/components/InfoBlock/index.vue'
import { useRoute } from 'vue-router'
import { useReactiveHeight } from '@renderer/hooks/useReactiveHeight'

let notificationList = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}])
const scrollbarHeight = useReactiveHeight(80)
const route = useRoute()
// 根据params判断当前是好友通知还是群通知
if (route.params.type == 'user') {
    // 获取全部通知，并展示
} else if (route.params.type == 'group') {
}
// 监听query值的变化
watch(
    () => route.params.type,
    (newType, oldType) => {
        console.log(newType, oldType)
    }
)
</script>

<template>
    <div class="container-a">
        <div class="title-container">
            <span class="title">
                {{ route.params.type === 'user' ? '好友通知' : '群通知' }}
            </span>
        </div>
        <div class="content-container">
            <div class="virtual-list-container">
                <!-- 先无限滚动，后虚拟列表 -->
                <el-scrollbar :height="scrollbarHeight">
                    <InfoBlock
                        v-for="(item, idx) in notificationList"
                        :key="idx"
                        class="info-block"
                    >
                        <template #info> 222 </template>
                        <template #button>
                            <el-button>同意</el-button>
                        </template>
                    </InfoBlock>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container-a {
    .title-container {
        position: relative;
        height: 70px;
        width: 100%;
        .title {
            position: absolute;
            left: 20px;
            top: 25px;
            font-size: 18px;
        }
    }
    .content-container {
        height: calc(100vh - 70px);
        .virtual-list-container {
            margin: 0 auto;
            width: 80%;
            max-width: 700px;
            .info-block {
                margin-bottom: 10px;
                border-radius: 10px;
            }
        }
    }
}
</style>
