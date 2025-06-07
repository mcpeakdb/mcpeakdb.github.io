<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import useStandardDeck from '@/composables/useStandardDeck';
import { type CardSize, type CardBack } from '@/constants/cardStyles';
import { type StandardCard as StandardCardType } from '@/types/cards';
import StandardCard from './StandardCard.vue';
import NoCard from './NoCard.vue';

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
  'relative transition-transform hover:scale-105',
  'min-w-24 min-h-40 w-24 h-40',
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
    <div :class="deckClasses" @click="handleDeckClick">
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
            zIndex: index,
            transform: `translateY(-${index * 2}px)`,
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
.deck-card-enter-active {
  transition: all 0.5s ease-out;
}

.deck-card-leave-active {
  transition: all 0.4s ease-in;
}

.deck-card-enter-from {
  opacity: 0;
  transform: translateX(100px) rotate(-30deg) scale(0.8);
}

.deck-card-leave-to {
  opacity: 0;
  transform: translateX(-100vw) rotate(-30deg) scale(1.2);
}

.deck-empty.deck-card-enter-from,
.deck-empty.deck-card-leave-to {
  transform: none;
}

/* Smooth transition for opacity changes during animation */
.deck-card {
  transition: opacity 0.2s ease;
}
</style>
