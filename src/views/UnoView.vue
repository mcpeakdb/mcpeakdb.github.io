<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import useUno from '@/composables/useUno';
import UnoCardDeck from '@/components/UnoCard/UnoCardDeck.vue';
import UnoCardHand from '@/components/UnoCard/UnoCardHand.vue';
import UnoCardComponent from '@/components/UnoCard/UnoCard.vue';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import TopMenu from '@/components/Layout/TopMenu.vue';
import BaseAlert from '@/components/Layout/Alerts/BaseAlert.vue';
import { CARD_BACKS } from '@/constants/cardStyles';
import { TABLE_THEMES } from '@/constants/tableThemes';
import SimpleModal from '@/components/Layout/SimpleModal.vue';
import UnoColorPicker from '@/components/UnoCard/UnoColorPicker.vue';

const {
  gameState,
  playerHand,
  computerHand,
  deck,
  currentCard,
  currentColor,
  isPlayerTurn,
  canPlayCard,
  canDrawCard,
  mustDrawCard,
  didPlayerWin,
  cardBack,
  tableTheme,
  initializeGame,
  playCard,
  drawCard,
  endTurn,
  reset,
  setWildColor,
  sayUno,
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

const handleEndTurn = () => {
  endTurn();
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
  if (canDrawCard.value) {
    drawCard();
  }
};

const handleSayUno = () => {
  sayUno();
};

const getCurrentTurnText = () => {
  if (!gameState.isDealt) {
    return 'Dealing cards...';
  }
  if (mustDrawCard.value) {
    return 'No playable cards - Must draw!';
  }
  if (gameState.playerJustDrewCard) {
    return 'Play drawn card or turn ends automatically';
  }
  if (gameState.playerMustSayUno) {
    return 'Say UNO! You have one card left!';
  }
  return isPlayerTurn.value ? 'Your Turn' : "Computer's Turn";
};

const getCurrentTurnClass = () => {
  if (!gameState.isDealt) {
    return 'text-blue-400';
  }
  if (mustDrawCard.value) {
    return 'text-red-400';
  }
  if (gameState.playerMustSayUno) {
    return 'text-yellow-400 animate-pulse';
  }
  if (gameState.isComputerThinking) {
    return 'text-yellow-400';
  }
  if (gameState.playerJustDrewCard) {
    return 'text-orange-400';
  }
  return isPlayerTurn.value ? 'text-green-400' : 'text-blue-400';
};

const drawnCardIndex = computed(() => {
  if (!gameState.drawnCard) return -1;
  return playerHand.value.findIndex((card) => card.id === gameState.drawnCard!.id);
});

const deckCardsRemaining = computed(() => deck.value.length);
</script>

<template>
  <main
    :style="{ height: mainHeight }"
    class="w-screen overflow-x-hidden fixed inset-0 bg-black"
    :class="{ 'pointer-events-none': gameState.isComputerThinking }"
  >
    <div :style="{ height: contentHeight }" class="relative flex flex-col">
      <div class="w-full grid grid-cols-3 justify-between items-center p-2">
        <TopMenu />

        <!-- Turn Indicator -->
        <div class="flex items-center justify-center">
          <div
            class="px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm text-white font-bold text-lg text-center"
            :class="getCurrentTurnClass()"
          >
            {{ getCurrentTurnText() }}
          </div>
        </div>

        <div class="flex justify-end">
          <ActionButton @click="settingsModal?.setShow(true)">Settings</ActionButton>
        </div>

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
                href="https://github.com/mcpeakdb/mcpeakdb.github.io/issues/new?assignees=&labels=bug&template=bug_report.md"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity capitalize bg-gradient-to-br from-gray-700 to-gray-900 text-white text-center block"
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

      <div
        class="flex-grow flex flex-col items-center justify-center gap-2 my-2"
        :class="TABLE_THEMES[tableTheme]"
      >
        <!-- Computer Hand -->
        <UnoCardHand
          :card-back="cardBack"
          :hand="computerHand"
          :visible="0"
          size="md"
          orientation="horizontal"
          :is-interactive="false"
          class="mb-2"
        />

        <!-- Game Area -->
        <div class="flex gap-4 items-center mb-2">
          <!-- Draw Pile -->
          <UnoCardDeck
            :card-back="cardBack"
            size="md"
            :show-count="true"
            :disabled="!canDrawCard"
            :cards-remaining="deckCardsRemaining"
            @click="handleDrawCard"
          />

          <!-- Current Color Indicator -->
          <div class="text-center">
            <div class="text-sm mb-1">Current Color</div>
            <div
              class="w-8 h-8 rounded-full border-2 border-white shadow-lg"
              :class="`bg-uno-${currentColor}`"
            ></div>
          </div>

          <!-- Discard Pile -->
          <div v-if="currentCard" class="relative">
            <div class="text-sm mb-1 text-center">Discard Pile</div>
            <UnoCardComponent
              :card="currentCard"
              size="md"
              :is-visible="true"
              :is-interactive="false"
            />
          </div>
        </div>

        <!-- Player Hand -->
        <UnoCardHand
          :card-back="cardBack"
          :hand="playerHand"
          :visible="-1"
          size="md"
          orientation="horizontal"
          :is-interactive="isPlayerTurn && !gameState.isComputerThinking && gameState.isDealt"
          :highlighted-card-index="drawnCardIndex"
          @card-clicked="handleCardPlay"
        />

        <!-- UNO Button -->
        <div v-if="gameState.playerMustSayUno" class="mt-2">
          <ActionButton
            class="bg-yellow-600 hover:bg-yellow-700 text-xl font-bold animate-pulse"
            @click="handleSayUno"
          >
            SAY UNO!
          </ActionButton>
        </div>

        <!-- Drawn Card Action -->
        <div v-if="gameState.playerJustDrewCard && gameState.drawnCard" class="mt-2">
          <div v-if="canPlayCard(gameState.drawnCard)" class="flex gap-2 justify-center mt-2">
            <ActionButton variant="neutral" @click="handleEndTurn"> End Turn </ActionButton>
          </div>
        </div>
      </div>

      <div class="w-full">
        <div v-if="gameState.isGameOver" class="flex justify-center m-2">
          <BaseAlert v-if="didPlayerWin"> 🎉 UNO VICTORY! 🎉 </BaseAlert>
          <BaseAlert v-else variant="danger"> 💀 YOU LOSE! 💀 </BaseAlert>
        </div>

        <div
          class="flex justify-between bg-black/90 backdrop-blur-sm p-3 md:p-4 pt-4 md:pt-5 rounded-t-2xl shadow-lg"
        >
          <div class="flex-1 flex-grow text-center">
            <div class="text-sm md:text-lg uppercase tracking-wider text-gray-400">Your Cards</div>
            <div class="text-2xl md:text-3xl font-bold">{{ playerHand.length }}</div>
          </div>

          <div
            class="flex flex-1 flex-grow justify-center items-center px-2 md:px-4 border-x border-gray-700"
          >
            <div class="text-center">
              <div v-if="!gameState.isDealt" class="text-lg font-semibold text-blue-400">
                Dealing Cards...
              </div>
              <div
                v-else-if="gameState.isComputerThinking"
                class="text-lg font-semibold text-yellow-400"
              >
                Computer is thinking...
              </div>
              <div v-else-if="mustDrawCard" class="text-lg font-semibold text-red-400">
                No playable cards - Must draw!
              </div>
              <div
                v-else-if="gameState.playerMustSayUno"
                class="text-lg font-semibold text-yellow-400 animate-pulse"
              >
                Say UNO! One card left!
              </div>
              <div
                v-else-if="gameState.playerJustDrewCard"
                class="text-lg font-semibold text-orange-400"
              >
                Play drawn card or turn ends automatically
              </div>
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
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
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
