<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import useBlackjack from '@/composables/useBlackjack';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import TopMenu from '@/components/Layout/TopMenu.vue';
import BaseAlert from '@/components/Layout/Alerts/BaseAlert.vue';
import { CARD_BACKS } from '@/constants/cardStyles';
import { TABLE_THEMES } from '@/constants/tableThemes';
import SimpleModal from '@/components/Layout/SimpleModal.vue';
import { useResponsiveCardSize } from '@/composables/useResponsiveCardSize';

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

const { cardSize } = useResponsiveCardSize();
</script>

<template>
  <main
    class="w-screen h-screen overflow-x-hidden flex flex-col bg-black px-4"
    :class="{ 'pointer-events-none': gameState.isComputerThinking }"
  >
    <div class="w-full flex justify-between py-2 static top-0 z-50 bg-inherit">
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
      class="h-full flex-grow flex flex-col items-center justify-center gap-2 p-8 rotate-x-[30deg] w-full rounded-2xl"
      :class="TABLE_THEMES[tableTheme]"
    >
      <div class="flex gap-2">
        <StandardCardHand
          :card-back="cardBack"
          :hand="computerHand"
          :visible="gameState.showComputerHand ? -1 : 1"
          orientation="horizontal"
          :is-interactive="false"
          class="transform-3d"
          :size="cardSize"
        />
      </div>

      <div
        class="relative flex gap-2"
        :class="{
          'pointer-events-none': gameState.isComputerThinking,
        }"
      >
        <StandardCardHand
          :card-back="cardBack"
          :hand="playerHand"
          :visible="-1"
          orientation="horizontal"
          class="transform-3d"
          :size="cardSize"
        />
      </div>
      <div class="flex-1 flex-grow text-center absolute bottom-0 left-0 mx-2 tall:my-2">
        <div class="text-sm md:text-lg uppercase tracking-wider">Dealer</div>
        <div class="text-2xl md:text-3xl font-bold">
          <span v-if="gameState.showComputerHand">{{ computerHandTotal }}</span>
          <span v-else>??</span>
        </div>
      </div>

      <div class="flex-1 flex-grow text-center absolute bottom-0 left-0 right-0 m-2">
        <div
          v-if="gameState.isDealt"
          class="flex gap-2 justify-center"
          :class="{
            'pointer-events-none': gameState.isComputerThinking,
          }"
        >
          <ActionButton
            variant="plain"
            class="text-base md:text-xl"
            :class="CARD_BACKS[cardBack]"
            @click="hit"
          >
            Hit
          </ActionButton>
          <ActionButton
            variant="plain"
            class="text-base md:text-xl"
            :class="[
              {
                'opacity-50 cursor-not-allowed': playerHand.length < 2,
                'cursor-pointer': playerHand.length >= 2,
              },
              CARD_BACKS[cardBack],
            ]"
            :disabled="playerHand.length < 2"
            @click="stand"
          >
            Stand
          </ActionButton>
        </div>
        <ActionButton
          v-if="(!gameState.isDealt && playerHand.length === 0) || gameState.isGameOver"
          variant="plain"
          class="text-base md:text-xl"
          :class="CARD_BACKS[cardBack]"
          @click="dealHand"
        >
          Deal
        </ActionButton>
      </div>

      <div class="flex-1 flex-grow text-center absolute bottom-0 right-0 mx-2 tall:my-2">
        <div class="text-sm md:text-lg uppercase tracking-wider">Player</div>
        <div class="text-2xl md:text-3xl font-bold">{{ playerHandTotal }}</div>
      </div>

      <div
        v-if="gameState.isGameOver"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <BaseAlert v-if="didPlayerWin"> 🎉 VICTORY! 🎉 </BaseAlert>
        <BaseAlert v-else variant="danger"> 💀 GAME OVER 💀 </BaseAlert>
      </div>
    </div>
  </main>
</template>
