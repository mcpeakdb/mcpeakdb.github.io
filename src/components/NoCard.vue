<script setup lang="ts">
import { computed } from 'vue';
import { CARD_SIZES, type CardSize } from '@/constants/cardStyles';

interface Props {
  size?: CardSize;
  variant?: 'dashed' | 'solid' | 'dotted';
  message?: string;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'dashed',
  message: 'No cards',
  icon: '🃏',
});

const cardClasses = computed(() => {
  const sizeConfig = CARD_SIZES[props.size];
  const variants = {
    dashed: 'border-dashed border-2 border-gray-300',
    solid: 'border-solid border-2 border-gray-400',
    dotted: 'border-dotted border-2 border-gray-300',
  };

  return [
    'flex flex-col items-center justify-center text-center text-gray-500 rounded-lg bg-gray-50',
    sizeConfig.width,
    sizeConfig.height,
    sizeConfig.text,
    variants[props.variant],
  ];
});
</script>

<template>
  <div :class="cardClasses">
    <div class="text-2xl mb-1">{{ icon }}</div>
    <div class="text-xs">{{ message }}</div>
    <slot></slot>
  </div>
</template>
