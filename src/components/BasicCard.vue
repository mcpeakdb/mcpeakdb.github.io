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
    class="w-36 h-60 flex text-center justify-center items-center rounded"
    :class="{ 'bg-red-500': !isFaceUp, 'border-1': isFaceUp }"
  >
    <span v-if="isFaceUp" class="h-full w-full"><slot></slot></span>
  </div>
</template>
