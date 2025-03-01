<script lang="ts" setup>
import { SUIT_ASCII, type StandardCard as Card } from './StandardCard/types';
import CardSuit from './StandardCard/CardSuit.vue';
import BasicCard from './BasicCard.vue';

defineProps({
  card: {
    type: Object as () => Card,
    default: () => {},
  },
  isFaceUp: {
    type: Boolean,
    default: false,
  },
});

function isFaceCard(Card: Card): boolean {
  return isNaN(parseInt(Card.text)) && Card.text !== 'A';
}

function isAce(Card: Card): boolean {
  return Card.text === 'A';
}

function shouldRotateSuit(Card: Card): boolean {
  if (typeof Card.value === 'number') {
    return Card.value < 6;
  }

  return false;
}

function lessThan4(Card: Card): boolean {
  if (typeof Card.value === 'number') {
    return Card.value < 4;
  }

  return true;
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

function isCardOdd(Card: Card): boolean {
  if (typeof Card.value === 'number') {
    return Card.value % 2 === 1;
  }
  return true;
}

function cardHas2ndMiddleSuit(Card: Card): boolean {
  if (typeof Card.value === 'number') {
    return Card.value === 8 || Card.value === 10;
  }

  return false;
}
</script>

<template>
  <BasicCard :key="card.id" :value="card.value" :is-face-up="isFaceUp">
    <div
      class="flex justify-center align-center h-full w-full p-1 relative"
      :class="{ 'text-red-500': ['heart', 'diamond'].includes(card.suit) }"
    >
      <div class="flex flex-col text-center w-fit leading-[0.8] absolute top-0 left-0 p-1">
        <div class="text-lg leading-[0.8]">
          {{ card.text }}
        </div>
        {{ SUIT_ASCII[card.suit] }}
      </div>

      <span
        v-if="isFaceCard(card)"
        class="flex flex-col justify-center items-center h-full w-full flex-wrap gap-1 text-2xl"
      >
        {{ card.text }}
      </span>
      <span
        v-else-if="isAce(card)"
        class="flex justify-center items-center h-full w-full text-4xl"
        :class="{ 'text-8xl': card.suit === 'spade' }"
      >
        {{ SUIT_ASCII[card.suit] }}
      </span>
      <span v-else class="h-full w-full text-2xl" :class="{ 'flex-col': lessThan4(card) }">
        <div
          v-if="lessThan4(card)"
          class="h-full flex flex-col items-stretch flex-wrap justify-between"
        >
          <span
            v-for="i in card.value"
            :key="i"
            class="flex basis-[25%] justify-center items-baseline"
            :class="{
              'rotate-180': (i === 3 && isCard(card, 3)) || (i === 2 && isCard(card, 2)),
              'items-baseline': i !== 2 || !isCard(card, 3),
              'items-center': i === 2 && isCard(card, 3),
            }"
          >
            {{ SUIT_ASCII[card.suit] }}
          </span>
        </div>
        <div v-else class="h-full flex flex-col items-stretch flex-wrap justify-between">
          <div class="flex justify-center items-center">
            <CardSuit :suit="card.suit" />
            <CardSuit :suit="card.suit" />
          </div>
          <div v-if="isCard(card, 9)" class="flex justify-center items-end">
            <CardSuit :suit="card.suit" />
            <CardSuit :suit="card.suit" />
          </div>
          <div
            v-if="isCardOdd(card) || greaterThanX(card, 6)"
            class="flex justify-center items-center"
          >
            <CardSuit :suit="card.suit" />
          </div>
          <div class="flex justify-center items-center">
            <CardSuit :suit="card.suit" :class="{ 'rotate-180': shouldRotateSuit(card) }" />
            <CardSuit :suit="card.suit" :class="{ 'rotate-180': shouldRotateSuit(card) }" />
          </div>
          <div v-if="isCard(card, 10)" class="flex justify-center items-end">
            <CardSuit :suit="card.suit" class="rotate-180" />
            <CardSuit :suit="card.suit" class="rotate-180" />
          </div>
          <div v-if="cardHas2ndMiddleSuit(card)" class="flex justify-center items-center">
            <CardSuit :suit="card.suit" class="rotate-180" />
          </div>
          <div
            v-if="greaterThanX(card, 5)"
            class="flex justify-center items-end"
            :class="{
              'basis-[33%]': isCard(card, 7),
            }"
          >
            <CardSuit :suit="card.suit" class="rotate-180" />
            <CardSuit :suit="card.suit" class="rotate-180" />
          </div>
        </div>
      </span>

      <div
        class="flex flex-col text-center w-fit leading-[0.8] rotate-180 self-end absolute bottom-0 right-0 p-1"
      >
        <div class="text-lg leading-[0.8]">
          {{ card.text }}
        </div>
        {{ SUIT_ASCII[card.suit] }}
      </div>
    </div>
  </BasicCard>
</template>
