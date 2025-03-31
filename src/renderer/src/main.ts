import './index.css'
import './styles/font/iconfont'
import { createApp } from 'vue'
import App from './App.vue'
// import VueRouter from 'vue-router'
import router from './router/router'
import { createPinia } from 'pinia'
import stateSync from './store/plugins/stateSync'
import storeReset from './store/plugins/storeReset'
import { directivePlugin } from './directives'

const pinia = createPinia().use(stateSync).use(storeReset)
const app = createApp(App)
// 自定义指令
app.use(directivePlugin)
app.use(router)
app.use(pinia)
app.mount('#app')
