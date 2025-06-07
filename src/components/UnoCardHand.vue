<script setup lang="ts">
import { computed } from 'vue';
import type { UnoCard } from '@/composables/useUno';

interface Props {
  hand: UnoCard[];
  cardBack?: string;
  visible?: number; // -1 = all visible, 0 = all hidden, positive number = show that many
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  isInteractive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cardBack: 'classic',
  visible: -1,
  size: 'md',
  orientation: 'horizontal',
  isInteractive: true,
});

const emit = defineEmits<{
  cardClicked: [cardIndex: number];
}>();

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-12 h-16 text-xs';
    case 'lg':
      return 'w-24 h-32 text-lg';
    default:
      return 'w-16 h-24 text-sm';
  }
});

const cardBackClasses = computed(() => {
  switch (props.cardBack) {
    case 'blue':
      return 'bg-blue-600';
    case 'red':
      return 'bg-red-600';
    default:
      return 'bg-gray-800';
  }
});

const cardClasses = {
  red: 'bg-uno-red',
  green: 'bg-uno-green',
  blue: 'bg-uno-blue',
  yellow: 'bg-uno-yellow',
  wild: 'bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500',
};

const isCardVisible = (index: number): boolean => {
  if (props.visible === -1) return true;
  if (props.visible === 0) return false;
  return index < props.visible;
};

const handleCardClick = (index: number) => {
  if (props.isInteractive && isCardVisible(index)) {
    emit('cardClicked', index);
  }
};
</script>

<template>
  <div
    :class="[
      'flex gap-1',
      orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap justify-center',
    ]"
  >
    <div
      v-for="(card, index) in hand"
      :key="card.id"
      :class="[
        sizeClasses,
        'border-2 border-white rounded-lg flex items-center justify-center font-bold transition-all duration-200',
        isInteractive && isCardVisible(index)
          ? 'cursor-pointer hover:scale-105 hover:-translate-y-2'
          : '',
        !isCardVisible(index) ? cardBackClasses : cardClasses[card.suit],
      ]"
      class="relative text-white"
      @click="handleCardClick(index)"
    >
      <!-- Card Back -->
      <div v-if="!isCardVisible(index)" class="text-center">UNO</div>

      <!-- Card Front -->
      <div v-else class="relative h-full w-full">
        <!-- Top-left corner -->
        <div
          class="absolute left-0 top-0 text-xs font-bold ml-0.5 mt-0.5"
          style="-webkit-text-stroke: 0.5px black"
        >
          <span v-if="card.value === 12">+2</span>
          <span v-else-if="card.value === 14">+4</span>
          <span v-else>{{ card.text }}</span>
        </div>

        <!-- Center -->
        <div
          class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold"
          :class="size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-base'"
          style="-webkit-text-stroke: 1px black"
        >
          <span v-if="card.value === 12">+2</span>
          <span v-else-if="card.value === 14">+4</span>
          <span v-else>{{ card.text }}</span>
        </div>

        <!-- Bottom-right corner (rotated) -->
        <div
          class="absolute right-0 bottom-0 text-xs font-bold mr-0.5 mb-0.5 rotate-180"
          style="-webkit-text-stroke: 0.5px black"
        >
          <span v-if="card.value === 12">+2</span>
          <span v-else-if="card.value === 14">+4</span>
          <span v-else>{{ card.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
