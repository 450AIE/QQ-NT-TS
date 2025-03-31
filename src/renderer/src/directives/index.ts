import { useIntersectionObserver } from '@vueuse/core'
// 懒加载图片
export const directivePlugin = {
    install(app) {
        app.directive('img-lazy', {
            mounted(el, binding) {
                useIntersectionObserver(el, ([{ isIntersecting }]) => {
                    if (isIntersecting) {
                        el.src = binding.value
                    }
                })
            }
        })
    },
    updated(el, binding) {
        useIntersectionObserver(el, ([{ isIntersecting }]) => {
            if (isIntersecting) {
                el.src = binding.value
            }
        })
    }
}
