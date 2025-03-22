<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

import useBlackjack from '@/composables/useBlackjack';
import StandardCardDeck from '@/components/StandardCard/StandardCardDeck.vue';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';
import ActionButton from '@/components/Layout/ActionButton.vue';

const {
  playerHand,
  computerHand,
  isComputerThinking,
  isGameOver,
  isDealt,
  buildDeck,
  dealHand,
  hit,
  endTurn,
  reset,
} = useBlackjack;

onMounted(() => {
  buildDeck();
});

onUnmounted(() => {
  reset();
});
</script>

<template>
  <main
    class="w-screen h-screen bg-green-900 overflow-x-hidden"
    :class="{ 'pointer-events-none': isComputerThinking }"
  >
    <div class="w-screen h-[50vh] flex flex-col items-center justify-end mb-2">
      <StandardCardHand :hand="computerHand" :visible="isGameOver ? -1 : 1" class="mb-2" />

      <div class="flex justify-center gap-2">
        <StandardCardDeck />
      </div>
    </div>

    <div class="w-screen flex justify-center items-start mb-2">
      <StandardCardHand :hand="playerHand" />
    </div>

    <div class="w-full flex justify-center">
      <ActionButton v-if="!isDealt && !isComputerThinking" @click="dealHand"> Deal </ActionButton>
      <div v-else-if="!isComputerThinking" class="flex gap-2">
        <ActionButton @click="hit"> Hit </ActionButton>
        <ActionButton
          :class="{
            'opacity-50 cursor-not-allowed': playerHand.length < 2,
            'cursor-pointer': playerHand.length >= 2,
          }"
          @click="endTurn"
        >
          Stay
        </ActionButton>
      </div>
    </div>
  </main>
</template>
