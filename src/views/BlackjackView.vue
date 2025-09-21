<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import useBlackjack from '@/composables/useBlackjack';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import TopMenu from '@/components/Layout/TopMenu.vue';
import BaseAlert from '@/components/Layout/Alerts/BaseAlert.vue';
import SimpleModal from '@/components/Layout/SimpleModal.vue';
import PlayerScore from '@/components/Blackjack/PlayerScore.vue';
import { useResponsiveCardSize } from '@/composables/useResponsiveCardSize';
import useTheme from '@/composables/useTheme';
import BlackjackSettings from './modals/BlackjackSettings.vue';
import HitButton from '@/components/Blackjack/HitButton.vue';
import StandButton from '@/components/Blackjack/StandButton.vue';

const {
  gameState,
  playerHand,
  playerHandTotal,
  computerHand,
  computerHandTotal,
  didPlayerWin,
  initializeGame,
  dealHand,
  hit,
  endTurn,
  reset,
} = useBlackjack;

const { cardBack, tableTheme } = useTheme;

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
        <BlackjackSettings />
      </SimpleModal>
    </div>

    <div
      class="h-full flex-grow flex flex-col items-center justify-center gap-2 p-8 rotate-x-[30deg] w-full rounded-2xl"
      :class="tableTheme"
    >
      <StandardCardHand
        :hand="computerHand"
        :visible="gameState.showComputerHand ? -1 : 1"
        orientation="horizontal"
        class="transform-3d"
        :size="cardSize"
      />

      <StandardCardHand
        :hand="playerHand"
        :visible="-1"
        orientation="horizontal"
        class="transform-3d"
        :size="cardSize"
      />

      <PlayerScore :title="'Player'" :hand-total="playerHandTotal" />
      <PlayerScore
        :title="'Dealer'"
        :show-total="gameState.showComputerHand"
        :hand-total="computerHandTotal"
        :right="true"
      />

      <div class="flex-1 flex-grow text-center absolute bottom-0 left-0 right-0 m-2">
        <div
          v-if="gameState.isDealt"
          class="flex gap-2 justify-center"
          :class="{
            'pointer-events-none': gameState.isComputerThinking,
          }"
        >
          <HitButton @click="hit" />
          <StandButton @click="stand" />
        </div>
        <ActionButton
          v-if="(!gameState.isDealt && playerHand.length === 0) || gameState.isGameOver"
          variant="plain"
          class="text-base md:text-xl"
          :class="cardBack"
          @click="dealHand"
        >
          Deal
        </ActionButton>
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
