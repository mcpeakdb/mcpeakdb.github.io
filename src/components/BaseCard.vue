<script setup lang="ts" generic="T extends BaseCard">
import { computed, ref, type StyleValue } from 'vue';
import {
  CARD_SIZES,
  CARD_ANIMATIONS,
  CARD_BACKS,
  type CardBack,
  type CardSize,
} from '@/constants/cardStyles';
import type { BaseCard } from '@/types/cards';

interface Props {
  back?: CardBack;
  isFaceUp?: boolean;
  isSelected?: boolean;
  size?: CardSize;
  customClass?: string;
  customStyle?: StyleValue;
  showFlipAnimation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  back: 'red',
  isFaceUp: false,
  isSelected: false,
  size: 'md',
  customClass: '',
  customStyle: undefined,
  showFlipAnimation: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent | undefined];
  hover: [event: MouseEvent | undefined];
}>();

const cardClasses = computed(() => {
  const sizeConfig = CARD_SIZES[props.size];

  return [
    // Base styles
    'flex items-center justify-center rounded-lg overflow-hidden transform transition-all duration-300 ease-cubic-bezier[0.25,0.46,0.45,0.94] cursor-pointer',
    sizeConfig.width,
    sizeConfig.height,

    // Interactive styles
    {
      [CARD_ANIMATIONS.flip]: props.showFlipAnimation,
      'ring-2 ring-blue-500': props.isSelected,
    },

    // Custom classes
    props.customClass,
  ];
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

const handleMouseEnter = (event: MouseEvent) => {
  emit('hover', event);
};

const innerCardClasses = ref(
  'w-full h-full border border-gray-800 rounded-lg overflow-hidden absolute inset-0 transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ' +
    CARD_BACKS[props.back],
);
</script>

<template>
  <div
    :class="cardClasses"
    :style="customStyle"
    role="button"
    :aria-selected="isSelected"
    style="perspective: 1000px"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <div class="relative w-full h-full" style="transform-style: preserve-3d">
      <div
        :class="innerCardClasses"
        :style="{
          transform: isFaceUp ? 'rotateY(0deg)' : 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
        }"
      >
        <slot name="front"></slot>
      </div>
      <div
        :class="innerCardClasses"
        :style="{
          transform: isFaceUp ? 'rotateY(-180deg)' : 'rotateY(0deg)',
          backfaceVisibility: 'hidden',
        }"
      ></div>
    </div>
  </div>
</template>
