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
    :class="{ 'bg-red-500': !isFaceUp, 'bg-white': isFaceUp }"
  >
    <span v-if="isFaceUp" class="h-full w-full"><slot></slot></span>
  </div>
</template>
