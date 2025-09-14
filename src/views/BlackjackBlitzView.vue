<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import useBlackjackBlitz, { type ModifierCard } from '@/composables/useBlackjackBlitz';
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
  blackjackState,
  playerHand,
  playerHandTotal,
  computerHand,
  computerHandTotal,
  didPlayerWin,
  cardBack,
  tableTheme,
  isGameOver,
  winner,
  playerChipsPercentage,
  computerChipsPercentage,
  initializeBlitzGame,
  resetGame,
  startNewRound,
  playModifierCard,
  executeHit,
  executeStand,
  startBlackjackPhase,
} = useBlackjackBlitz;

onMounted(() => {
  initializeBlitzGame();
});

onUnmounted(() => {
  resetGame();
});

const settingsModal = ref<typeof SimpleModal>();
const modifierModal = ref<typeof SimpleModal>();
const selectedAction = ref<'hit' | 'stand' | null>(null);

// Handle modifier card selection phase
const selectAction = (action: 'hit' | 'stand') => {
  selectedAction.value = action;
  if (gameState.canPlayModifier && gameState.playerModifierCards.length > 0) {
    modifierModal.value?.setShow(true);
  } else {
    executeAction(action);
  }
};

const executeAction = async (action: 'hit' | 'stand') => {
  if (action === 'hit') {
    executeHit();
  } else {
    await executeStand();
  }
  selectedAction.value = null;
};

const playModifierAndExecute = (card: ModifierCard) => {
  playModifierCard(card, true);
  modifierModal.value?.setShow(false);
  if (selectedAction.value) {
    executeAction(selectedAction.value);
  }
};

const skipModifierAndExecute = () => {
  modifierModal.value?.setShow(false);
  if (selectedAction.value) {
    executeAction(selectedAction.value);
  }
};

const handleDeal = () => {
  if (gameState.currentPhase === 'setup' || gameState.currentPhase === 'modifier-selection') {
    startBlackjackPhase();
  } else if (gameState.currentPhase === 'damage-calculation') {
    // Wait for damage calculation to complete
    return;
  } else {
    startNewRound();
  }
};

const { cardSize } = useResponsiveCardSize();
</script>

