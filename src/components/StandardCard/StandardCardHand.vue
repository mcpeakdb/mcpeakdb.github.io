<script setup lang="ts">
import { computed } from 'vue';
import { type StandardCard as StandardCardType } from '@/types/cards';
import { type CardBack, type CardSize } from '@/constants/cardStyles';
import StandardCard from './StandardCard.vue';
import NoCard from '../NoCard.vue';

interface Props {
  hand: StandardCardType[];
  visible?: number;
  size?: CardSize;
  cardBack: CardBack;
  allowSelection?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const props = withDefaults(defineProps<Props>(), {
  hand: () => [],
  visible: -1,
  size: 'md',
  cardBack: 'red',
  allowSelection: false,
  orientation: 'horizontal',
});

const emit = defineEmits<{
  cardClick: [card: StandardCardType, index: number];
  cardSelect: [card: StandardCardType, index: number];
  handClick: [];
}>();

const handClasses = computed(() => [
  'flex items-center transition-all duration-300 cursor-pointer',
  {
    'flex-row': props.orientation === 'horizontal',
    'flex-col': props.orientation === 'vertical',
  },
]);

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

const isCardVisible = (index: number) => {
  return props.visible === -1 || index < props.visible;
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
  <div>
    <div v-if="hand.length > 0" :class="handClasses" @click="handleHandClick">
      <TransitionGroup
        name="hand-card"
        tag="div"
        class="flex"
        style="transform-style: preserve-3d"
        enter-active-class="transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        leave-active-class="transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <StandardCard
          v-for="(card, index) in hand"
          :key="`hand-${card.id}`"
          :card="card"
          :size="size"
          :card-back="cardBack"
          :is-face-up="isCardVisible(index)"
          :style="{
            ...getCardStyle(index),
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
            transformStyle: 'preserve-3d',
          }"
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
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hand-card-enter-from {
  opacity: 0;
  transform: translateX(100vw) rotateY(-90deg);
}

.hand-card-leave-to {
  opacity: 0;
  transform: translateY(-200px) rotateX(90deg);
}
</style>
