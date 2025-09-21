<script lang="ts" setup>
import useTheme from '@/composables/useTheme';
import useBlackjack from '@/composables/useBlackjack';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';

const { cardBack } = useTheme;
const { playerHand } = useBlackjack;
</script>

<template>
  <ActionButton
    variant="plain"
    class="text-base md:text-xl"
    :class="cardBack"
    :disabled="playerHand.length < 2"
  >
    Stand
  </ActionButton>
</template>
