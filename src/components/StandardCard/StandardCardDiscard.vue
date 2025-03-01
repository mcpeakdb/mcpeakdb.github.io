<script lang="ts" setup>
import useStandardDeck from '@/composables/useStandardDeck';
import StandardCard from '../StandardCard.vue';
import NoCard from '../NoCard.vue';

const { topOfDiscardPile } = useStandardDeck;
</script>

<template>
  <div class="cursor-default">
    <StandardCard v-if="topOfDiscardPile" :card="topOfDiscardPile" is-face-up />
    <NoCard v-else />
  </div>
</template>
