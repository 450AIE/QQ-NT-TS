import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@renderer/views/Login/index.vue'
import Communication from '@renderer/views/Communication/index.vue'
import StateManage from '@renderer/views/StateMange/index.vue'


const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@renderer/views/FriendsList/index.vue'),
            children: [
                {
                    path: 'session',
                    component: () => import('@renderer/views/FriendsList/views/Session/index.vue')
                }
            ]
        },
        {
            path: '/relationship_manage',
            component: () => import('@renderer/views/RelationshipManage/index.vue'),
            children: [
                {
                    path: 'notification/:type',
                    component: () => import('@renderer/views/RelationshipManage/views/Notification/index.vue')
                }
            ]
        },
        {
            path: '/setting_global',
            redirect: '/setting_global/general',
            component: () => import('@renderer/views/SettingViews/index.vue'),
            children: [
                {
                    path: 'general',
                    component: () => import('@renderer/views/SettingViews/views/GeneralSetting/index.vue')
                }
            ]
        },
        {
            path: '/collect',
            component: () => import('@renderer/views/Collect/index.vue')
        },
        {
            path: '/create_note',
            component: () => import('@renderer/views/Collect/views/CreateNote/index.vue')
        },
        {
            path: '/add_friend_and_group',
            component: () => import('@renderer/views/AddFriendAndGroup/index.vue')
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/communication',
            component: Communication
        },
        {
            path: '/state_manage',
            component: StateManage
        }
    ]
})
export default router
