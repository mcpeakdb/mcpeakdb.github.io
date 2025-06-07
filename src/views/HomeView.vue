<script setup lang="ts">
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import CardSuit from '@/components/CardSuit.vue';
import UnoSymbol from '@/components/UnoCard/UnoSymbol.vue';
</script>

<template>
  <main
    class="w-screen h-screen flex flex-col gap-2 justify-center items-center bg-radial from-neutral-700 to-neutral-800"
  >
    <img src="@/assets/logo.png" alt="Logo" class="w-32 h-32 mb-4" />
    <h1 class="text-4xl font-bold text-white mb-2">Welcome to Card Games</h1>
    <p class="text-lg text-gray-300 mb-6">Choose a game to play!</p>
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
    <router-link to="/uno" class="opacity-80 pointer-events-none">
      <ActionButton variant="neutral">
        <div class="flex w-full justify-around">
          <UnoSymbol class="text-uno-red" />
          <UnoSymbol class="text-uno-blue" symbol="refresh" />
        </div>
        Play
        <span class="text-uno-yellow">UNO</span><br />
        Coming Soon!
        <div class="flex w-full justify-around">
          <UnoSymbol class="text-uno-green" symbol="skip" />
          <UnoSymbol class="text-uno-yellow" />
        </div>
      </ActionButton>
    </router-link>
  </main>
</template>
