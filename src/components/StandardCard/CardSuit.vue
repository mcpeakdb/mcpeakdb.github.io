<script setup lang="ts">
import { SUIT_ASCII, type Suit } from './types';

defineProps({
  suit: {
    type: String as () => Suit,
    default: () => 'diamond',
  },
});
</script>

<template>
  <span class="flex basis-[50%] justify-center items-baseline text-3xl">
    {{ SUIT_ASCII[suit] }}
  </span>
</template>
