import { cloneDeep } from 'lodash-es'

function storeReset({ store }) {
    const initalState = cloneDeep(store.$state)
    store.$reset = () => store.$patch(cloneDeep(initalState))
}

export default storeReset
