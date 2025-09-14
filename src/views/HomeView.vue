<script setup lang="ts">
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import CardSuit from '@/components/StandardCard/CardSuit.vue';
</script>

<template>
  <main
    class="w-screen h-screen flex flex-col gap-2 justify-center items-center bg-radial from-neutral-700 to-neutral-800 p-4"
  >
    <img src="@/assets/logo.png" alt="Logo" class="w-32 h-32 mb-4" />
    <h1 class="text-4xl font-bold text-white text-center">Welcome to Card Games</h1>
    <p class="text-lg text-gray-300 mb-2 text-center">Choose a game to play!</p>

    <div class="flex flex-wrap gap-2">
      <router-link to="/blackjack">
        <ActionButton variant="neutral">
          <div class="flex w-full justify-around">
            <CardSuit suit="club" /> <CardSuit suit="diamond" class="text-red-500" />
          </div>
          Play Blackjack
          <div class="flex w-full justify-around">
            <CardSuit suit="heart" class="text-red-500" /> <CardSuit suit="spade" />
          </div>
        </ActionButton>
      </router-link>
      <router-link to="/blackjack-blitz">
        <ActionButton variant="neutral">
          <div class="flex w-full justify-around">
            <CardSuit suit="club" /> <CardSuit suit="diamond" class="text-red-500" />
          </div>
          Play Blackjack Blitz
          <br />
          (now in Beta)
          <div class="flex w-full justify-around">
            <CardSuit suit="heart" class="text-red-500" /> <CardSuit suit="spade" />
          </div>
        </ActionButton>
      </router-link>
    </div>

    <router-link to="/creature" class="absolute bottom-0"> Don't click here! </router-link>
  </main>
</template>
