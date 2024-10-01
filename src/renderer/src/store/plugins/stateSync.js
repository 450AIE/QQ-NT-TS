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
                // 如果传递的数据和原数据一样，那么不会调用通知更新，
                // res是bool，不一样返回true
                if (res) {
                    // console.log('args[0]',[args[0]])
                    // console.log('args',args)
                    ElectronAPI.notifyAllWindowUpdatePiniaState(name, JSON.stringify([args[0]]))
                }
            })
        }
    })
}

export default stateSync
