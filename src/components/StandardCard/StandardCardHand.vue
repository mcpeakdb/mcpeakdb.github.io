<script lang="ts" setup>
import useStandardDeck from '@/composables/useStandardDeck';
import StandardCard from '../StandardCard.vue';

const { playerHand, discardCardFromHand } = useStandardDeck;
</script>

<template>
  <TransitionGroup class="flex gap-2 w-[80vw] flex-wrap" name="card-hand" tag="div">
    <StandardCard
      v-for="(card, index) in playerHand"
      :key="'hand-' + card.id"
      :card="card"
      is-face-up
      class="cursor-n-resize"
      @click="discardCardFromHand(index)"
    />
  </TransitionGroup>
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
