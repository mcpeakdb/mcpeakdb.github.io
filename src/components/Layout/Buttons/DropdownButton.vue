<script setup lang="ts">
import { ref } from 'vue';
import ActionButton from './ActionButton.vue';
import type { DropdownButtonOption } from './dropdownButton.types';

defineProps({
  label: {
    type: String,
    default: '☰',
  },
  options: {
    type: Array as () => DropdownButtonOption[],
    default: () => [],
  },
  isRouterMenu: {
    type: Boolean,
    default: false,
  },
  toRight: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String as () => 'action' | 'neutral' | 'plain',
    default: 'action',
  },
});

const isOpen = ref(false);
</script>

<template>
  <div class="relative inline-block text-left">
    <ActionButton :variant="variant" @click="isOpen = !isOpen">{{ label }}</ActionButton>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
      :class="{
        'left-0': !toRight,
        'right-0': toRight,
      }"
    >
      <div v-if="isRouterMenu" class="py-1" role="none">
        <router-link
          v-for="(option, index) in options"
          :key="index"
          :to="option.value.toString()"
          class="block px-4 py-2 mx-2 text-sm rounded-md text-gray-700 focus:bg-gray-700 focus:text-white"
          role="menuitem"
          tabindex="-1"
        >
          {{ option.copy }}
        </router-link>
      </div>
      <div v-else class="py-1" role="none">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="block px-4 py-2 mx-2 text-sm rounded-md text-gray-700 focus:bg-gray-700 focus:text-white"
          role="menuitem"
          tabindex="-1"
        >
          {{ option.copy }}
        </div>
      </div>
    </div>
  </div>
</template>
