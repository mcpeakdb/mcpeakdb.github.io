<script setup lang="ts">
import { SUIT_ASCII, type StandardCard as Card } from './types';

defineProps({
  card: {
    type: Object as () => Card,
    default: () => {
      return {
        id: 0,
        value: 2,
        text: '2',
        suit: 'diamond',
      };
    },
  },
});
</script>

<template>
  <div class="flex flex-col text-center w-fit leading-[0.8] absolute p-1 text-xl">
    <div class="text-lg leading-[0.8] tracking-[-.15em] -ms-1">
      {{ card.text }}
    </div>
    {{ SUIT_ASCII[card.suit] }}
  </div>
</template>
