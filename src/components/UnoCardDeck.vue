<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  cardBack?: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cardBack: 'classic',
  size: 'md',
  showCount: true,
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-12 h-16';
    case 'lg':
      return 'w-24 h-32';
    default:
      return 'w-16 h-24';
  }
});

const cardBackClasses = computed(() => {
  switch (props.cardBack) {
    case 'blue':
      return 'bg-blue-600';
    case 'red':
      return 'bg-red-600';
    default:
      return 'bg-gray-800';
  }
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      :class="[sizeClasses, cardBackClasses]"
      class="border-2 border-white rounded-lg flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform"
    >
      UNO
    </div>
    <div v-if="showCount" class="text-white text-sm mt-1">Draw Pile</div>
  </div>
</template>
