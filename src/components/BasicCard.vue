<script lang="ts" setup>
defineProps({
  isFaceUp: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div
    class="min-w-24 min-h-40 w-24 h-40 flex text-center justify-center items-center rounded border-1"
  >
    <slot v-if="isFaceUp" name="front"></slot>
    <slot v-else name="back"></slot>
  </div>
</template>
