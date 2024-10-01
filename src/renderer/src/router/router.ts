import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@renderer/views/FriendsList/index.vue'),
            children: [
                {
                    path: 'friend_session',
                    component: () =>
                        import('@renderer/views/FriendsList/views/FriendSession/index.vue')
                }
            ]
        },
        {
            path: '/sub_options_manage',
            component: () => import('@renderer/views/SubOptionsManage/index.vue')
        },
        {
            path: '/relationship_manage',
            component: () => import('@renderer/views/RelationshipManage/index.vue')
        },
        {
            path: '/setting_global',
            redirect: '/setting_global/general',
            component: () => import('@renderer/views/SettingViews/index.vue'),
            children: [
                {
                    path: 'general',
                    component: () =>
                        import('@renderer/views/SettingViews/views/GeneralSetting/index.vue')
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
        }
    ]
})
export default router
