<script setup lang="ts">
import { onMounted } from 'vue';

import useStandardDeck from '@/composables/useStandardDeck';
import StandardCardDeck from '@/components/StandardCard/StandardCardDeck.vue';
import StandardCardDiscard from '@/components/StandardCard/StandardCardDiscard.vue';
import StandardCardHand from '@/components/StandardCard/StandardCardHand.vue';

onMounted(() => {
  useStandardDeck.buildDeck();
});
</script>

<template>
  <main class="w-screen h-screen">
    <div class="w-screen h-[50vh] flex justify-center items-end">
      <div class="flex justify-center gap-2">
        <StandardCardDeck class="mb-8" />

        <StandardCardDiscard />
      </div>
    </div>

    <div class="w-screen h-[50vh] flex justify-center items-start">
      <StandardCardHand />
    </div>
  </main>
</template>
