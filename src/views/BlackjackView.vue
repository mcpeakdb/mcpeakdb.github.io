<script setup lang="ts">
import { onMounted } from 'vue';

import useBlackjack from '@/composables/useBlackjack';
import StandardCardDeck from '@/components/StandardCard/StandardCardDeck.vue';
import StandardCardDiscard from '@/components/StandardCard/StandardCardDiscard.vue';
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
} = useBlackjack;

onMounted(() => {
  buildDeck();
});
</script>

<template>
  <main
    class="w-screen h-screen bg-green-900"
    :class="{ 'pointer-events-none': isComputerThinking }"
  >
    <div class="w-screen h-[50vh] flex flex-col items-center justify-end mb-2">
      <StandardCardHand :hand="computerHand" :visible="isGameOver ? -1 : 1" class="mb-2" />

      <div class="flex justify-center gap-2">
        <StandardCardDeck />

        <StandardCardDiscard />
      </div>
    </div>

    <div class="w-full flex justify-center">
      <ActionButton v-if="!isDealt" @click="dealHand"> Deal </ActionButton>
      <div v-else>
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

    <div class="w-screen flex justify-center items-start">
      <StandardCardHand :hand="playerHand" />
    </div>
  </main>
</template>
