<script setup lang="ts">
import ActionButton from '@/components/Layout/Buttons/ActionButton.vue';
import CardSuit from '@/components/StandardCard/CardSuit.vue';
import UnoSymbol from '@/components/UnoCard/UnoSymbol.vue';
</script>

<template>
  <main
    class="w-screen h-screen flex flex-col gap-2 justify-center items-center bg-radial from-neutral-700 to-neutral-800"
  >
    <router-link to="/blackjack" class="h-fit">
      <ActionButton variant="neutral">
        <div class="flex"><CardSuit suit="club" /> <CardSuit class="text-red-500" /></div>
        Play Blackjack
        <div class="flex">
          <CardSuit suit="heart" class="text-red-500" /> <CardSuit suit="spade" />
        </div>
      </ActionButton>
    </router-link>
    <router-link to="/uno" class="h-fit opacity-80 pointer-events-none">
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
