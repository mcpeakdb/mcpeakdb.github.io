<script lang="ts" setup>
import type { ModifierCardData } from '@/assets/blackjack-blitz/modifier-cards';

defineProps({
  card: {
    type: Object as () => ModifierCardData,
    required: true,
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg',
    default: 'md',
  },
});
</script>

<template>
  <div
    class="p-4 rounded-lg aspect-[9/16] relative inline-block border-4 shadow-lg overflow-hidden h-[70vh] cursor-pointer"
    :class="{
      'border-gray-500 bg-gray-600 text-gray-200': card.rarity === 'Common',
      'border-green-500 bg-green-600 text-green-200': card.rarity === 'Uncommon',
      'border-blue-500 bg-blue-600 text-blue-200': card.rarity === 'Rare',
      'border-purple-500 bg-purple-600 text-purple-200': card.rarity === 'Epic',
    }"
  >
    <h2
      class="font-bold mb-4"
      :class="{
        'text-md md:text-lg': size === 'sm',
        'text-lg md:text-xl': size === 'md',
        'text-xl md:text-2xl': size === 'lg',
      }"
    >
      {{ card.name }}
    </h2>
    <p
      class="mb-4 opacity-80 text-wrap"
      :class="{
        'text-xs md:text-sm': size === 'sm',
        'text-sm md:text-base': size === 'md',
        'text-base md:text-lg': size === 'lg',
      }"
    >
      {{ card.description }}
    </p>

    <div
      v-if="card.effects?.find((effect) => effect.effect.includes('armor'))"
      class="absolute top-1 right-1 text-sm bg-blue-500 border-white border-2 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg shadow-black-500/50"
    >
      🛡️
    </div>
    <div
      v-else-if="card.effects?.find((effect) => effect.effect === 'damage')"
      class="absolute top-1 right-1 text-sm bg-red-500 border-white border-2 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg shadow-black-500/50"
    >
      ⚔️
    </div>
  </div>
</template>
