import { createUpdate } from '../../../../utils/updateMap'

/**
 * 拦截pinia的action调用，通知各窗口同步状态
 */
function stateSync({ store }) {
    // name是函数名,args为函数传递的参数,after为action调用后触发的函数,onError是执行出错后执行的函数
    // originalFn是原始函数
    store.$onAction(({ name, args, after }) => {
        // console.log('调用的action为:',name)
        // console.log('形参args为:',args)
        // 修改state类型的函数就要劫持，通知所有窗口更新
        if (name.startsWith('set')) {
            // res为该action函数的返回值
            after((res) => {
                // 如果返回true，代表是主动更新的，要触发其他窗口更新
                if (res) {
                    // console.log('args[0]',[args[0]])
                    // console.log('args',args)
                    // ElectronAPI.notifyAllWindowUpdatePiniaState(name, JSON.stringify([args[0]]))
                    // 通知状态管理窗口有窗口更新了状态
                    const update = createUpdate(
                        store.storeKey,
                        getFieldNameFromFunctionName(name),
                        name,
                        args[0],
                        new Date().getTime(),
                        true
                    )
                    ElectronAPI.notifyHasWindowStateUpdate(JSON.stringify(update))
                }
            })
        }
    })
}

function getFieldNameFromFunctionName(functionName) {
    // 检查函数名是否以 "set" 或 "get" 开头
    if (functionName.startsWith('set')) {
        // 去掉前缀（"set" 或 "get"），并将首字母小写
        return functionName.slice(3).charAt(0).toLowerCase() + functionName.slice(4)
    }
    // 如果不符合命名规范，返回 null 或抛出错误
    return null
}

export default stateSync
