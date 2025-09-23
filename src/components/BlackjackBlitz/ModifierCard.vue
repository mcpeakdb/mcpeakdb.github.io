<script lang="ts" setup>
import type { ModifierCardData } from '@/assets/blackjack-blitz/modifier-cards';
import { computed } from 'vue';

const props = defineProps({
  card: {
    type: Object as () => ModifierCardData,
    required: true,
  },
  size: {
    type: String as () => 'sm' | 'md',
    default: 'md',
  },
});

const rarityClasses = computed(() => {
  switch (props.card.rarity) {
    case 'Uncommon':
      return 'border-green-500 bg-green-600 text-green-200';
    case 'Rare':
      return 'border-blue-500 bg-blue-600 text-blue-200';
    case 'Epic':
      return 'border-purple-500 bg-purple-600 text-purple-200';
    default:
      return 'border-gray-500 bg-gray-600 text-gray-200';
  }
});
</script>

<template>
  <div
    class="p-4 rounded-lg relative inline-block border-8 border-double shadow-lg overflow-hidden cursor-pointer"
    :class="
      (size === 'sm' ? 'h-[35vh] min-w-[20vh] w-[20vh]' : 'h-[70vh] min-w-[40vh] w-[40vh]') +
      ' ' +
      rarityClasses
    "
  >
    <h2
      class="font-bold mb-4 flex gap-2 items-center"
      :class="{
        'text-sm md:text-md': size === 'sm',
        'text-lg md:text-xl': size === 'md',
      }"
    >
      <div
        v-if="card.effects?.find((effect) => effect.effect.includes('armor'))"
        class="bg-blue-500 border-white border-2 text-white rounded-full w-6 h-6 md:w-10 md:h-10 flex items-center justify-center shadow-lg shadow-black-500/50"
      >
        🛡️
      </div>
      <div
        v-else-if="card.effects?.find((effect) => effect.effect === 'damage')"
        class="bg-red-500 border-white border-2 text-white rounded-full w-6 h-6 md:w-10 md:h-10 flex items-center justify-center shadow-lg shadow-black-500/50"
      >
        ⚔️
      </div>
      {{ card.name }}
    </h2>
    <p
      class="mb-4 opacity-80 text-wrap"
      :class="{
        'text-xs md:text-sm': size === 'sm',
        'text-sm md:text-base': size === 'md',
      }"
    >
      {{ card.description }}
    </p>
  </div>
</template>
