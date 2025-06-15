<script setup lang="ts">
import { computed } from 'vue';
import { type StandardCard, SUIT_COLORS } from '@/types/cards';
import { CARD_BACKS, type CardSize, type CardBack } from '@/constants/cardStyles';
import BaseCard from './BaseCard.vue';
import CardSuit from './CardSuit.vue';
import CornerNumber from './CornerNumber.vue';

interface Props {
  card: StandardCard;
  isFaceUp?: boolean;
  isInteractive?: boolean;
  isSelected?: boolean;
  size?: CardSize;
  cardBack?: CardBack;
  showAnimation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isFaceUp: false,
  isInteractive: false,
  isSelected: false,
  size: 'md',
  cardBack: 'red',
  showAnimation: true,
});

const emit = defineEmits<{
  click: [card: StandardCard];
  select: [card: StandardCard];
}>();

// Card type detection
const cardValue = computed(() =>
  Array.isArray(props.card.value) ? props.card.value[0] : props.card.value,
);

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
  emit('select', card);
};
</script>

<template>
  <BaseCard
    :is-face-up="isFaceUp"
    :is-interactive="isInteractive"
    :is-selected="isSelected"
    :size="size"
    :show-flip-animation="showAnimation"
    :card="card"
    :custom-class="'card-3d'"
    @click="handleCardClick"
  >
    <template #front>
      <div class="bg-white w-full h-full p-2 relative card-face" :class="cardClasses">
        <!-- Corner numbers -->
        <CornerNumber :card="card" position="top-left" :size="size === 'sm' ? 'xs' : 'sm'" />
        <CornerNumber :card="card" position="bottom-right" :size="size === 'sm' ? 'xs' : 'sm'" />

        <!-- Card content -->
        <div class="absolute inset-4 flex items-center justify-center">
          <!-- Face cards -->
          <div v-if="isFaceCard" class="text-6xl text-jacquard-24 card-symbol">
            {{ card.text }}
          </div>

          <!-- Aces -->
          <CardSuit
            v-else-if="isAce"
            :suit="card.suit"
            :size="card.suit === 'spade' ? 'xl' : 'lg'"
            class="card-symbol"
          />

          <!-- Number cards -->
          <div v-else-if="isNumberCard" class="relative w-full h-full">
            <CardSuit
              v-for="(position, index) in getSuitPositions(cardValue)"
              :key="`suit-${index}`"
              :suit="card.suit"
              size="md"
              :class="['absolute card-symbol', position.class, { 'rotate-180': position.rotated }]"
            />
          </div>
        </div>
      </div>
    </template>

    <template #back>
      <div
        v-if="cardBack === 'uno'"
        class="w-full h-full relative rounded-lg shadow-lg overflow-hidden bg-black card-face"
      >
        <!-- Red Oval -->
        <div class="absolute inset-0 flex justify-center items-center">
          <div class="w-[75%] h-full rounded-[100%] bg-red-600 transform rotate-45 scale-110"></div>
        </div>

        <!-- UNO Text -->
        <div class="absolute inset-0 flex justify-center items-center">
          <span class="text-xl font-extrabold italic text-yellow-300 drop-shadow-lg">UNO</span>
        </div>
      </div>
      <div v-else class="w-full h-full card-face" :class="CARD_BACKS[cardBack]"></div>
    </template>
  </BaseCard>
</template>

<style scoped>
.card-3d {
  transform-style: preserve-3d;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25));
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-3d:hover {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.35));
}

.card-face {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.card-symbol {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* Enhanced flip animation */
.card-flip-enter-active,
.card-flip-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-flip-enter-from {
  transform: rotateY(-90deg) translateZ(-10px);
}

.card-flip-leave-to {
  transform: rotateY(90deg) translateZ(-10px);
}
</style>
