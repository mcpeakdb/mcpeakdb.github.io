<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import useBlackjack from '@/composables/useBlackjack';
import StandardCardDeck from '@/components/StandardCardDeck.vue';
import StandardCardHand from '@/components/StandardCardHand.vue';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import TopMenu from '@/components/Layout/TopMenu.vue';
import BaseAlert from '@/components/Layout/Alerts/BaseAlert.vue';
import { CARD_BACKS } from '@/constants/cardStyles';
import { TABLE_THEMES } from '@/constants/tableThemes';
import SimpleModal from '@/components/Layout/SimpleModal.vue';

const {
  gameState,
  playerHand,
  playerHandTotal,
  computerHand,
  computerHandTotal,
  didPlayerWin,
  cardBack,
  tableTheme,
  initializeGame,
  dealHand,
  hit,
  endTurn,
  reset,
} = useBlackjack;

onMounted(() => {
  initializeGame();
});

onUnmounted(() => {
  reset();
});

const settingsModal = ref<typeof SimpleModal>();

// Stand function that calls endTurn
const stand = () => {
  if (playerHand.value.length >= 2) {
    endTurn();
  }
};
</script>

<template>
  <main
    class="w-screen h-screen overflow-x-hidden flex flex-col bg-black"
    :class="{ 'pointer-events-none': gameState.isComputerThinking }"
  >
    <div class="w-full flex justify-between p-2 sticky top-0 z-50 bg-inherit">
      <TopMenu />
      <ActionButton @click="settingsModal?.setShow(true)">Settings</ActionButton>
      <SimpleModal ref="settingsModal">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">Game Settings</h2>

        <div class="space-y-6">
          <div class="setting-section">
            <h5 class="text-lg md:text-xl font-semibold mb-3">Card Back Style</h5>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="(back, name) in CARD_BACKS"
                :key="name"
                class="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity capitalize bg-gradient-to-br"
                :class="back"
                @click="cardBack = name"
              >
                {{ name }}
              </button>
            </div>
          </div>

          <!-- <div class="setting-section">
            <h5 class="text-lg md:text-xl font-semibold mb-3">Game Options</h5>
            <div class="space-y-3">
              <label
                class="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <span>Sound Effects</span>
                <input type="checkbox" class="w-4 h-4 accent-green-600" />
              </label>
              <label
                class="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <span>Animations</span>
                <input type="checkbox" class="w-4 h-4 accent-green-600" checked />
              </label>
              <label
                class="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <span>Auto Stand on 21</span>
                <input type="checkbox" class="w-4 h-4 accent-green-600" checked />
              </label>
            </div>
          </div> -->

          <div class="setting-section">
            <h5 class="text-lg md:text-xl font-semibold mb-3">Table Theme</h5>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="(theme, name) in TABLE_THEMES"
                :key="name"
                class="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity capitalize bg-gradient-to-br"
                :class="theme"
                @click="tableTheme = name"
              >
                {{ name }}
              </button>
            </div>
          </div>
        </div>
      </SimpleModal>
    </div>

    <div
      class="flex-grow flex flex-col items-center justify-center gap-2 p-8 rotate-x-[30deg] scale-125 w-3/4 md:w-1/2 mx-auto my-16 rounded-2xl"
      :class="TABLE_THEMES[tableTheme]"
    >
      <StandardCardHand
        :card-back="cardBack"
        :hand="computerHand"
        :visible="gameState.showComputerHand ? -1 : 1"
        size="md"
        orientation="horizontal"
        :is-interactive="false"
        class="transform-3d"
      />
      <StandardCardDeck
        :card-back="cardBack"
        size="md"
        :show-count="false"
        class="mt-2.5 mb-1.5 transform-3d"
      />

      <StandardCardHand
        :card-back="cardBack"
        :hand="playerHand"
        :visible="-1"
        size="md"
        orientation="horizontal"
        class="transform-3d"
      />

      <div v-if="gameState.isGameOver" class="absolute w-full bottom-0 m-8 flex justify-center">
        <BaseAlert v-if="didPlayerWin"> 🎉 VICTORY! 🎉 </BaseAlert>
        <BaseAlert v-else variant="danger"> 💀 GAME OVER 💀 </BaseAlert>
      </div>
    </div>

    <div class="w-full sticky bottom-0 left-0 z-50">
      <div
        class="flex justify-between bg-black/90 backdrop-blur-sm p-3 md:p-4 pt-4 md:pt-5 rounded-t-2xl text-white shadow-lg"
      >
        <div class="flex-1 flex-grow text-center">
          <div class="text-sm md:text-lg uppercase tracking-wider text-gray-400">Your Hand</div>
          <div class="text-2xl md:text-3xl font-bold">{{ playerHandTotal }}</div>
        </div>

        <div
          class="flex flex-1 flex-grow justify-center items-center px-2 md:px-4 border-x border-gray-700"
          :class="{
            'pointer-events-none': gameState.isComputerThinking,
          }"
        >
          <ActionButton v-if="!gameState.isDealt" class="text-base md:text-xl" @click="dealHand">
            Deal
          </ActionButton>

          <div v-else class="flex gap-2 md:gap-3">
            <ActionButton class="text-base md:text-xl" @click="hit"> Hit </ActionButton>
            <ActionButton
              class="text-base md:text-xl"
              :class="{
                'opacity-50 cursor-not-allowed': playerHand.length < 2,
                'cursor-pointer': playerHand.length >= 2,
              }"
              :disabled="playerHand.length < 2"
              @click="stand"
            >
              Stand
            </ActionButton>
          </div>
        </div>

        <div class="flex-1 flex-grow text-center">
          <div class="text-sm md:text-lg uppercase tracking-wider text-gray-400">Dealer Hand</div>
          <div class="text-2xl md:text-3xl font-bold">
            <span v-if="gameState.showComputerHand">{{ computerHandTotal }}</span>
            <span v-else class="text-yellow-500">??</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.transform-3d {
  transform-style: preserve-3d;
}
</style>
