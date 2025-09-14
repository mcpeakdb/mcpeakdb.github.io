import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BlackjackView from '@/views/BlackjackView.vue';
import BlackjackBlitzView from '@/views/BlackjackBlitzView.vue';

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
    {
      path: '/blackjack-blitz',
      name: 'blackjack-blitz',
      component: BlackjackBlitzView,
    },
  ],
});

export default router;
