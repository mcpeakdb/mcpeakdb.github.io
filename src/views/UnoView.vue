<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import useUno from '@/composables/useUno';
import UnoCardDeck from '@/components/UnoCardDeck.vue';
import UnoCardHand from '@/components/UnoCardHand.vue';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import TopMenu from '@/components/Layout/TopMenu.vue';
import BaseAlert from '@/components/Layout/Alerts/BaseAlert.vue';
import { CARD_BACKS } from '@/constants/cardStyles';
import { TABLE_THEMES } from '@/constants/tableThemes';
import SimpleModal from '@/components/Layout/SimpleModal.vue';
import UnoColorPicker from '@/components/UnoColorPicker.vue';

const {
  gameState,
  playerHand,
  computerHand,
  currentCard,
  currentColor,
  isPlayerTurn,
  canPlayCard,
  didPlayerWin,
  cardBack,
  tableTheme,
  initializeGame,
  dealCards,
  playCard,
  drawCard,
  endTurn,
  reset,
  setWildColor,
} = useUno;

onMounted(() => {
  initializeGame();
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  reset();
  window.removeEventListener('resize', handleResize);
});

const settingsModal = ref<typeof SimpleModal>();
const colorPickerModal = ref<typeof SimpleModal>();
const mainHeight = ref('100vh');
const contentHeight = ref('100%');

const handleResize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  mainHeight.value = `${window.innerHeight}px`;
  contentHeight.value = `${window.innerHeight}px`;
};

const handleCardPlay = (cardIndex: number) => {
  const card = playerHand.value[cardIndex];
  if (canPlayCard(card)) {
    if (card.isWild) {
      colorPickerModal.value?.setShow(true);
      gameState.pendingWildCard = card;
      gameState.pendingWildCardIndex = cardIndex;
    } else {
      playCard(cardIndex);
    }
  }
};

const handleColorChoice = (color: string) => {
  if (gameState.pendingWildCard && gameState.pendingWildCardIndex !== null) {
    setWildColor(color as 'red' | 'green' | 'blue' | 'yellow');
    playCard(gameState.pendingWildCardIndex);
    gameState.pendingWildCard = null;
    gameState.pendingWildCardIndex = null;
  }
  colorPickerModal.value?.setShow(false);
};

const handleDrawCard = () => {
  drawCard();
};
</script>

<template>
  <main
    :style="{ height: mainHeight }"
    class="w-screen overflow-x-hidden fixed inset-0"
    :class="[{ 'pointer-events-none': gameState.isComputerThinking }, TABLE_THEMES[tableTheme]]"
  >
    <div :style="{ height: contentHeight }" class="relative flex flex-col">
      <div class="w-full flex justify-between p-2">
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

            <div class="setting-section">
              <h5 class="text-lg md:text-xl font-semibold mb-3">Report Issues</h5>
              <a
                href="https://github.com/mcpeakdb/mcpeakdb.github.io//issues"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity capitalize bg-gradient-to-br from-gray-700 to-gray-900 text-white text-center"
              >
                GitHub Issues
              </a>
            </div>
          </div>
        </SimpleModal>

        <SimpleModal ref="colorPickerModal">
          <UnoColorPicker @color-selected="handleColorChoice" />
        </SimpleModal>
      </div>

      <div class="flex-grow flex flex-col items-center justify-end gap-2 my-2">
        <UnoCardHand
          :card-back="cardBack"
          :hand="computerHand"
          :visible="0"
          size="sm"
          orientation="horizontal"
          :is-interactive="false"
          class="mb-2"
        />

        <div class="flex gap-4 items-center mb-2">
          <UnoCardDeck
            :card-back="cardBack"
            size="md"
            :show-count="true"
            class="cursor-pointer"
            @click="handleDrawCard"
          />

          <div class="text-center">
            <div class="text-sm text-white mb-1">Current Color</div>
            <div
              class="w-8 h-8 rounded-full border-2 border-white"
              :class="`bg-uno-${currentColor}`"
            ></div>
          </div>

          <div v-if="currentCard" class="relative">
            <div class="text-sm text-white mb-1 text-center">Discard Pile</div>
            <div
              :class="`bg-uno-${currentCard.suit}`"
              class="w-20 h-28 border-4 border-white rounded-lg text-white flex items-center justify-center text-2xl font-bold"
              style="-webkit-text-stroke: 1px black"
            >
              {{ currentCard.text }}
            </div>
          </div>
        </div>

        <UnoCardHand
          :card-back="cardBack"
          :hand="playerHand"
          :visible="-1"
          size="md"
          orientation="horizontal"
          :is-interactive="isPlayerTurn"
          @card-clicked="handleCardPlay"
        />
      </div>

      <div class="w-full">
        <div v-if="gameState.isGameOver" class="flex justify-center m-2">
          <BaseAlert v-if="didPlayerWin"> 🎉 UNO VICTORY! 🎉 </BaseAlert>
          <BaseAlert v-else variant="danger"> 💀 YOU LOSE! 💀 </BaseAlert>
        </div>

        <div
          class="flex justify-between bg-black/90 backdrop-blur-sm p-3 md:p-4 pt-4 md:pt-5 rounded-t-2xl text-white shadow-lg"
        >
          <div class="flex-1 flex-grow text-center">
            <div class="text-sm md:text-lg uppercase tracking-wider text-gray-400">Your Cards</div>
            <div class="text-2xl md:text-3xl font-bold">{{ playerHand.length }}</div>
          </div>

          <div
            class="flex flex-1 flex-grow justify-center items-center px-2 md:px-4 border-x border-gray-700"
            :class="{
              'pointer-events-none': gameState.isComputerThinking,
            }"
          >
            <ActionButton v-if="!gameState.isDealt" class="text-base md:text-xl" @click="dealCards">
              Deal Cards
            </ActionButton>

            <div v-else class="flex gap-2 md:gap-3">
              <ActionButton
                class="text-base md:text-xl"
                :disabled="!isPlayerTurn"
                @click="handleDrawCard"
              >
                Draw Card
              </ActionButton>
              <ActionButton class="text-base md:text-xl" :disabled="!isPlayerTurn" @click="endTurn">
                Pass Turn
              </ActionButton>
            </div>
          </div>

          <div class="flex-1 flex-grow text-center">
            <div class="text-sm md:text-lg uppercase tracking-wider text-gray-400">
              Computer Cards
            </div>
            <div class="text-2xl md:text-3xl font-bold">{{ computerHand.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="gameState.isGameOver"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div class="bg-white text-black rounded-xl p-8 text-center max-w-md mx-4">
        <h2 class="text-3xl font-bold mb-4">
          {{ didPlayerWin ? '🎉 UNO VICTORY! 🎉' : '💀 YOU LOSE! 💀' }}
        </h2>
        <p class="text-gray-600 mb-6">
          {{ didPlayerWin ? 'Congratulations! You beat the computer!' : 'Better luck next time!' }}
        </p>
        <ActionButton @click="reset">Play Again</ActionButton>
      </div>
    </div>
  </main>
</template>
<style>
/* Add these to your global CSS or Tailwind config */
.bg-uno-red {
  background-color: #e53e3e;
}

.bg-uno-green {
  background-color: #38a169;
}

.bg-uno-blue {
  background-color: #3182ce;
}

.bg-uno-yellow {
  background-color: #d69e2e;
}
</style>
