<script setup lang="ts">
import { type StandardCard as Card } from '@/components/StandardCard/types';
import NoCard from '@/components/NoCard.vue';
import StandardCard from '@/components/StandardCard.vue';
import { computed, onMounted, ref } from 'vue';

const cards = [
  { id: 'a', text: 'A', value: [1, 11] },
  { id: '2', text: '2', value: 2 },
  { id: '3', text: '3', value: 3 },
  { id: '4', text: '4', value: 4 },
  { id: '5', text: '5', value: 5 },
  { id: '6', text: '6', value: 6 },
  { id: '7', text: '7', value: 7 },
  { id: '8', text: '8', value: 8 },
  { id: '9', text: '9', value: 9 },
  { id: '10', text: '10', value: 10 },
  { id: 'j', text: 'J', value: 10 },
  { id: 'q', text: 'Q', value: 10 },
  { id: 'k', text: 'K', value: 10 },
];
const cardDeck = ref<Card[]>([]);
const discardPile = ref<Card[]>([]);
const topOfDiscardPile = computed(() => {
  return discardPile.value[discardPile.value.length - 1];
});

const dealtCards = ref<Card[]>([]);

function dealCard(): void {
  const topCard = cardDeck.value.shift();

  if (!topCard) {
    // no cards?
    return;
  }

  dealtCards.value.push(topCard);
}

function fillDeck(): void {
  cardDeck.value = [...discardPile.value];
  discardPile.value = [];
  shuffle();
}

function shuffle() {
  for (let i = cardDeck.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardDeck.value[i], cardDeck.value[j]] = [cardDeck.value[j], cardDeck.value[i]];
  }
}

function discardCardFromHand(index: number): void {
  const cardsFromHand = dealtCards.value.splice(index, 1);
  if (cardsFromHand.length) {
    discardPile.value.push(cardsFromHand[0]);
  }
}

onMounted(() => {
  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < 4; j++) {
      const suit = j === 0 ? 'heart' : j === 1 ? 'diamond' : j === 2 ? 'club' : 'spade';
      cardDeck.value.push({
        value: cards[i].value,
        id: cards[i].id + '-' + suit,
        text: cards[i].text,
        suit: suit,
      });
    }
  }

  shuffle();
});
</script>

<template>
  <main class="w-screen flex justify-center items-center h-screen">
    <div>
      <div class="flex justify-center gap-2">
        <div class="justify-center flex mb-8">
          <TransitionGroup name="card-deck" class="relative w-36 h-60" tag="div">
            <NoCard v-if="!cardDeck.length" class="absolute empty" @click="fillDeck">
              No cards remaining
            </NoCard>
            <StandardCard
              v-for="card in cardDeck"
              v-else
              :key="card.id"
              :card="card"
              class="absolute"
              @click="dealCard"
            />
          </TransitionGroup>
        </div>

        <div>
          <StandardCard v-if="discardPile.length" :card="topOfDiscardPile" is-face-up />
          <NoCard v-else />
        </div>
      </div>

      <TransitionGroup class="flex justify-center gap-2 h-60" name="card-hand" tag="div">
        <NoCard v-if="!dealtCards.length" class="absolute empty" />
        <StandardCard
          v-for="(card, index) in dealtCards"
          :key="card.id"
          :card="card"
          is-face-up
          @click="discardCardFromHand(index)"
        />
      </TransitionGroup>
    </div>
  </main>
</template>

<style>
.card-deck-enter-active,
.card-deck-leave-active,
.card-deck-move,
.card-hand-enter-active,
.card-hand-leave-active,
.card-hand-move {
  transition: all 0.5s ease;
  pointer-events: none;
}

.card-deck-enter-from {
  opacity: 0;
  transform: translateX(80px) rotate(-30deg);
}

.card-deck-leave-to {
  opacity: 0;
  transform: translateX(-100vw) rotate(-30deg);
}

.card-hand-enter-from {
  opacity: 0;
  transform: translateX(100vw) rotate(-30deg);
}
.card-hand-leave-to {
  opacity: 0;
  transform: translateY(-200px) rotate(360deg);
}

.card-deck-enter-from.empty,
.card-deck-leave-to.empty,
.card-hand-enter-from.empty,
.card-hand-leave-to.empty {
  opacity: 0;
  transform: none;
}
</style>
