<script lang="ts" setup>
import { UNO_SYMBOLS } from './constants';

defineProps({
  symbol: {
    type: String as () => keyof typeof UNO_SYMBOLS,
    default: () => 'draw2',
  },
});
</script>

<template>
  <div>{{ UNO_SYMBOLS[symbol] }}</div>
</template>