<template>
  <main
    class="w-screen h-screen overflow-x-hidden flex flex-col bg-black px-4"
    :class="{ 'pointer-events-none': blackjackState.isComputerThinking }"
  >
    <!-- Top Menu and Settings -->
    <div class="w-full flex justify-between py-2 static top-0 z-50 bg-inherit">
      <TopMenu />
      <ActionButton @click="settingsModal?.setShow(true)">Settings</ActionButton>

      <!-- Settings Modal -->
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
        </div>
      </SimpleModal>

      <!-- Modifier Card Selection Modal -->
      <SimpleModal ref="modifierModal">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">Choose a Modifier Card</h2>
        <p class="text-sm md:text-base mb-4 opacity-80">
          Select a modifier card to play before your {{ selectedAction }} action, or skip to
          continue.
        </p>

        <div class="space-y-4 mb-6">
          <div
            v-for="card in gameState.playerModifierCards"
            :key="card.id"
            class="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 hover:bg-opacity-10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
            :class="{
              'border-gray-400': card.rarity === 'Common',
              'border-green-400': card.rarity === 'Uncommon',
              'border-blue-400': card.rarity === 'Rare',
              'border-purple-400': card.rarity === 'Epic',
            }"
            @click="playModifierAndExecute(card)"
          >
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-semibold text-lg">{{ card.name }}</h4>
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="{
                  'bg-gray-600 text-gray-200': card.rarity === 'Common',
                  'bg-green-600 text-green-200': card.rarity === 'Uncommon',
                  'bg-blue-600 text-blue-200': card.rarity === 'Rare',
                  'bg-purple-600 text-purple-200': card.rarity === 'Epic',
                }"
              >
                {{ card.rarity }}
              </span>
            </div>
            <p class="text-sm opacity-75">
              {{ card.description }}
            </p>
          </div>
        </div>

        <div class="flex gap-2 justify-center">
          <ActionButton variant="plain" class="text-base" @click="skipModifierAndExecute">
            Skip Modifier
          </ActionButton>
        </div>
      </SimpleModal>
    </div>

    <!-- Chips and Armor Bars -->
    <div class="w-full flex justify-between items-center py-2 px-4">
      <!-- Computer Stats -->
      <div class="flex-1 max-w-xs">
        <div class="text-sm text-white mb-1">Dealer</div>
        <!-- Chips Bar -->
        <div class="w-full bg-gray-700 rounded-full h-3 mb-1">
          <div
            class="bg-red-500 h-3 rounded-full transition-all duration-500 ease-in-out"
            :style="{ width: `${computerChipsPercentage}%` }"
          ></div>
        </div>
        <div class="text-xs text-white mb-2">
          💎 {{ gameState.computerChips }}/{{ gameState.maxChips }}
        </div>
        <!-- Armor Display -->
        <div v-if="gameState.computerArmor > 0" class="flex items-center">
          <div class="text-xs text-blue-300 mr-2">🛡️ {{ gameState.computerArmor }}</div>
          <div class="flex-1 bg-gray-600 rounded-full h-2">
            <div
              class="bg-blue-400 h-2 rounded-full transition-all duration-300 shadow-sm shadow-blue-400/50"
              :style="{ width: `${Math.min(100, (gameState.computerArmor / 5) * 100)}%` }"
            ></div>
          </div>
        </div>
        <!-- Damage Blocked Indicator -->
        <div
          v-if="gameState.lastDamageBlocked.computer > 0"
          class="text-xs text-blue-300 mt-1 animate-pulse"
        >
          🛡️ Blocked {{ gameState.lastDamageBlocked.computer }} damage!
        </div>
      </div>

      <!-- Round Counter -->
      <div class="text-center px-4">
        <div class="text-lg font-bold text-white">Round {{ gameState.roundNumber }}</div>
        <div class="text-xs text-gray-400 uppercase tracking-wider">
          {{ gameState.currentPhase.replace('-', ' ') }}
        </div>
      </div>

      <!-- Player Stats -->
      <div class="flex-1 max-w-xs">
        <div class="text-sm text-white mb-1 text-right">Player</div>
        <!-- Chips Bar -->
        <div class="w-full bg-gray-700 rounded-full h-3 mb-1">
          <div
            class="bg-green-500 h-3 rounded-full transition-all duration-500 ease-in-out"
            :style="{ width: `${playerChipsPercentage}%` }"
          ></div>
        </div>
        <div class="text-xs text-white mb-2 text-right">
          💎 {{ gameState.playerChips }}/{{ gameState.maxChips }}
        </div>
        <!-- Armor Display -->
        <div v-if="gameState.playerArmor > 0" class="flex items-center justify-end">
          <div class="flex-1 bg-gray-600 rounded-full h-2 mr-2">
            <div
              class="bg-blue-400 h-2 rounded-full transition-all duration-300 shadow-sm shadow-blue-400/50"
              :style="{ width: `${Math.min(100, (gameState.playerArmor / 5) * 100)}%` }"
            ></div>
          </div>
          <div class="text-xs text-blue-300">🛡️ {{ gameState.playerArmor }}</div>
        </div>
        <!-- Damage Blocked Indicator -->
        <div
          v-if="gameState.lastDamageBlocked.player > 0"
          class="text-xs text-blue-300 mt-1 text-right animate-pulse"
        >
          🛡️ Blocked {{ gameState.lastDamageBlocked.player }} damage!
        </div>
      </div>
    </div>

    <!-- Active Modifiers Display -->
    <div class="w-full flex justify-between px-4 py-2">
      <!-- Computer Active Modifiers -->
      <div class="flex-1">
        <div class="text-xs text-gray-400 mb-1">Dealer Modifiers</div>
        <div class="flex gap-1 flex-wrap">
          <span
            v-for="modifier in gameState.activeComputerModifiers"
            :key="modifier.id"
            class="text-xs px-2 py-1 bg-red-600 bg-opacity-50 rounded-full"
          >
            {{ modifier.name }}
          </span>
        </div>
      </div>

      <!-- Player Active Modifiers -->
      <div class="flex-1 text-right">
        <div class="text-xs text-gray-400 mb-1">Player Modifiers</div>
        <div class="flex gap-1 flex-wrap justify-end">
          <span
            v-for="modifier in gameState.activePlayerModifiers"
            :key="modifier.id"
            class="text-xs px-2 py-1 bg-blue-600 bg-opacity-50 rounded-full"
          >
            {{ modifier.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Game Table -->
    <div
      class="h-full flex-grow flex flex-col items-center justify-center gap-2 p-8 rotate-x-[30deg] w-full rounded-2xl"
      :class="TABLE_THEMES[tableTheme]"
      style="transform-style: preserve-3d"
    >
      <!-- Computer Hand -->
      <StandardCardHand
        :card-back="cardBack"
        :hand="computerHand"
        :visible="blackjackState.showComputerHand ? -1 : 1"
        orientation="horizontal"
        class="transform-gpu"
        style="transform-style: preserve-3d"
        :size="cardSize"
      />

      <!-- Player Hand -->
      <StandardCardHand
        :card-back="cardBack"
        :hand="playerHand"
        :visible="-1"
        orientation="horizontal"
        class="transform-gpu"
        style="transform-style: preserve-3d"
        :size="cardSize"
      />

      <!-- Dealer Score -->
      <div class="flex-1 flex-grow text-center absolute bottom-0 left-0 mx-2 tall:my-2">
        <div class="text-sm md:text-lg uppercase tracking-wider">Dealer</div>
        <div class="text-2xl md:text-3xl font-bold">
          <span v-if="blackjackState.showComputerHand">{{ computerHandTotal }}</span>
          <span v-else>??</span>
        </div>
        <!-- Dealer Armor Display -->
        <div v-if="gameState.computerArmor > 0" class="text-sm text-blue-300 mt-1">
          🛡️ {{ gameState.computerArmor }}
        </div>
      </div>

      <!-- Game Actions -->
      <div class="flex-1 flex-grow text-center absolute bottom-0 left-0 right-0 m-2">
        <!-- Blackjack Actions -->
        <div
          v-if="
            blackjackState.isDealt &&
            gameState.currentPhase === 'blackjack' &&
            !gameState.bustHandled
          "
          class="flex gap-2 justify-center"
          :class="{
            'pointer-events-none': blackjackState.isComputerThinking || playerHandTotal > 21,
          }"
        >
          <ActionButton
            variant="plain"
            class="text-base md:text-xl"
            :class="CARD_BACKS[cardBack]"
            :disabled="playerHandTotal > 21"
            @click="selectAction('hit')"
          >
            Hit
          </ActionButton>
          <ActionButton
            variant="plain"
            class="text-base md:text-xl"
            :class="CARD_BACKS[cardBack]"
            :disabled="playerHand.length < 2 || playerHandTotal > 21"
            @click="selectAction('stand')"
          >
            Stand
          </ActionButton>
        </div>

        <!-- Deal Button - Updated condition to exclude bust scenarios -->
        <ActionButton
          v-if="
            ((blackjackState.isGameOver &&
              gameState.currentPhase !== 'damage-calculation' &&
              !gameState.bustHandled) ||
              gameState.currentPhase === 'modifier-selection') &&
            !isGameOver
          "
          variant="plain"
          class="text-base md:text-xl"
          :class="CARD_BACKS[cardBack]"
          @click="handleDeal"
        >
          <span>Start Round</span>
        </ActionButton>

        <!-- New Game Button -->
        <ActionButton
          v-if="isGameOver"
          variant="plain"
          class="text-base md:text-xl ml-2"
          :class="CARD_BACKS[cardBack]"
          @click="resetGame"
        >
          New Game
        </ActionButton>
      </div>

      <!-- Player Score -->
      <div class="flex-1 flex-grow text-center absolute bottom-0 right-0 mx-2 tall:my-2">
        <div class="text-sm md:text-lg uppercase tracking-wider">Player</div>
        <div class="text-2xl md:text-3xl font-bold">{{ playerHandTotal }}</div>
      </div>

      <!-- Game Over Alerts -->
      <div
        v-if="blackjackState.isGameOver || isGameOver"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <!-- Round Result - Only show if not in damage calculation and game isn't over -->
        <BaseAlert
          v-if="
            blackjackState.isGameOver &&
            !isGameOver &&
            gameState.currentPhase !== 'damage-calculation'
          "
        >
          <div v-if="playerHandTotal > 21" class="text-center">
            💥 BUST! 💥
            <div class="text-sm mt-1">You went over 21!</div>
            <div v-if="gameState.lastDamageBlocked.player > 0" class="text-xs text-blue-300 mt-1">
              🛡️ Armor blocked {{ gameState.lastDamageBlocked.player }} damage
            </div>
          </div>
          <div v-else-if="computerHandTotal > 21" class="text-center">
            🎯 DEALER BUST! 🎯
            <div class="text-sm mt-1">Dealer went over 21!</div>
            <div v-if="gameState.lastDamageBlocked.computer > 0" class="text-xs text-blue-300 mt-1">
              🛡️ Dealer's armor blocked {{ gameState.lastDamageBlocked.computer }} damage
            </div>
          </div>
          <div v-else-if="didPlayerWin" class="text-center">
            🎯 ROUND WON! 🎯
            <div class="text-sm mt-1">Dealer takes damage!</div>
            <div v-if="gameState.lastDamageBlocked.computer > 0" class="text-xs text-blue-300 mt-1">
              🛡️ Dealer's armor blocked {{ gameState.lastDamageBlocked.computer }} damage
            </div>
          </div>
          <div v-else class="text-center">
            💥 ROUND LOST! 💥
            <div class="text-sm mt-1">You take damage!</div>
            <div v-if="gameState.lastDamageBlocked.player > 0" class="text-xs text-blue-300 mt-1">
              🛡️ Your armor blocked {{ gameState.lastDamageBlocked.player }} damage
            </div>
          </div>
        </BaseAlert>

        <!-- Final Game Result - Only show when the entire game is over -->
        <BaseAlert v-if="isGameOver" variant="success">
          <div v-if="winner === 'player'" class="text-center">
            🏆 VICTORY! 🏆
            <div class="text-sm mt-1">You defeated the dealer!</div>
          </div>
          <div v-else-if="winner === 'computer'" class="text-center">
            ☠️ DEFEAT! ☠️
            <div class="text-sm mt-1">The dealer has won!</div>
          </div>
        </BaseAlert>
      </div>

      <!-- Damage Calculation Phase -->
      <div
        v-if="gameState.currentPhase === 'damage-calculation'"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <BaseAlert variant="info">
          <div class="text-center">
            ⚔️ CALCULATING DAMAGE ⚔️
            <div class="text-sm mt-1">Applying round results...</div>
            <!-- Show armor effects during calculation -->
            <div
              v-if="
                gameState.lastDamageBlocked.player > 0 || gameState.lastDamageBlocked.computer > 0
              "
              class="text-xs text-blue-300 mt-2"
            >
              <div v-if="gameState.lastDamageBlocked.player > 0">
                🛡️ Player armor blocked {{ gameState.lastDamageBlocked.player }} damage
              </div>
              <div v-if="gameState.lastDamageBlocked.computer > 0">
                🛡️ Dealer armor blocked {{ gameState.lastDamageBlocked.computer }} damage
              </div>
            </div>
          </div>
        </BaseAlert>
      </div>
    </div>

    <!-- Player Modifier Cards Display (Bottom) -->
    <div
      v-if="gameState.playerModifierCards.length > 0 && gameState.currentPhase !== 'game-over'"
      class="w-full px-4 py-2 bg-gray-900 bg-opacity-50"
    >
      <div class="text-xs text-gray-400 mb-2 text-center">Your Modifier Cards</div>
      <div class="flex gap-2 justify-center overflow-visible">
        <div
          v-for="card in gameState.playerModifierCards"
          :key="card.id"
          class="flex-shrink-0 p-2 border rounded-lg text-center min-w-[120px] cursor-pointer hover:bg-gray-700 hover:bg-opacity-30 transition-all duration-200 hover:-translate-y-1 relative"
          :class="{
            'border-gray-500 bg-gray-800 bg-opacity-30': card.rarity === 'Common',
            'border-green-500 bg-green-800 bg-opacity-30': card.rarity === 'Uncommon',
            'border-blue-500 bg-blue-800 bg-opacity-30': card.rarity === 'Rare',
            'border-purple-500 bg-purple-800 bg-opacity-30': card.rarity === 'Epic',
          }"
          @click="gameState.canPlayModifier ? modifierModal?.setShow(true) : null"
        >
          <!-- Armor indicator for armor-related cards -->
          <div
            v-if="card.effects.find((effect) => effect.effect.includes('armor'))"
            class="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-blue-500/50"
          >
            🛡️
          </div>
          <div class="text-xs font-semibold text-white">{{ card.name }}</div>
          <div
            class="text-xs mt-1"
            :class="{
              'text-gray-300': card.rarity === 'Common',
              'text-green-300': card.rarity === 'Uncommon',
              'text-blue-300': card.rarity === 'Rare',
              'text-purple-300': card.rarity === 'Epic',
            }"
          >
            {{ card.rarity }}
          </div>
        </div>
      </div>
    </div>

    <!-- Game Instructions (Show during setup) -->
    <div
      v-if="gameState.currentPhase === 'setup' || gameState.currentPhase === 'modifier-selection'"
      class="w-full px-4 py-2 bg-blue-900 bg-opacity-30 text-center"
    >
      <div class="text-sm text-blue-200">
        <span v-if="gameState.currentPhase === 'setup'">
          🎮 Welcome to Blackjack Blitz! Battle the dealer with modifier cards, chips, and armor
          protection.
        </span>
        <span v-else-if="gameState.currentPhase === 'modifier-selection'">
          🃏 Round {{ gameState.roundNumber }} - You have
          {{ gameState.playerModifierCards.length }} modifier cards. Click "Start Round" to begin!
        </span>
      </div>
    </div>
  </main>
</template>
