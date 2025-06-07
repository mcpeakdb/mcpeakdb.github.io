<script setup lang="ts">
const emit = defineEmits<{
  colorSelected: [color: 'red' | 'green' | 'blue' | 'yellow'];
}>();

const colors = [
  { name: 'red', class: 'bg-uno-red', label: 'Red' },
  { name: 'green', class: 'bg-uno-green', label: 'Green' },
  { name: 'blue', class: 'bg-uno-blue', label: 'Blue' },
  { name: 'yellow', class: 'bg-uno-yellow', label: 'Yellow' },
] as const;

const selectColor = (color: 'red' | 'green' | 'blue' | 'yellow') => {
  emit('colorSelected', color);
};
</script>

<template>
  <div class="text-center">
    <h3 class="text-xl font-bold mb-4">Choose a Color</h3>
    <div class="grid grid-cols-2 gap-4">
      <button
        v-for="color in colors"
        :key="color.name"
        :class="color.class"
        class="w-20 h-20 rounded-full border-4 border-white hover:scale-110 transition-transform font-bold text-white shadow-lg"
        style="-webkit-text-stroke: 1px black"
        @click="selectColor(color.name)"
      >
        {{ color.label }}
      </button>
    </div>
  </div>
</template>
