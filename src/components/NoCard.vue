<script setup lang="ts">
import { computed } from 'vue';
import { CARD_SIZES, type CardSize } from '@/constants/cardStyles';

interface Props {
  size?: CardSize;
  variant?: 'dashed' | 'solid' | 'dotted';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'dashed',
});

const cardClasses = computed(() => {
  const sizeConfig = CARD_SIZES[props.size];
  const variants = {
    dashed: 'border-dashed border-2 border-gray-300',
    solid: 'border-solid border-2 border-gray-400',
    dotted: 'border-dotted border-2 border-gray-300',
  };

  return [
    'flex flex-col items-center justify-center text-center text-gray-500 rounded-lg',
    sizeConfig.width,
    sizeConfig.height,
    sizeConfig.text,
    variants[props.variant],
  ];
});
</script>

<template>
  <div :class="cardClasses">
    <slot></slot>
  </div>
</template>
