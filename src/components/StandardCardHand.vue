<script setup lang="ts">
import { computed } from 'vue';
import { type StandardCard as StandardCardType } from '@/types/cards';
import { type CardSize } from '@/constants/cardStyles';
import StandardCard from './StandardCard.vue';
import NoCard from './NoCard.vue';

interface Props {
  hand: StandardCardType[];
  visible?: number;
  size?: CardSize;
  isInteractive?: boolean;
  allowSelection?: boolean;
  selectedCards?: string[];
  overlapDistance?: number;
  orientation?: 'horizontal' | 'vertical';
}

const props = withDefaults(defineProps<Props>(), {
  hand: () => [],
  visible: -1,
  size: 'md',
  isInteractive: false,
  allowSelection: false,
  selectedCards: () => [],
  overlapDistance: 60, // How much each card overlaps the previous one
  orientation: 'horizontal',
});

const emit = defineEmits<{
  cardClick: [card: StandardCardType, index: number];
  cardSelect: [card: StandardCardType, index: number];
  handClick: [];
}>();

const handClasses = computed(() => [
  'flex items-center transition-all duration-300',
  {
    'flex-row': props.orientation === 'horizontal',
    'flex-col': props.orientation === 'vertical',
    'cursor-pointer': props.isInteractive,
  },
]);

const getCardStyle = (index: number) => {
  return {
    zIndex: index,

    marginLeft:
      index > 0 && props.orientation === 'horizontal' ? `-${props.overlapDistance}px` : undefined,
    marginTop:
      index > 0 && props.orientation === 'vertical' ? `-${props.overlapDistance}px` : undefined,
  };
};

const isCardVisible = (index: number) => {
  return props.visible === -1 || index < props.visible;
};

const isCardSelected = (card: StandardCardType) => {
  return props.selectedCards.includes(card.id);
};

const handleCardClick = (card: StandardCardType, index: number) => {
  emit('cardClick', card, index);
  if (props.allowSelection) {
    emit('cardSelect', card, index);
  }
};

const handleHandClick = () => {
  emit('handClick');
};
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div v-if="hand.length > 0" :class="handClasses" @click="handleHandClick">
      <TransitionGroup name="hand-card" tag="div" class="flex">
        <StandardCard
          v-for="(card, index) in hand"
          :key="`hand-${card.id}`"
          :card="card"
          :size="size"
          :is-face-up="isCardVisible(index)"
          :is-interactive="isInteractive"
          :is-selected="isCardSelected(card)"
          :style="getCardStyle(index)"
          class="hand-card transition-transform duration-200 hover:-translate-y-2 hover:z-50"
          @click="() => handleCardClick(card, index)"
        />
      </TransitionGroup>
    </div>

    <NoCard v-else :size="size" message="No cards in hand" icon="✋"></NoCard>
  </div>
</template>

<style scoped>
.hand-card-enter-active,
.hand-card-leave-active {
  transition: all 0.5s ease;
}

.hand-card-enter-from {
  opacity: 0;
  transform: translateX(100vw) rotate(-30deg);
}

.hand-card-leave-to {
  opacity: 0;
  transform: translateY(-200px) rotate(360deg);
}

.hand-card:hover {
  z-index: 999 !important;
}
</style>
