<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import useBlackjack from '@/composables/useBlackjack';
import StandardCardDeck from '@/components/StandardCard/StandardCardDeck.vue';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import TopMenu from '@/components/Layout/TopMenu.vue';
import BaseAlert from '@/components/Layout/Alerts/BaseAlert.vue';

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
  cardBack,
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

const showModal = ref(false);
</script>

<template>
  <main
    class="w-screen h-screen bg-radial bg-green-700 to-green-950 overflow-x-hidden"
    :class="{ 'pointer-events-none': isComputerThinking }"
  >
    <div class="w-full flex justify-between p-2">
      <TopMenu />

      <ActionButton @click="showModal = true">Settings</ActionButton>
      <div
        v-if="showModal"
        class="absolute top-0 left-0 w-screen h-screen bg-gray-500 opacity-50 z-10"
        @click="showModal = false"
      ></div>
      <div
        v-if="showModal"
        class="absolute top-1/2 left-1/2 -translate-1/2 z-20 bg-white rounded-lg p-4"
      >
        <h2 class="text-2xl font-bold mb-2">Settings</h2>

        <h5 class="text-lg font-semibold">Card Back</h5>
        <label for="card-back-red">
          Red
          <input id="card-back-red" v-model="cardBack" value="red" type="radio" name="card-back" />
        </label>
        <label for="card-back-blue">
          Blue
          <input
            id="card-back-blue"
            v-model="cardBack"
            value="blue"
            type="radio"
            name="card-back"
          />
        </label>
        <label for="card-back-gradient">
          Gradient
          <input
            id="card-back-gradient"
            v-model="cardBack"
            value="gradient"
            type="radio"
            name="card-back"
          />
        </label>
      </div>
    </div>

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
        <BaseAlert v-if="didPlayerWin"> You win! </BaseAlert>
        <BaseAlert v-else variant="danger"> Better luck next time... </BaseAlert>
      </div>

      <div class="flex justify-between bg-black p-2 rounded-t-xl text-4xl text-white">
        <div>Your Hand: {{ playerHandTotal }}</div>
        <div v-if="showComputerHand">Dealer Hand: {{ computerHandTotal }}</div>
      </div>
    </div>
  </main>
</template>
