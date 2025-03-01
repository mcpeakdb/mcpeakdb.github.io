<script setup lang="ts">
import { SUIT_ASCII, type Suit } from './types';

defineProps({
  suit: {
    type: String as () => Suit,
    default: () => 'diamond',
  },
  textClass: {
    type: String,
    default: 'text-4xl',
    required: false,
  },
});
</script>

<template>
  <span class="flex basis-[50%] justify-center items-center" :class="textClass">
    {{ SUIT_ASCII[suit] }}
  </span>
</template>
