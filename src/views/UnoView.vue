<script setup lang="ts">
import useUnoDeck from '@/composables/useUnoDeck';
import { onMounted, onUnmounted, ref } from 'vue';
import BasicCard from '@/components/BasicCard.vue';

const { cardDeck, buildDeck, reset } = useUnoDeck;

const cardClasses = ref({
  red: 'bg-uno-red',
  green: 'bg-uno-green',
  blue: 'bg-uno-blue',
  yellow: 'bg-uno-yellow',
});

onMounted(() => {
  buildDeck();
});

onUnmounted(() => {
  reset();
});
</script>

<template>
  <div class="flex flex-wrap">
    <BasicCard v-for="card in cardDeck" :key="card.id" is-face-up>
      <template #front>
        <div
          :class="cardClasses[card.suit]"
          class="relative h-full w-full border-4 border-white rounded-lg text-white"
        >
          <div
            class="text-3xl font-bold absolute left-0 top-0 ms-1"
            style="text-decoration-color: white; -webkit-text-stroke: 1px black"
          >
            <span v-if="card.value === 12" class="tracking-tighter">+2</span>
            <span v-else>
              {{ card.text }}
            </span>
          </div>

          <div
            class="text-7xl font-bold absolute left-1/2 top-1/2 -translate-1/2"
            style="text-decoration-color: white; -webkit-text-stroke: 2px black"
          >
            {{ card.text }}
          </div>

          <div
            class="text-3xl font-bold absolute right-0 bottom-0 me-1 rotate-180"
            style="text-decoration-color: white; -webkit-text-stroke: 1px black"
          >
            <span v-if="card.value === 12" class="tracking-tighter">+2</span>
            <span v-else>
              {{ card.text }}
            </span>
          </div>
        </div>
      </template>
    </BasicCard>
  </div>
</template>
