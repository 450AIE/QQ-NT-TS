import { defineStore } from 'pinia'
import { ref } from 'vue'
import { isEqual } from 'lodash-es'

const useBaseConfigStore = defineStore('baseConfigStore', () => {
    // 全局字体大小
    const globalFontSize = ref(0)
    // 是否暗夜模式
    const isDarkTheme = ref(false)
    const setIsDarkTheme = (flag) => {
        if (isDarkTheme.value === flag) return false
        isDarkTheme.value = flag
        return true
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
    const subOptionsManageList = ref([
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
    // 数组内对象的顺序不同会影响isEqual，要排序
    const setSubOptionsManageList = (newList, isSubOptionsManageStrike = false) => {
        const newArr = newList.sort((cur, nex) => cur.id - nex.id)
        const oldArr = subOptionsManageList.value.sort((cur, nex) => cur.id - nex.id)
        // console.log('old:',oldArr)
        // console.log('new:',newArr)
        // console.log(isEqual(oldArr,newArr))
        // if(flag) return true
        if (isSubOptionsManageStrike) return true
        if (isEqual(newArr, oldArr)) return false
        subOptionsManageList.value = newArr
        return true
    }
    const setUpperIconList = (newIconList) => {
        const arr = Array.from(new Set([...upperFixedIconList, ...newIconList]))
        if (isEqual(arr, upperIconList.value)) return false
        upperIconList.value = arr
        return true
    }
    const setGlobalFontSize = (newFontSize, directlyUpdate = false) => {
        if (globalFontSize.value === newFontSize && !directlyUpdate) return false
        globalFontSize.value = newFontSize
        // 并且应用
        document
            .querySelector('.app')
            .style.setProperty('--global-font-size', globalFontSize.value + 'px')
        return true
    }
    return {
        globalFontSize,
        setGlobalFontSize,
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
