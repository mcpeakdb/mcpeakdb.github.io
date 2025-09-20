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
  disabled: {
    type: Boolean,
    default: false,
  },
});

const classes = computed(() => {
  let classes = VARIANTS[props.variant];

  if (props.disabled) {
    classes += ' opacity-50 cursor-not-allowed';
  } else {
    classes += ' cursor-pointer';
  }

  return classes;
});
</script>

<template>
  <button
    class="focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5"
    :class="classes"
  >
    <slot></slot>
  </button>
</template>
