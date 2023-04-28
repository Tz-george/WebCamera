import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('../components/WebCamera.vue')
        },
        {
            path: '/input',
            name: 'Input',
            component: () => import('../components/InputCamera.vue')
        }
    ],
})