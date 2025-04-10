<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import useBlackjack from '@/composables/useBlackjack';
import StandardCardDeck from '@/components/StandardCard/StandardCardDeck.vue';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import TopMenu from '@/components/Layout/TopMenu.vue';
import BaseAlert from '@/components/Layout/Alerts/BaseAlert.vue';
import { CARD_BACKS } from '@/components/StandardCard/constants';
import SimpleModal from '@/components/Layout/SimpleModal.vue';

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

const settingsModal = ref<typeof SimpleModal>();
</script>

<template>
  <main
    class="w-screen h-screen bg-radial bg-green-700 to-green-950 overflow-x-hidden"
    :class="{ 'pointer-events-none': isComputerThinking }"
  >
    <div class="w-full flex justify-between p-2">
      <TopMenu />

      <ActionButton @click="settingsModal?.setShow(true)">Settings</ActionButton>
      <SimpleModal ref="settingsModal">
        <h2 class="text-2xl font-bold mb-2">Settings</h2>

        <h5 class="text-lg font-semibold">Card Back</h5>
        <label
          v-for="(_back, index) in CARD_BACKS"
          :key="index"
          :for="`card-back-${index}`"
          class="capitalize w-full flex justify-between"
        >
          {{ index }}
          <input
            :id="`card-back-${index}`"
            v-model="cardBack"
            :value="index"
            type="radio"
            name="card-back"
          />
        </label>
      </SimpleModal>
    </div>

    <div class="w-full flex flex-col items-center justify-end gap-2 mt-2">
      <StandardCardHand :hand="computerHand" :visible="showComputerHand ? -1 : 1" />

      <StandardCardDeck />

      <StandardCardHand :hand="playerHand" />
    </div>

    <div class="w-full absolute bottom-0 left-0">
      <div v-if="isGameOver" class="flex justify-center m-2 text-2xl">
        <BaseAlert v-if="didPlayerWin"> You win! </BaseAlert>
        <BaseAlert v-else variant="danger"> Better luck next time... </BaseAlert>
      </div>

      <div class="flex justify-between bg-black p-2 pt-3 rounded-t-xl text-2xl text-white">
        <div class="flex-1 flex-grow">Your Hand: {{ playerHandTotal }}</div>

        <div
          class="flex flex-1 flex-grow justify-center"
          :class="{
            'pointer-events-none': isComputerThinking,
          }"
        >
          <ActionButton v-if="!isDealt" @click="dealHand"> Deal </ActionButton>
          <div v-else class="flex gap-2">
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

        <div class="flex flex-1 flex-grow justify-end">
          Dealer Hand:&nbsp;<span v-if="showComputerHand">{{ computerHandTotal }}</span
          ><span v-else>??</span>
        </div>
      </div>
    </div>
  </main>
</template>
