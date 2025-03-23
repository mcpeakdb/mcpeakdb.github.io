<script lang="ts" setup>
const UNO_SYMBOLS = {
  draw2: '⧉',
  refresh: '🗘',
  skip: '🛇',
};

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
