<script lang="ts" setup>
import BasicCard from './BasicCard.vue';
import { type Card, SUIT_ASCII } from './BasicCard/types';

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
        v-if="typeof card.value === 'number'"
        class="flex flex-col justify-center items-center h-full w-full flex-wrap gap-1 text-2xl"
      >
        <span v-for="i in card.value" :key="i">
          {{ SUIT_ASCII[card.suit] }}
        </span>
      </span>
      <span
        v-else
        class="flex justify-center items-center h-full w-full text-2xl"
        :class="{ 'text-5xl': card.suit === 'spade' }"
      >
        {{ SUIT_ASCII[card.suit] }}
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
