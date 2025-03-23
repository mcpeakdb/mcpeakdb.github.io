<script setup lang="ts">
import DropdownButton from './Buttons/DropdownButton.vue';
</script>

<template>
  <DropdownButton is-router-menu :options="[{ copy: 'Home', value: '/' }]" />
</template>
