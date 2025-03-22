<script setup lang="ts">
import CardSuit from '@/components/StandardCard/CardSuit.vue';
</script>

<template>
  <main class="w-screen h-screen flex justify-center items-center">
    <router-link to="/blackjack">
      <div class="flex"><CardSuit suit="club" /> <CardSuit class="text-red-500" /></div>
      Play Blackjack
      <div class="flex">
        <CardSuit suit="heart" class="text-red-500" /> <CardSuit suit="spade" />
      </div>
    </router-link>
  </main>
</template>
