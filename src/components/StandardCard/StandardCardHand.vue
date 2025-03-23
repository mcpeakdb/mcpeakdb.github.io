<script lang="ts" setup>
import NoCard from '../NoCard.vue';
import StandardCard from './StandardCard.vue';
import type { StandardCard as Card } from './types';

defineProps({
  hand: {
    type: Array as () => Card[],
    default: () => [],
  },
  visible: {
    type: Number,
    default: -1,
  },
});
</script>

<template>
  <TransitionGroup
    class="flex ms-20 justify-center w-[80vw] flex-wrap gap-2"
    name="card-hand"
    tag="span"
    :class="{
      hidden: !hand.length,
    }"
  >
    <StandardCard
      v-for="(card, index) in hand"
      :key="'hand-' + card.id"
      :card="card"
      :is-face-up="visible === -1 || index <= visible - 1"
      class="cursor-default -ms-20"
      :style="`z-index: ${index}`"
    />
  </TransitionGroup>
  <NoCard v-if="!hand.length"></NoCard>
</template>

<style scoped>
.card-hand-enter-active,
.card-hand-leave-active,
.card-hand-move {
  transition: all 0.5s ease;
  pointer-events: none;
}

.card-hand-enter-from {
  opacity: 0;
  transform: translateX(100vw) rotate(-30deg);
}
.card-hand-leave-to {
  opacity: 0;
  transform: translateY(-200px) rotate(360deg);
}

.card-hand-enter-from.empty,
.card-hand-leave-to.empty {
  opacity: 0;
  transform: none;
}
</style>
