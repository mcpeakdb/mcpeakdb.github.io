<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

import useBlackjack from '@/composables/useBlackjack';
import StandardCardDeck from '@/components/StandardCard/StandardCardDeck.vue';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';
import ActionButton from '@/components/Layout/ActionButton.vue';

const {
  playerHand,
  playerHandTotal,
  computerHand,
  computerHandTotal,
  isComputerThinking,
  showComputerHand,
  isDealt,
  isGameOver,
  didPlayerWin,
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
    class="w-screen h-screen bg-radial bg-green-700 to-green-950 overflow-x-hidden"
    :class="{ 'pointer-events-none': isComputerThinking }"
  >
    <div class="w-full flex flex-col items-center justify-end gap-2 mt-2">
      <StandardCardHand :hand="computerHand" :visible="showComputerHand ? -1 : 1" class="mb-2" />

      <StandardCardDeck />

      <StandardCardHand :hand="playerHand" />
    </div>

    <div class="w-full flex justify-center my-2">
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

    <div class="w-full absolute bottom-0 left-0">
      <div v-if="isGameOver" class="flex justify-center m-2 text-2xl">
        <div v-if="didPlayerWin" class="text-white rounded p-2 underline animate-bounce">
          You win!
        </div>
        <div v-else class="bg-red-900 text-white rounded p-2 underline animate-pulse">
          Better luck next time...
        </div>
      </div>

      <div class="flex justify-between bg-black p-2 rounded-t-xl text-4xl text-white">
        <div>Your Hand: {{ playerHandTotal }}</div>
        <div v-if="showComputerHand">Dealer Hand: {{ computerHandTotal }}</div>
      </div>
    </div>
  </main>
</template>
