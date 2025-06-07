<script setup lang="ts">
import { computed } from 'vue';
import useStandardDeck from '@/composables/useStandardDeck';
import { type CardSize } from '@/constants/cardStyles';
import { type StandardCard as StandardCardType } from '@/types/cards';
import StandardCard from './StandardCard.vue';
import NoCard from './NoCard.vue';

interface Props {
  size?: CardSize;
  isInteractive?: boolean;
  showCount?: boolean;
  maxVisible?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  isInteractive: false,
  showCount: false,
  maxVisible: 3,
});

const emit = defineEmits<{
  cardClick: [card: StandardCardType];
  pileClick: [];
}>();

const standardDeck = useStandardDeck;

const visibleDiscardCards = computed(() =>
  standardDeck.discardPile.value.slice(
    -Math.min(props.maxVisible, standardDeck.discardPile.value.length),
  ),
);

const handlePileClick = () => {
  emit('pileClick');
};
const handleCardClick = (card: StandardCardType) => {
  emit('cardClick', card);
};
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="relative" @click="handlePileClick">
      <TransitionGroup name="discard-card" tag="div" class="relative">
        <NoCard
          v-if="!standardDeck.topOfDiscardPile.value"
          :key="'empty-discard'"
          :size="size"
          message="Discard pile"
          icon="🗑️"
        ></NoCard>

        <StandardCard
          v-for="(card, index) in visibleDiscardCards"
          :key="`discard-${card.id}`"
          :card="card"
          :size="size"
          :is-face-up="true"
          :is-interactive="isInteractive"
          :style="{ zIndex: index, transform: `rotate(${index * 5}deg)` }"
          class="absolute discard-card"
          @click="handleCardClick"
        />
      </TransitionGroup>
    </div>

    <div v-if="showCount" class="text-sm text-gray-600 font-medium">
      {{ standardDeck.discardPile.value.length }} discarded
    </div>
  </div>
</template>

<style scoped>
.discard-card-enter-active,
.discard-card-leave-active {
  transition: all 0.3s ease;
}

.discard-card-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-45deg);
}

.discard-card-leave-to {
  opacity: 0;
  transform: scale(1.2) rotate(45deg);
}
</style>
