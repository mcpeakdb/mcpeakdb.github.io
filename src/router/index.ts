import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BlackjackView from '@/views/BlackjackView.vue';
import BlackjackBlitzView from '@/views/BlackjackBlitzView.vue';
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
      path: '/creature',
      name: 'creature',
      component: CreatureView,
    },
  ],
});

export default router;
