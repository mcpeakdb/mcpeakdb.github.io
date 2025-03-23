<script lang="ts" setup>
import { type StandardCard as Card } from './types';
import CardSuit from './CardSuit.vue';
import BasicCard from '../BasicCard.vue';
import CornerNumber from './CornerNumber.vue';
import { CARD_BACKS } from './constants';
import useStandardDeck from '@/composables/useStandardDeck';

defineProps({
  card: {
    type: Object as () => Card,
    default: () => {
      return {
        id: 0,
        text: '',
        value: 0,
        suit: 'heart',
      };
    },

    required: false,
  },
  isFaceUp: {
    type: Boolean,
    default: false,
  },
});

const { cardBack } = useStandardDeck;

function isFaceCard(Card: Card): boolean {
  return isNaN(parseInt(Card.text)) && Card.text !== 'A';
}

function isAce(Card: Card): boolean {
  return Card.text === 'A';
}

function greaterThanX(Card: Card, x = 0): boolean {
  if (typeof Card.value === 'number') {
    return Card.value > x;
  }

  return true;
}

function isCard(Card: Card, x = 0): boolean {
  if (typeof Card.value === 'number') {
    return Card.value === x;
  }

  return Card.value.includes(x);
}
</script>

<template>
  <BasicCard :value="card.value" :is-face-up="isFaceUp">
    <template #front>
      <div
        class="bg-white flex justify-center align-center h-full w-full p-1 relative"
        :class="{ 'text-red-500': ['heart', 'diamond'].includes(card.suit) }"
      >
        <CornerNumber :card="card" class="top-0 left-0" />

        <span
          v-if="isFaceCard(card)"
          class="flex flex-col justify-center items-center h-full w-full flex-wrap gap-1 text-7xl text-jacquard-24"
        >
          {{ card.text }}
        </span>
        <span
          v-else-if="isAce(card)"
          class="flex justify-center items-center h-full w-full text-6xl"
          :class="{ 'text-8xl': card.suit === 'spade' }"
        >
          <CardSuit
            :suit="card.suit"
            :text-class="card.suit === 'spade' ? 'text-8xl' : 'text-6xl'"
          />
        </span>
        <span v-else class="h-full w-full relative">
          <CardSuit
            v-if="greaterThanX(card, 3)"
            :suit="card.suit"
            class="absolute top-0 left-[17%]"
          />
          <CardSuit
            v-if="isCard(card, 2) || isCard(card, 3)"
            :suit="card.suit"
            class="absolute top-0 left-[50%] right-[50%]"
          />
          <CardSuit
            v-if="greaterThanX(card, 3)"
            :suit="card.suit"
            class="absolute top-0 right-[17%]"
          />

          <CardSuit
            v-if="isCard(card, 10)"
            :suit="card.suit"
            class="absolute top-[26%] bottom-[74%] left-[50%] right-[50%]"
          />

          <CardSuit
            v-if="isCard(card, 7) || isCard(card, 8)"
            :suit="card.suit"
            class="absolute top-[31%] bottom-[69%] left-[50%] right-[50%]"
          />

          <CardSuit
            v-if="greaterThanX(card, 8)"
            :suit="card.suit"
            class="absolute top-[38%] bottom-[62%] left-[17%]"
          />
          <CardSuit
            v-if="greaterThanX(card, 8)"
            :suit="card.suit"
            class="absolute top-[38%] bottom-[62%] right-[17%]"
          />

          <CardSuit
            v-if="isCard(card, 6) || isCard(card, 7) || isCard(card, 8)"
            :suit="card.suit"
            class="absolute top-[50%] bottom-[50%] left-[17%]"
          />
          <CardSuit
            v-if="isCard(card, 3) || isCard(card, 5) || isCard(card, 9)"
            :suit="card.suit"
            class="absolute top-[50%] bottom-[50%] left-[50%] right-[50%]"
          />
          <CardSuit
            v-if="isCard(card, 6) || isCard(card, 7) || isCard(card, 8)"
            :suit="card.suit"
            class="absolute top-[50%] bottom-[50%] right-[17%]"
          />

          <CardSuit
            v-if="greaterThanX(card, 8)"
            :suit="card.suit"
            class="absolute top-[62%] bottom-[38%] left-[17%] rotate-180"
          />
          <CardSuit
            v-if="greaterThanX(card, 8)"
            :suit="card.suit"
            class="absolute top-[62%] bottom-[38%] right-[17%] rotate-180"
          />

          <CardSuit
            v-if="isCard(card, 8)"
            :suit="card.suit"
            class="absolute top-[68%] bottom-[32%] left-[50%] right-[50%] rotate-180"
          />

          <CardSuit
            v-if="isCard(card, 10)"
            :suit="card.suit"
            class="absolute top-[74%] bottom-[26%] left-[50%] right-[50%] rotate-180"
          />

          <CardSuit
            v-if="greaterThanX(card, 3)"
            :suit="card.suit"
            class="absolute bottom-0 left-[17%] rotate-180"
          />
          <CardSuit
            v-if="isCard(card, 2) || isCard(card, 3)"
            :suit="card.suit"
            class="absolute bottom-0 left-[50%] right-[50%] rotate-180"
          />
          <CardSuit
            v-if="greaterThanX(card, 3)"
            :suit="card.suit"
            class="absolute bottom-0 right-[17%] rotate-180"
          />
        </span>

        <CornerNumber :card="card" class="rotate-180 self-end bottom-0 right-0" />
      </div>
    </template>
    <template #back><div class="w-full h-full" :class="CARD_BACKS[cardBack]"></div> </template>
  </BasicCard>
</template>
