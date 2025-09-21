<script setup lang="ts">
import useTheme from '@/composables/useTheme';
import useBlackjack from '@/composables/useBlackjack';
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';

const { cardBack } = useTheme;
const { playerHandTotal } = useBlackjack;
</script>

<template>
  <ActionButton
    variant="plain"
    class="text-base md:text-xl"
    :class="cardBack"
    :disabled="playerHandTotal > 21"
  >
    Hit
  </ActionButton>
</template>
