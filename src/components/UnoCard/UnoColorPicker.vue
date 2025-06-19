<script setup lang="ts">
const emit = defineEmits<{
  colorSelected: [color: 'red' | 'green' | 'blue' | 'yellow'];
}>();

const colors = [
  { name: 'red', class: 'bg-uno-red', label: 'Red', emoji: '🔴' },
  { name: 'green', class: 'bg-uno-green', label: 'Green', emoji: '🟢' },
  { name: 'blue', class: 'bg-uno-blue', label: 'Blue', emoji: '🔵' },
  { name: 'yellow', class: 'bg-uno-yellow', label: 'Yellow', emoji: '🟡' },
] as const;

const selectColor = (color: 'red' | 'green' | 'blue' | 'yellow') => {
  emit('colorSelected', color);
};
</script>

<template>
  <div class="text-center">
    <h3 class="text-xl font-bold mb-2">🎨 Choose a Color</h3>
    <p class="text-gray-600 mb-6">Select the color for your wild card</p>
    <div class="flex gap-4 justify-center items-center">
      <button
        v-for="color in colors"
        :key="color.name"
        :class="color.class"
        class="w-24 h-24 rounded-full border-4 border-white hover:scale-110 hover:border-gray-200 transition-all duration-200 font-bold text-white shadow-lg active:scale-95 flex flex-col items-center justify-center"
        style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8)"
        @click="selectColor(color.name)"
      >
        <div class="text-2xl mb-1">{{ color.emoji }}</div>
        <div class="text-sm">{{ color.label }}</div>
      </button>
    </div>
  </div>
</template>
