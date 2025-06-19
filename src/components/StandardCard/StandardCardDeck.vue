<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import useStandardDeck from '@/composables/useStandardDeck';
import { type CardSize, type CardBack } from '@/constants/cardStyles';
import { type StandardCard as StandardCardType } from '@/types/cards';
import StandardCard from './StandardCard.vue';
import NoCard from '../NoCard.vue';

interface Props {
  size?: CardSize;
  cardBack?: CardBack;
  isInteractive?: boolean;
  showCount?: boolean;
  maxVisible?: number;
  animationDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  cardBack: 'red',
  isInteractive: false,
  showCount: false,
  maxVisible: 5,
  animationDelay: 150,
});

const emit = defineEmits<{
  cardClick: [card: StandardCardType];
  deckClick: [];
}>();

// Use the shared instance
const standardDeck = useStandardDeck;

// This should always reflect the actual top cards from the deck
const visibleCards = computed(() => {
  const deckLength = standardDeck.cardDeck.value.length;
  if (deckLength === 0) return [];

  const numToShow = Math.min(props.maxVisible, deckLength);
  return standardDeck.cardDeck.value.slice(-numToShow);
});

const isAnimating = ref(false);
const previousDeckLength = ref(0);

// Watch for deck changes to trigger animations
watch(
  () => standardDeck.cardDeck.value.length,
  async (newLength, oldLength) => {
    if (oldLength === undefined) {
      previousDeckLength.value = newLength;
      return;
    }

    // If deck size decreased (cards were dealt), animate the removal
    if (newLength < oldLength && newLength >= 0) {
      isAnimating.value = true;
      await new Promise((resolve) => setTimeout(resolve, props.animationDelay));
      isAnimating.value = false;
    }

    // If deck size increased (deck was built/refilled), animate the addition
    if (newLength > oldLength) {
      isAnimating.value = true;
      // Stagger the animation for multiple cards
      const cardsAdded = newLength - oldLength;
      const delayPerCard = Math.min(props.animationDelay, 100); // Cap delay for many cards
      await new Promise((resolve) => setTimeout(resolve, delayPerCard * Math.min(cardsAdded, 5)));
      isAnimating.value = false;
    }

    previousDeckLength.value = newLength;
  },
);

const deckClasses = computed(() => [
  'relative transition-all duration-300 hover:scale-105',
  'min-w-24 min-h-40 w-24 h-40',
  'deck-3d',
  {
    'cursor-pointer': visibleCards.value.length > 0 && props.isInteractive && !isAnimating.value,
    'cursor-not-allowed opacity-50': visibleCards.value.length === 0,
  },
]);

const handleDeckClick = () => {
  if (visibleCards.value.length > 0 && !isAnimating.value) {
    emit('deckClick');
  }
};

const handleCardClick = (card: StandardCardType) => {
  if (!isAnimating.value) {
    emit('cardClick', card);
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div :class="deckClasses" style="transform-style: preserve-3d" @click="handleDeckClick">
      <TransitionGroup name="deck-card" tag="div" class="relative w-full h-full">
        <NoCard
          v-if="visibleCards.length === 0"
          :key="'empty'"
          :size="size"
          message="Deck empty"
          class="deck-empty absolute inset-0"
        ></NoCard>
        <StandardCard
          v-for="(card, index) in visibleCards"
          :key="`deck-${card.id}`"
          :card="card"
          :size="size"
          :card-back="cardBack"
          :is-interactive="isInteractive && !isAnimating"
          :style="{
            zIndex: index + 1,
            transform: `translateY(-${index * 3}px) translateZ(${index * 4}px) rotateX(-2deg)`,
            opacity: isAnimating ? 0.8 : 1,
          }"
          class="absolute inset-0 deck-card"
          @click="handleCardClick"
        />
      </TransitionGroup>
    </div>

    <div v-if="showCount" class="text-sm text-gray-600 font-medium">
      {{ standardDeck.cardDeck.value.length }} cards
      <span v-if="isAnimating" class="text-blue-500 ml-1">⟳</span>
    </div>
  </div>
</template>

<style scoped>
.deck-3d {
  transform-style: preserve-3d;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4));
}

.deck-3d:hover {
  filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5));
  transform: translateZ(10px) rotateX(-5deg);
}

.deck-card {
  transform-style: preserve-3d;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.deck-card-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.deck-card-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.deck-card-enter-from {
  opacity: 0;
  transform: translateX(100px) rotateY(-45deg) translateZ(-30px) scale(0.8);
}

.deck-card-leave-to {
  opacity: 0;
  transform: translateX(-100vw) rotateY(-45deg) translateZ(50px) scale(1.2);
}

.deck-empty.deck-card-enter-from,
.deck-empty.deck-card-leave-to {
  transform: none;
}
</style>
