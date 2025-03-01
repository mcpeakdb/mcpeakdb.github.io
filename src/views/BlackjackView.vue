<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import useStandardDeck from '@/composables/useStandardDeck';
import StandardCardDeck from '@/components/StandardCard/StandardCardDeck.vue';
import StandardCardDiscard from '@/components/StandardCard/StandardCardDiscard.vue';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';

const { playerHand, computerHand, buildDeck, dealCard, dealComputerCard } = useStandardDeck;

const isDealt = ref(false);

function dealHand(): void {
  isComputerThinking.value = true;

  playerHand.value = [];
  computerHand.value = [];

  dealCard();
  dealComputerCard();
  dealCard();
  dealComputerCard();

  isComputerThinking.value = false;
  isDealt.value = true;
}

const isComputerThinking = ref(false);
const computerHandTotal = computed(() => {
  let total = 0;

  computerHand.value.forEach((card) => {
    if (typeof card.value === 'number') {
      return (total += card.value);
    }

    if (total + card.value[1] > 21) {
      return card.value[0];
    }

    return card.value[1];
  });

  return total;
});

async function endTurn(): Promise<void> {
  isComputerThinking.value = true;

  while (computerHandTotal.value < 16) {
    dealComputerCard();

    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(undefined);
      }, 500),
    );
  }

  alert(`Computer has ${computerHandTotal.value}`);
  isComputerThinking.value = false;
  isDealt.value = false;
}

onMounted(() => {
  buildDeck();
});
</script>

<template>
  <main class="w-screen h-screen" :class="{ 'pointer-events-none': isComputerThinking }">
    <div class="w-screen h-[50vh] flex justify-center items-end mb-2">
      <div class="flex justify-center gap-2">
        <StandardCardDeck />

        <StandardCardDiscard />
      </div>
    </div>

    <div class="w-full flex justify-center">
      <button
        v-if="!isDealt"
        class="cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        @click="dealHand"
      >
        Deal
      </button>
      <div v-else>
        <button
          class="cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          @click="dealCard"
        >
          Hit
        </button>
        <button
          class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          :disabled="playerHand.length < 2"
          :class="{
            'opacity-50 cursor-not-allowed': playerHand.length < 2,
            'cursor-pointer': playerHand.length >= 2,
          }"
          @click="endTurn"
        >
          Stay
        </button>
      </div>
    </div>

    <div class="w-screen flex justify-center items-start">
      <StandardCardHand />
    </div>
  </main>
</template>
