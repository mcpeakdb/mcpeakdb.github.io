<script setup lang="ts">
import { computed } from 'vue';

const VARIANTS = {
  neutral: 'text-white',
  danger: 'bg-red-900 text-white',
};

const props = defineProps({
  variant: {
    type: String as () => keyof typeof VARIANTS,
    default: () => 'neutral',
  },
});

const classes = computed(() => {
  return VARIANTS[props.variant];
});
</script>

<template>
  <div class="text-white rounded p-2 underline animate-bounce" :class="classes">
    <slot></slot>
  </div>
</template>
