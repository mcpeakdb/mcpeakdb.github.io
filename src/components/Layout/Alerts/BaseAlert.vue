<script setup lang="ts">
import { computed } from 'vue';

const VARIANTS = {
  neutral: 'bg-black text-yellow-200 shadow-yellow-200/50',
  danger: 'bg-red-900 text-red-200 shadow-red-200/50',
  success: 'bg-green-900 text-green-200 shadow-green-200/50',
  info: 'bg-blue-900 text-blue-200 shadow-blue-200/50',
  warning: 'bg-yellow-900 text-yellow-200 shadow-yellow-200/50',
};
const props = defineProps({
  variant: {
    type: String as () => keyof typeof VARIANTS,
    default: () => 'neutral',
  },
  animated: {
    type: Boolean,
    default: true,
  },
});

const classes = computed(() => {
  const baseClasses = VARIANTS[props.variant];
  const animationClasses = props.animated ? 'animate-bounce animate-shake' : '';
  return `${baseClasses} ${animationClasses}`;
});
</script>

<template>
  <div class="rounded p-2 text-3xl md:text-4xl font-extrabold shadow-lg" :class="classes">
    <slot></slot>
  </div>
</template>
