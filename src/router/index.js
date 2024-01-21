import { createRouter, createWebHistory } from 'vue-router';

import LayoutVue from '@/page/Layout.vue';
import LoginVue from '@/page/Login.vue';
import ArticleCategoryVue from '@/page/article/ArticleCategory.vue';
import ArticleManageVue from '@/page/article/ArticleManage.vue';
import UserAvatarVue from '@/page/user/UserAvatar.vue';
import UserInfoVue from '@/page/user/UserInfo.vue';
import UserResetPasswordVue from '@/page/user/UserResetPassword.vue';

const routes = [
    {
        path: '/',
        component: LayoutVue,
        redirect: '/article/category',
        children: [
            { path: '/article/category', component: ArticleCategoryVue },
            { path: '/article/manage', component: ArticleManageVue },
            { path: '/user/userInfo', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVue },
            { path: '/user/resetPassword', component: UserResetPasswordVue },
        ],
    },
    { path: '/login', component: LoginVue },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;
