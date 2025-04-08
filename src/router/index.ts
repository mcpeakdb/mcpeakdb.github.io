import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BlackjackView from '@/views/BlackjackView.vue';
import UnoView from '@/views/UnoView.vue';
import AdventView from '@/views/AdventView.vue';

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
      path: '/uno',
      name: 'uno',
      component: UnoView,
    },
    {
      path: '/advent',
      name: 'advent',
      component: AdventView,
    },
  ],
});

export default router;
