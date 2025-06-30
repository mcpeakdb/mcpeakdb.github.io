import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BlackjackView from '@/views/BlackjackView.vue';
import BlackjackBlitzView from '@/views/BlackjackBlitzView.vue';
import UnoView from '@/views/UnoView.vue';
import AdventView from '@/views/AdventView.vue';
import CreatureView from '@/views/CreatureView.vue';

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
    {
      path: '/creature',
      name: 'creature',
      component: CreatureView,
    },
  ],
});

export default router;
