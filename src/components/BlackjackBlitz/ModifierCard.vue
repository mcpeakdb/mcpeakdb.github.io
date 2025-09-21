<script lang="ts" setup>
import type { ModifierCardData } from '@/assets/blackjack-blitz/modifier-cards';

defineProps({
  card: {
    type: Object as () => ModifierCardData,
    required: true,
  },
});
</script>

<template>
  <div
    :key="card.id"
    class="flex flex-col justify-center p-2 border rounded-lg text-center w-32 cursor-pointer hover:bg-gray-700 hover:bg-opacity-30 transition-all duration-200 hover:-translate-y-1 relative"
    :class="{
      'border-gray-500 bg-gray-800 bg-opacity-30': card.rarity === 'Common',
      'border-green-500 bg-green-800 bg-opacity-30': card.rarity === 'Uncommon',
      'border-blue-500 bg-blue-800 bg-opacity-30': card.rarity === 'Rare',
      'border-purple-500 bg-purple-800 bg-opacity-30': card.rarity === 'Epic',
    }"
  >
    <!-- Armor indicator for armor-related cards -->
    <div
      v-if="card.effects?.find((effect) => effect.effect.includes('armor'))"
      class="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-blue-500/50"
    >
      🛡️
    </div>
    <div
      v-else-if="card.effects?.find((effect) => effect.effect === 'damage')"
      class="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50"
    >
      ⚔️
    </div>
    <div class="text-xs font-semibold text-white">{{ card.name }}</div>
  </div>
</template>
