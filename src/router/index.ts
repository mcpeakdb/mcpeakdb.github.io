import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BlackjackView from '@/views/BlackjackView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/blackjack',
      name: 'blackjack',
      component: BlackjackView,
    },
  ],
});

export default router;
