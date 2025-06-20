<script setup lang="ts">
import { computed } from 'vue';

const VARIANTS = {
  action:
    'text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800',
  neutral:
    'text-white bg-neutral-900 hover:bg-neutral-950 focus:ring-neutral-950 dark:bg-neutral-900 dark:hover:bg-neutral-950 dark:focus:ring-neutral-950',
  plain: '',
};

const props = defineProps({
  variant: {
    type: String as () => keyof typeof VARIANTS,
    default: () => 'action',
  },
});

const classes = computed(() => {
  return VARIANTS[props.variant];
});
</script>

<template>
  <button
    class="cursor-pointer focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5"
    :class="classes"
  >
    <slot></slot>
  </button>
</template>
