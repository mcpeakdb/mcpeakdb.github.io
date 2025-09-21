<script lang="ts" setup>
import { CARD_BACKS } from '@/constants/cardStyles';
import { TABLE_THEMES } from '@/constants/tableThemes';

import useTheme from '@/composables/useTheme';

const { cardBack, tableTheme } = useTheme;
</script>

<template>
  <div>
    <h2 class="text-2xl md:text-3xl font-bold mb-4">Game Settings</h2>

    <div class="space-y-6">
      <div class="setting-section">
        <h5 class="text-lg md:text-xl font-semibold mb-3">Card Back Style</h5>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="(back, name) in CARD_BACKS"
            :key="name"
            class="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity capitalize bg-gradient-to-br"
            :class="back"
            @click="cardBack = CARD_BACKS[name]"
          >
            {{ name }}
          </button>
        </div>
      </div>

      <div class="setting-section">
        <h5 class="text-lg md:text-xl font-semibold mb-3">Table Theme</h5>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="(theme, name) in TABLE_THEMES"
            :key="name"
            class="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity capitalize bg-gradient-to-br"
            :class="theme"
            @click="tableTheme = TABLE_THEMES[name]"
          >
            {{ name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
