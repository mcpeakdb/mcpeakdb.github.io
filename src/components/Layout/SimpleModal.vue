<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(false);

function setShow(val: boolean): void {
  show.value = val;
}

defineExpose({ setShow });
</script>

<template>
  <div
    v-if="show"
    class="absolute top-0 left-0 w-screen h-screen bg-gray-500 opacity-50 z-10"
    @click="show = false"
  ></div>
  <div v-if="show" class="absolute top-1/2 left-1/2 -translate-1/2 z-20 bg-white rounded-lg p-4">
    <slot></slot>
  </div>
</template>
