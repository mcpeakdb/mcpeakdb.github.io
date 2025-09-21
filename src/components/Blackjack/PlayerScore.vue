<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: 'Player',
    required: true,
  },
  showTotal: {
    type: Boolean,
    default: true,
    required: false,
  },
  handTotal: {
    type: Number,
    default: 0,
    required: true,
  },
  right: {
    type: Boolean,
    default: false,
    required: false,
  },
});
</script>

<template>
  <div
    class="flex-1 flex-grow text-center absolute bottom-0 mx-2 tall:my-2"
    :class="{ 'right-0': right, 'left-0': !right }"
  >
    <div class="text-sm md:text-lg uppercase tracking-wider">{{ title }}</div>
    <div class="text-2xl md:text-3xl font-bold">
      <span v-if="showTotal">{{ handTotal }}</span>
      <span v-else>??</span>
    </div>
  </div>
</template>
