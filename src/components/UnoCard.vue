<script setup lang="ts">
import { computed } from 'vue';
import type { UnoCard as UnoCardType } from '@/composables/useUno';
import { CARD_BACKS } from '@/constants/cardStyles';

interface Props {
  card?: UnoCardType;
  cardBack?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isVisible?: boolean;
  isInteractive?: boolean;
  isHighlighted?: boolean;
  showDeckText?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cardBack: 'classic',
  size: 'md',
  isVisible: true,
  isInteractive: false,
  isHighlighted: false,
  showDeckText: false,
});

const emit = defineEmits<{
  click: [];
}>();

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-8 h-12 text-xs';
    case 'sm':
      return 'w-12 h-16 text-xs';
    case 'lg':
      return 'w-24 h-32 text-lg';
    case 'xl':
      return 'w-32 h-44 text-xl';
    default:
      return 'w-16 h-24 text-sm';
  }
});

const textSizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return { center: 'text-xs', corner: 'text-xs' };
    case 'sm':
      return { center: 'text-xs', corner: 'text-xs' };
    case 'lg':
      return { center: 'text-2xl', corner: 'text-sm' };
    case 'xl':
      return { center: 'text-3xl', corner: 'text-base' };
    default:
      return { center: 'text-base', corner: 'text-xs' };
  }
});

const cardBackClasses = computed(() => {
  return CARD_BACKS[props.cardBack as keyof typeof CARD_BACKS];
});

const cardClasses = computed(() => {
  if (!props.card) return cardBackClasses.value;

  const classes = {
    red: 'bg-uno-red',
    green: 'bg-uno-green',
    blue: 'bg-uno-blue',
    yellow: 'bg-uno-yellow',
    wild: 'bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500',
  };

  return classes[props.card.suit];
});

const getCardDisplayText = (card: UnoCardType): string => {
  switch (card.action) {
    case 'skip':
      return '⊘';
    case 'reverse':
      return '⟲';
    case 'draw2':
      return '+2';
    case 'wild':
      return 'W';
    case 'wild-draw4':
      return '+4';
    default:
      return card.text;
  }
};

const handleClick = () => {
  if (props.isInteractive) {
    emit('click');
  }
};
</script>

<template>
  <div
    :class="[
      sizeClasses,
      'border-2 border-white rounded-lg flex items-center justify-center font-bold transition-all duration-200 shadow-md select-none',
      isInteractive ? 'cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95' : '',
      isInteractive && isVisible ? 'hover:-translate-y-2' : '',
      isHighlighted ? 'ring-4 ring-yellow-400 ring-opacity-75' : '',
      !isVisible ? cardBackClasses : cardClasses,
      !isInteractive && isVisible ? 'opacity-90' : '',
    ]"
    class="relative text-white"
    @click="handleClick"
  >
    <!-- Card Back -->
    <div
      v-if="!isVisible"
      class="w-full h-full text-center font-bold flex items-center justify-center"
    >
      <div
        v-if="cardBack === 'uno'"
        class="w-full h-full relative rounded-lg shadow-lg overflow-hidden bg-black"
      >
        <!-- Red Oval -->
        <div class="absolute inset-0 flex justify-center items-center">
          <div class="w-[75%] h-full rounded-[100%] bg-red-600 transform rotate-45 scale-110"></div>
        </div>

        <!-- UNO Text (replace with image or logo if needed) -->
        <div class="absolute inset-0 flex justify-center items-center">
          <span class="text-xl font-extrabold italic text-yellow-300 drop-shadow-lg">UNO</span>
        </div>
      </div>
      <div v-else-if="showDeckText">
        <div class="font-bold">UNO</div>
        <div class="text-xs opacity-75 mt-1">DECK</div>
      </div>
      <div v-else class="font-bold">UNO</div>
    </div>

    <!-- Card Front -->
    <div v-else-if="card" class="relative h-full w-full">
      <!-- Top-left corner -->
      <div
        :class="textSizeClasses.corner"
        class="absolute left-0 top-0 font-bold ml-0.5 mt-0.5"
        style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8)"
      >
        {{ getCardDisplayText(card) }}
      </div>

      <!-- Center -->
      <div
        :class="textSizeClasses.center"
        class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold"
        style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8)"
      >
        {{ getCardDisplayText(card) }}
      </div>

      <!-- Bottom-right corner (rotated) -->
      <div
        :class="textSizeClasses.corner"
        class="absolute right-0 bottom-0 font-bold mr-0.5 mb-0.5 rotate-180"
        style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8)"
      >
        {{ getCardDisplayText(card) }}
      </div>

      <!-- Action card indicator -->
      <div
        v-if="card.isActionCard && !card.isWild"
        class="absolute top-0 right-0 w-2 h-2 bg-white rounded-full opacity-60 mr-1 mt-1"
      ></div>

      <!-- Wild card indicator -->
      <div
        v-if="card.isWild"
        class="absolute top-0 left-0 w-0 h-0 border-l-4 border-t-4 border-l-transparent border-t-white opacity-75"
      ></div>
    </div>
  </div>
</template>
