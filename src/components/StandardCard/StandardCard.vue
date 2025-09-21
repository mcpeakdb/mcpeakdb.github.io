<script setup lang="ts">
import { computed } from 'vue';
import { type StandardCard, SUIT_COLORS } from '@/types/cards';
import { type CardSize } from '@/constants/cardStyles';
import BaseCard from '../BaseCard.vue';
import CardSuit from './CardSuit.vue';
import CornerNumber from './CornerNumber.vue';

const props = defineProps({
  card: {
    type: Object as () => StandardCard,
    required: true,
  },
  isFaceUp: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as () => CardSize,
    default: 'md',
  },
  showAnimation: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (e: 'click', id: StandardCard): void;
  (e: 'select', value: StandardCard): void;
}>();

// Card type detection
const noOfSuitSymbols = computed(() => props.card.values[0]);

const isFaceCard = computed(() => ['J', 'Q', 'K'].includes(props.card.text));
const isAce = computed(() => props.card.text === 'A');
const isNumberCard = computed(() => !isFaceCard.value && !isAce.value);

// Styling
const suitColor = computed(() => SUIT_COLORS[props.card.suit]);
const cardClasses = computed(() => ({
  'text-red-500': suitColor.value === 'red',
  'text-gray-800': suitColor.value === 'black',
}));

// Card layout for number cards
const getSuitPositions = (value: number) => {
  const layouts: Record<number, Array<{ class: string; rotated?: boolean }>> = {
    2: [
      { class: 'top-2 left-1/2 -translate-x-1/2' },
      { class: 'bottom-2 left-1/2 -translate-x-1/2', rotated: true },
    ],
    3: [
      { class: 'top-2 left-1/2 -translate-x-1/2' },
      { class: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },
      { class: 'bottom-2 left-1/2 -translate-x-1/2', rotated: true },
    ],
    4: [
      { class: 'top-2 left-2' },
      { class: 'top-2 right-2' },
      { class: 'bottom-2 left-2', rotated: true },
      { class: 'bottom-2 right-2', rotated: true },
    ],
    5: [
      { class: 'top-2 left-2' },
      { class: 'top-2 right-2' },
      { class: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },
      { class: 'bottom-2 left-2', rotated: true },
      { class: 'bottom-2 right-2', rotated: true },
    ],
    6: [
      { class: 'top-2 left-2' },
      { class: 'top-2 right-2' },

      { class: 'top-1/2 left-2 -translate-y-1/2' },
      { class: 'top-1/2 right-2 -translate-y-1/2' },
      { class: 'bottom-2 left-2', rotated: true },
      { class: 'bottom-2 right-2', rotated: true },
    ],
    7: [
      { class: 'top-2 left-2' },
      { class: 'top-2 right-2' },

      { class: 'top-[20%] left-1/2 -translate-x-1/2' },
      { class: 'top-[45%] left-2 -translate-y-1/2' },
      { class: 'top-[45%] right-2 -translate-y-1/2' },
      { class: 'bottom-2 left-2', rotated: true },
      { class: 'bottom-2 right-2', rotated: true },
    ],
    8: [
      { class: 'top-2 left-2' },
      { class: 'top-2 right-2' },

      { class: 'top-[20%] left-1/2 -translate-x-1/2' },
      { class: 'top-[45%] left-2 -translate-y-1/2' },
      { class: 'top-[45%] right-2 -translate-y-1/2' },
      { class: 'bottom-[22.5%] left-1/2 -translate-x-1/2', rotated: true },
      { class: 'bottom-2 left-2', rotated: true },
      { class: 'bottom-2 right-2', rotated: true },
    ],
    9: [
      { class: 'top-2 left-2' },
      { class: 'top-2 right-2' },

      { class: 'top-[25%] left-2' },
      { class: 'top-[25%] right-2' },
      { class: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },

      { class: 'bottom-[25%] left-2', rotated: true },
      { class: 'bottom-[25%] right-2', rotated: true },
      { class: 'bottom-2 left-2', rotated: true },
      { class: 'bottom-2 right-2', rotated: true },
    ],
    10: [
      { class: 'top-2 left-2' },
      { class: 'top-2 right-2' },

      { class: 'top-[15%] left-1/2 -translate-x-1/2' },
      { class: 'top-[25%] left-2' },
      { class: 'top-[25%] right-2' },
      { class: 'bottom-[25%] left-2', rotated: true },
      { class: 'bottom-[25%] right-2', rotated: true },
      { class: 'bottom-[15%] left-1/2 -translate-x-1/2', rotated: true },
      { class: 'bottom-2 left-2', rotated: true },
      { class: 'bottom-2 right-2', rotated: true },
    ],
  };

  return layouts[value] || [];
};

const handleCardClick = (card: StandardCard | undefined) => {
  if (!card) return;
  emit('click', card);
};
</script>

<template>
  <BaseCard
    :is-face-up="isFaceUp"
    :size="size"
    :show-flip-animation="showAnimation"
    :card="card"
    @click="handleCardClick(card)"
  >
    <template #front>
      <div
        class="bg-white w-full h-full p-2 relative transform-3d backface-hidden"
        :class="cardClasses"
      >
        <!-- Corner numbers -->
        <CornerNumber :card="card" position="top-left" :size="size" />
        <CornerNumber :card="card" position="bottom-right" :size="size" />

        <!-- Card content -->
        <div class="absolute inset-4 flex items-center justify-center">
          <!-- Face cards -->
          <div v-if="isFaceCard" class="text-6xl text-jacquard-24">
            {{ card.text }}
          </div>

          <!-- Aces -->
          <CardSuit
            v-else-if="isAce"
            :suit="card.suit"
            :size="card.suit === 'spade' ? 'xl' : 'lg'"
          />

          <!-- Number cards -->
          <div
            v-else-if="isNumberCard"
            class="relative w-full h-full flex items-center justify-center"
          >
            <div v-if="size === 'sm' || size === 'xs'">
              <span class="text-2xl font-bold">{{ card.text }}</span>
            </div>
            <div v-else>
              <CardSuit
                v-for="(position, index) in getSuitPositions(noOfSuitSymbols)"
                :key="`suit-${index}`"
                :suit="card.suit"
                :size="size"
                :class="['absolute', position.class, { 'rotate-180': position.rotated }]"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseCard>
</template>
