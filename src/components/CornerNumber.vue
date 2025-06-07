<script setup lang="ts">
import { computed } from 'vue';
import { SUIT_COLORS, type StandardCard } from '@/types/cards';
import CardSuit from './CardSuit.vue';

interface Props {
  card: StandardCard;
  position?: 'top-left' | 'bottom-right';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showSuit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-left',
  size: 'sm',
  showSuit: true,
});

const positionClasses = computed(() => {
  const positions = {
    'top-left': 'top-1 left-1',
    'bottom-right': 'bottom-1 right-1 rotate-180',
  };
  return positions[props.position];
});

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  return sizes[props.size];
});

const suitSize = computed(() => {
  const suitSizes = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  } as const;
  return suitSizes[props.size];
});

const colorClasses = computed(() => ({
  'text-red-500': SUIT_COLORS[props.card.suit] === 'red',
  'text-gray-800': SUIT_COLORS[props.card.suit] === 'black',
}));
</script>

<template>
  <div
    class="absolute flex flex-col items-center leading-tight font-medium"
    :class="[positionClasses, sizeClasses, colorClasses]"
  >
    <div class="font-bold">
      {{ card.text }}
    </div>
    <CardSuit v-if="showSuit" :suit="card.suit" :size="suitSize" class="mt-0.5" />
  </div>
</template>
