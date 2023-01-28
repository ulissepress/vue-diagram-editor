import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/',        component: () => import('./pages/HomePage.vue') },
    { path: '/diagram', component: () => import('./pages/DiagramEditorPage.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;