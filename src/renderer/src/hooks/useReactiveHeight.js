import { throttle } from "lodash-es";
import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * 监听窗体的总高，实时返回窗体总高 - reduceValue的值。一般用来给
 * 无限滚动设置
 * @param {number} reduceValue 让窗体总高始终减去的值
 */
export function useReactiveHeight(reduceValue = 0, time = 300) {
    const reactiveHeight = ref(window.innerHeight - reduceValue)
    onMounted(() => {
        window.addEventListener('resize', onResizing)
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize', onResizing)
    })
    const onResizing = throttle(() => {
        reactiveHeight.value = window.innerHeight - reduceValue
    }, time)
    return reactiveHeight
}
