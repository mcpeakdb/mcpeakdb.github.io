<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import useStandardDeck from '@/composables/useStandardDeck';
import StandardCardDeck from '@/components/StandardCard/StandardCardDeck.vue';
import StandardCardDiscard from '@/components/StandardCard/StandardCardDiscard.vue';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';
import type { StandardCard } from '@/components/StandardCard/types';
import ActionButton from '@/components/Layout/ActionButton.vue';

async function sleep(ms = 500): Promise<void> {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve(undefined);
    }, ms),
  );
}

const { playerHand, computerHand, buildDeck, dealCard, dealComputerCard } = useStandardDeck;

const isDealt = ref(false);

async function dealHand(): Promise<void> {
  isGameOver.value = false;
  isComputerThinking.value = true;

  playerHand.value = [];
  computerHand.value = [];

  dealCard();
  await sleep();
  dealComputerCard();
  await sleep();
  dealCard();
  await sleep();
  dealComputerCard();

  if (computerHandTotal.value === 21) {
    handleEndGame();
    showResult(false);
    return;
  }

  isComputerThinking.value = false;
  isDealt.value = true;
}

function hit(): void {
  dealCard();

  if (playerHandTotal.value > 21) {
    handleEndGame();
    showResult(false);
    return;
  }
}

const playerHandTotal = computed(() => {
  return getTotal(playerHand.value);
});

const isComputerThinking = ref(false);
const computerHandTotal = computed(() => {
  return getTotal(computerHand.value);
});

function getTotal(hand: StandardCard[]): number {
  let total = 0;
  let totalAces = 0;

  hand
    .toSorted((a, b) => {
      if (typeof a.value === 'number') {
        return -1;
      } else if (typeof b.value === 'number') {
        return 1;
      } else {
        return 1;
      }
    })
    .forEach((card) => {
      if (typeof card.value === 'number') {
        total += card.value;
      } else {
        totalAces += 1;
      }
    });

  total += totalAces;

  while (total < 21 && total + 10 < 20) {
    if (totalAces) {
      total += 10;
      totalAces -= 1;
    }
  }

  return total;
}

const isGameOver = ref(false);
async function endTurn(): Promise<void> {
  isComputerThinking.value = true;

  await sleep();

  while (computerHandTotal.value < 16) {
    dealComputerCard();

    await sleep();
  }

  handleEndGame();

  if (computerHandTotal.value > 21) {
    showResult(true);
  } else if (computerHandTotal.value === playerHandTotal.value) {
    if (computerHand.value.length >= playerHand.value.length) {
      showResult(false);
    } else {
      showResult(true);
    }
  } else if (computerHandTotal.value === 21 || computerHandTotal.value > playerHandTotal.value) {
    showResult(false);
  } else {
    showResult(true);
  }
}

function showResult(didWin: boolean): void {
  setTimeout(() => {
    if (didWin) {
      alert('You win!');
    } else {
      alert('Computer wins!');
    }
  }, 500);
}

function handleEndGame(): void {
  isGameOver.value = true;
  isComputerThinking.value = false;
  isDealt.value = false;
}

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
