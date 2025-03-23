<script lang="ts" setup>
import useStandardDeck from '@/composables/useStandardDeck';
import NoCard from '../NoCard.vue';
import StandardCard from './StandardCard.vue';

const { cardDeck } = useStandardDeck;
</script>

<template>
  <div class="justify-center flex cursor-arrow">
    <TransitionGroup name="card-deck" class="relative w-24 h-40" tag="div">
      <NoCard v-if="!cardDeck.length" class="absolute empty"> No cards remaining </NoCard>
      <StandardCard
        v-for="card in cardDeck"
        v-else
        :key="'deck-' + card.id"
        :card="card"
        class="absolute"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.card-deck-enter-active,
.card-deck-leave-active,
.card-deck-move {
  transition: all 0.5s ease;
  pointer-events: none;
}

.card-deck-enter-from {
  opacity: 0;
  transform: translateX(80px) rotate(-30deg);
}

.card-deck-leave-to {
  opacity: 0;
  transform: translateX(-100vw) rotate(-30deg);
}

.card-deck-enter-from.empty,
.card-deck-leave-to.empty {
  opacity: 0;
  transform: none;
}
</style>
