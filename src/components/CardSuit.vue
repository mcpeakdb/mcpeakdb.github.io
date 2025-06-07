<script setup lang="ts">
import { computed } from 'vue';
import { SUIT_ASCII, SUIT_COLORS, type Suit } from '@/types/cards';

interface Props {
  suit: Suit;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'auto' | 'red' | 'black' | 'blue' | 'green';
  customClass?: string;
  animate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  suit: 'diamond',
  size: 'md',
  color: 'auto',
  customClass: '',
  animate: false,
});

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
    '2xl': 'text-8xl',
  };
  return sizes[props.size];
});

const colorClasses = computed(() => {
  if (props.color === 'auto') {
    return SUIT_COLORS[props.suit] === 'red' ? 'text-red-500' : 'text-gray-800';
  }

  const colors = {
    red: 'text-red-500',
    black: 'text-gray-800',
    blue: 'text-blue-500',
    green: 'text-green-500',
  };

  return colors[props.color] || 'text-gray-800';
});

const animationClasses = computed(() => ({
  'animate-pulse': props.animate,
}));
</script>

<template>
  <span
    class="inline-flex items-center justify-center select-none"
    :class="[sizeClasses, colorClasses, animationClasses, customClass]"
    :aria-label="`${suit} suit`"
  >
    {{ SUIT_ASCII[suit] }}
  </span>
</template>
