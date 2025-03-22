import { defineStore } from 'pinia'
import { ref } from 'vue'
import { isEmpty } from 'lodash-es'
import { subOption } from './types'

const useBaseConfigStore = defineStore('baseConfigStore', () => {
    const storeKey = 'baseConfigStore'
    // 全局字体大小
    const globalFontSize = ref(0)
    // 是否暗夜模式
    const isDarkTheme = ref(false)
    const setIsDarkTheme = (flag: boolean, isPositive: boolean = true) => {
        // if (isDarkTheme.value === flag) return false
        isDarkTheme.value = flag
        // 是主动更新为true，才触发通知更新。
        return isPositive
    }
    const upperFixedIconList = [
        '#icon-xiazai16',
        '#icon-yonghu',
        '#icon-gerenkongjian',
        '#icon-youxi',
        '#icon-diandiandian'
    ]
    // 最左侧图标
    const upperIconList = ref(upperFixedIconList)
    const bottomIconList = ref([
        '#icon-gengduo',
        '#icon-shoucang',
        '#icon-wenjian',
        '#icon-youxiang'
    ])
    // 管理页面，控制左侧是显示哪些图标
    const subOptionsManageList = ref<subOption[]>([
        {
            id: 1,
            icon: '#icon-QQyinle3',
            text: 'QQ音乐',
            status: false
        },
        {
            id: 2,
            icon: '#icon-jiqiren',
            text: '机器人',
            status: false
        },
        {
            id: 3,
            icon: '#icon-shangwuzixun',
            text: '咨询客服',
            status: false
        },
        {
            id: 4,
            icon: '#icon-QQyouxi',
            text: 'QQ游戏',
            status: false
        },
        {
            id: 5,
            icon: '#icon-AItengxunwendang-01',
            text: '腾讯文档',
            status: false
        },
        {
            id: 6,
            icon: '#icon-touping',
            text: '短视频',
            status: false
        }
    ])
    const setSubOptionsManageList = (newList, isPositive: boolean = true) => {
        if (isEmpty(newList)) return false
        subOptionsManageList.value = newList
        return isPositive
    }
    const setUpperIconList = (newIconList, isPositive: boolean = true) => {
        if (isEmpty(newIconList)) return false
        const arr = Array.from(new Set([...upperFixedIconList, ...newIconList]))
        upperIconList.value = arr
        return isPositive
    }
    const setGlobalFontSize = (newFontSize: number, isPositive: boolean = true) => {
        if (newFontSize <= 0) return false
        globalFontSize.value = newFontSize
        // 并且应用
        document
            .querySelector('.app')
            .style.setProperty('--global-font-size', globalFontSize.value + 'px')
        return isPositive
    }
    return {
        storeKey,
        // deviceInfo,
        globalFontSize,
        setGlobalFontSize,
        // setDeviceInfo,
        isDarkTheme,
        setIsDarkTheme,
        upperIconList,
        bottomIconList,
        setUpperIconList,
        subOptionsManageList,
        setSubOptionsManageList
    }
})

export default useBaseConfigStore
