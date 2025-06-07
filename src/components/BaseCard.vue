<script setup lang="ts" generic="T extends BaseCard">
import { computed, ref, type StyleValue } from 'vue';
import { CARD_SIZES, CARD_ANIMATIONS, type CardSize } from '@/constants/cardStyles';
import type { BaseCard } from '@/types/cards';

interface Props {
  isFaceUp?: boolean;
  isInteractive?: boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
  size?: CardSize;
  customClass?: string;
  customStyle?: StyleValue;
  showFlipAnimation?: boolean;
  card?: T;
}

const props = withDefaults(defineProps<Props>(), {
  isFaceUp: false,
  isInteractive: false,
  isDisabled: false,
  isSelected: false,
  size: 'md',
  customClass: '',
  customStyle: undefined,
  showFlipAnimation: false,
  card: undefined,
});

const emit = defineEmits<{
  click: [card: T | undefined, event: MouseEvent | undefined];
  hover: [card: T | undefined, event: MouseEvent | undefined];
  select: [card: T | undefined];
}>();

const cardClasses = computed(() => {
  const sizeConfig = CARD_SIZES[props.size];

  return [
    // Base styles
    'flex items-center justify-center rounded-lg overflow-hidden select-none',
    sizeConfig.width,
    sizeConfig.height,

    // Interactive styles
    {
      [CARD_ANIMATIONS.hover]: props.isInteractive && !props.isDisabled,
      [CARD_ANIMATIONS.flip]: props.showFlipAnimation,
      'cursor-pointer': props.isInteractive && !props.isDisabled,
      'cursor-not-allowed opacity-50': props.isDisabled,
      'ring-2 ring-blue-500': props.isSelected,
      'shadow-md': !props.isDisabled,
    },

    // Custom classes
    props.customClass,
  ];
});

const handleClick = (event: MouseEvent) => {
  if (props.isDisabled) return;

  emit('click', props.card, event);
  if (props.isInteractive) {
    emit('select', props.card);
  }
};

const handleMouseEnter = (event: MouseEvent) => {
  if (props.isDisabled) return;
  emit('hover', props.card, event);
};

const innerCardClasses = ref('w-full h-full border border-gray-800 rounded-lg overflow-hidden');
</script>

<template>
  <div
    :class="cardClasses"
    :style="customStyle"
    role="button"
    :tabindex="isInteractive && !isDisabled ? 0 : -1"
    :aria-disabled="isDisabled"
    :aria-selected="isSelected"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <Transition name="card-flip" mode="out-in">
      <div v-if="isFaceUp" key="front" :class="innerCardClasses">
        <slot name="front" :card="card"></slot>
      </div>
      <div v-else key="back" :class="innerCardClasses">
        <slot name="back" :card="card"></slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.card-flip-enter-active,
.card-flip-leave-active {
  transition: transform 0.3s ease;
}

.card-flip-enter-from {
  transform: rotateY(-90deg);
}

.card-flip-leave-to {
  transform: rotateY(90deg);
}
</style>
