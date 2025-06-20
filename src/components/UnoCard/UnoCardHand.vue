<script setup lang="ts">
import type { UnoCard } from '@/composables/useUno';
import UnoCardComponent from './UnoCard.vue';

interface Props {
  hand: UnoCard[];
  cardBack?: string;
  visible?: number; // -1 = all visible, 0 = all hidden, positive number = show that many
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation?: 'horizontal' | 'vertical';
  isInteractive?: boolean;
  highlightedCardIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cardBack: 'classic',
  visible: -1,
  size: 'md',
  orientation: 'horizontal',
  isInteractive: true,
  highlightedCardIndex: -1,
});

const emit = defineEmits<{
  cardClicked: [cardIndex: number];
}>();

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

const getCardStyle = (index: number) => {
  return {
    zIndex: index + 10,

    marginLeft:
      index > 0 && props.orientation === 'horizontal'
        ? `-${props.size === 'sm' || props.size === 'xs' ? 40 : 60}px`
        : undefined,
    marginTop:
      index > 0 && props.orientation === 'vertical'
        ? `-${props.size === 'sm' || props.size === 'xs' ? 40 : 60}px`
        : undefined,
  };
};
</script>

<template>
  <div
    :class="[
      'flex gap-1',
      orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap justify-center',
    ]"
  >
    <UnoCardComponent
      v-for="(card, index) in hand"
      :key="card.id"
      :card="card"
      :card-back="cardBack"
      :size="size"
      :style="getCardStyle(index)"
      :is-visible="isCardVisible(index)"
      :is-interactive="isInteractive && isCardVisible(index)"
      :is-highlighted="highlightedCardIndex === index"
      @click="handleCardClick(index)"
    />
  </div>
</template>
