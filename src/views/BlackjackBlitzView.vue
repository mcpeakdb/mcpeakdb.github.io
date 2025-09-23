<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import useBlackjackBlitz from '@/composables/useBlackjackBlitz';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import TopMenu from '@/components/Layout/TopMenu.vue';
import BaseAlert from '@/components/Layout/Alerts/BaseAlert.vue';
import PlayerScore from '@/components/Blackjack/PlayerScore.vue';
import SimpleModal from '@/components/Layout/SimpleModal.vue';
import { useResponsiveCardSize } from '@/composables/useResponsiveCardSize';
import type { ModifierCardData } from '@/assets/blackjack-blitz/modifier-cards';
import HitButton from '@/components/Blackjack/HitButton.vue';
import StandButton from '@/components/Blackjack/StandButton.vue';
import useTheme from '@/composables/useTheme';
import BlackjackSettings from './modals/BlackjackSettings.vue';
import ModifierCard from '@/components/BlackjackBlitz/ModifierCard.vue';

const {
  gameState,
  blackjackState,
  playerHand,
  playerHandTotal,
  computerHand,
  computerHandTotal,
  didPlayerWin,
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

const { cardBack, tableTheme } = useTheme;

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

const playModifierAndExecute = (card: ModifierCardData) => {
  playModifierCard(card);
  modifierModal.value?.setShow(false);
  if (selectedAction.value) {
    executeAction(selectedAction.value);
  }

  handleDeal();
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

const preselectedModifier = ref<ModifierCardData | null>(null);
const preselectModifier = (card: ModifierCardData) => {
  preselectedModifier.value = card;
  modifierModal.value?.setShow(true);
};
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
        <BlackjackSettings />
      </SimpleModal>
    </div>

    <!-- Chips and Armor Bars -->
    <div class="w-full flex justify-between items-center py-2 px-4">
      <!-- Player Stats -->
      <div class="flex-1 max-w-xs">
        <div class="text-sm text-white mb-1">Player</div>
        <!-- Chips Bar -->
        <div class="w-full bg-gray-700 rounded-full h-3 mb-1">
          <div
            class="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-in-out"
            :style="{ width: `${playerChipsPercentage}%` }"
          ></div>
        </div>
        <div class="text-xs text-white mb-2">
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

        <div class="flex-1">
          <div class="text-xs text-gray-400 mb-1">Player Modifiers</div>
          <div class="flex gap-1 flex-wrap justify-start">
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

      <!-- Round Counter -->
      <div class="text-center px-4">
        <div class="text-lg font-bold text-white">Round {{ gameState.roundNumber }}</div>
        <div class="text-xs text-gray-400 uppercase tracking-wider">
          {{ gameState.currentPhase.replace('-', ' ') }}
        </div>
      </div>

      <!-- Computer Stats -->
      <div class="flex-1 max-w-xs">
        <div class="text-sm text-white mb-1 text-right">Dealer</div>
        <!-- Chips Bar -->
        <div class="w-full bg-gray-700 rounded-full h-3 mb-1">
          <div
            class="bg-red-500 h-3 rounded-full transition-all duration-500 ease-in-out"
            :style="{ width: `${computerChipsPercentage}%` }"
          ></div>
        </div>
        <div class="text-xs text-white mb-2 text-right">
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

        <div class="flex-1">
          <div class="text-xs text-gray-400 mb-1 text-right">Dealer Modifiers</div>
        </div>
      </div>
    </div>

    <div
      v-if="gameState.currentPhase === 'modifier-selection'"
      class="flex-grow flex flex-col items-center"
    >
      <!-- Player Modifier Cards Display (Bottom) -->
      <div class="w-full px-4 py-2 bg-gray-900 bg-opacity-50 overflow-hidden">
        <div class="w-full">
          <div class="text-xs text-gray-400 mb-2 text-center">Your Modifier Cards</div>
          <div v-if="gameState.playerModifierCards.length > 0">
            <div class="flex gap-2 overflow-auto">
              <ModifierCard
                v-for="card in gameState.playerModifierCards"
                :key="card.id"
                :card="card"
                @click="preselectModifier(card)"
              />
            </div>
          </div>

          <!-- Modifier Card Selection Modal -->
          <SimpleModal ref="modifierModal">
            <div class="flex items-center justify-center">
              <ModifierCard v-if="preselectedModifier" :card="preselectedModifier" />
            </div>

            <div class="flex gap-2 justify-center">
              <ActionButton
                variant="plain"
                class="text-base"
                @click="playModifierAndExecute(preselectedModifier!)"
              >
                Play Modifier
              </ActionButton>

              <ActionButton variant="plain" class="text-base" @click="skipModifierAndExecute">
                Skip Modifier
              </ActionButton>
            </div>
          </SimpleModal>
        </div>

        <ActionButton
          variant="plain"
          class="text-base md:text-xl w-full mt-2"
          :class="cardBack"
          @click="handleDeal"
        >
          <span>Start Round</span>
        </ActionButton>
      </div>

      <!-- Game Instructions (Show during setup) -->
      <div class="w-full px-4 py-2 bg-blue-900 bg-opacity-30 text-center">
        <div class="text-sm text-blue-200">
          <span>
            🃏 Round {{ gameState.roundNumber }} - Choose a modifier or click "Start Round" to
            begin!
          </span>
        </div>
      </div>
    </div>
    <!-- Game Table -->
    <div
      v-else
      class="flex-grow flex flex-col items-center justify-center gap-2 p-8 rotate-x-[30deg] w-full rounded-2xl"
      :class="tableTheme"
    >
      <!-- Computer Hand -->
      <StandardCardHand
        :hand="computerHand"
        :visible="blackjackState.showComputerHand ? -1 : 1"
        orientation="horizontal"
        class="transform-gpu"
        style="transform-style: preserve-3d"
        :size="cardSize"
      />

      <!-- Player Hand -->
      <StandardCardHand
        :hand="playerHand"
        :visible="-1"
        orientation="horizontal"
        class="transform-gpu"
        style="transform-style: preserve-3d"
        :size="cardSize"
      />

      <PlayerScore :title="'Player'" :hand-total="playerHandTotal" />
      <PlayerScore
        :title="'Dealer'"
        :show-total="blackjackState.showComputerHand"
        :hand-total="computerHandTotal"
        :right="true"
      />

      <!-- Game Actions -->
      <div
        v-if="blackjackState.isDealt && gameState.currentPhase === 'blackjack'"
        class="flex gap-2 justify-center flex-1 flex-grow text-center absolute bottom-0 left-0 right-0 m-2"
        :class="{
          'pointer-events-none': blackjackState.isComputerThinking || playerHandTotal > 21,
        }"
      >
        <HitButton @click="selectAction('hit')" />
        <StandButton @click="selectAction('stand')" />
      </div>

      <!-- Game Over Alerts -->
      <div
        v-if="blackjackState.isGameOver || isGameOver"
        class="absolute inset-0 flex flex-col items-center justify-center"
      >
        <!-- Round Result - Only show if not in damage calculation and game isn't over -->
        <BaseAlert v-if="blackjackState.isGameOver && !isGameOver">
          <div v-if="playerHandTotal > 21" class="text-center">
            💥 BUST! 💥
            <div class="text-sm mt-1">You went over 21!</div>
            <div class="text-sm mt-1">You take {{ gameState.lastDamageTaken.player }} damage!</div>
            <div v-if="gameState.lastDamageBlocked.player > 0" class="text-xs text-blue-300 mt-1">
              🛡️ Armor blocked {{ gameState.lastDamageBlocked.player }} damage
            </div>
          </div>
          <div v-else-if="computerHandTotal > 21" class="text-center">
            🎯 DEALER BUST! 🎯
            <div class="text-sm mt-1">Dealer went over 21!</div>
            <div class="text-sm mt-1">
              Dealer takes {{ gameState.lastDamageTaken.computer }} damage!
            </div>
            <div v-if="gameState.lastDamageBlocked.computer > 0" class="text-xs text-blue-300 mt-1">
              🛡️ Dealer's armor blocked {{ gameState.lastDamageBlocked.computer }} damage
            </div>
          </div>
          <div v-else-if="didPlayerWin" class="text-center">
            🎯 ROUND WON! 🎯
            <div class="text-sm mt-1">
              Dealer takes {{ gameState.lastDamageTaken.computer }} damage!
            </div>
            <div v-if="gameState.lastDamageBlocked.computer > 0" class="text-xs text-blue-300 mt-1">
              🛡️ Dealer's armor blocked {{ gameState.lastDamageBlocked.computer }} damage
            </div>
          </div>
          <div v-else class="text-center">
            💥 ROUND LOST! 💥
            <div class="text-sm mt-1">You take {{ gameState.lastDamageTaken.player }} damage!</div>
            <div v-if="gameState.lastDamageBlocked.player > 0" class="text-xs text-blue-300 mt-1">
              🛡️ Your armor blocked {{ gameState.lastDamageBlocked.player }} damage
            </div>
          </div>
        </BaseAlert>

        <ActionButton
          v-if="blackjackState.isGameOver && !isGameOver"
          variant="plain"
          class="text-base mt-2"
          :class="cardBack"
          @click="startNewRound"
          >Start New Round</ActionButton
        >

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
    </div>
  </main>
</template>
