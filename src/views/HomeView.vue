<script setup lang="ts">
import BasicCard from '@/components/BasicCard.vue';
import NoCard from '@/components/NoCard.vue';
import { computed, onMounted, ref } from 'vue';

const SUIT_ASCII = {
  diamond: '♦',
  heart: '♥',
  club: '♣',
  spade: '♠',
};

type Suit = keyof typeof SUIT_ASCII;
type Card = { id: string; value: number[] | number; text: string; suit: Suit };

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
          <div v-if="cardDeck.length" class="relative w-24 h-40">
            <TransitionGroup name="card-deck">
              <BasicCard
                v-for="card in cardDeck"
                :key="card.id"
                class="absolute"
                @click="dealCard"
              />
            </TransitionGroup>
          </div>
          <NoCard v-else @click="fillDeck"> No cards remaining </NoCard>
        </div>

        <div>
          <BasicCard v-if="discardPile.length" is-faded is-face-up>
            <div
              class="flex flex-col justify-between h-full w-full p-1"
              :class="{ 'text-red-500': ['heart', 'diamond'].includes(topOfDiscardPile.suit) }"
            >
              <div class="text-left">
                {{ topOfDiscardPile.text }}
                <br />
                {{ SUIT_ASCII[topOfDiscardPile.suit] }}
              </div>

              {{ SUIT_ASCII[topOfDiscardPile.suit] }}

              <div class="text-left rotate-180">
                {{ topOfDiscardPile.text }}
                <br />
                {{ SUIT_ASCII[topOfDiscardPile.suit] }}
              </div>
            </div>
          </BasicCard>
          <NoCard v-else />
        </div>
      </div>

      <div v-if="dealtCards.length" class="flex justify-center gap-2">
        <TransitionGroup name="card-hand">
          <BasicCard
            v-for="(card, index) in dealtCards"
            :key="card.id"
            :value="card.value"
            is-face-up
            @click="discardCardFromHand(index)"
          >
            <div
              class="flex flex-col justify-between h-full w-full p-1"
              :class="{ 'text-red-500': ['heart', 'diamond'].includes(card.suit) }"
            >
              <div class="text-left">
                {{ card.text }}
                <br />
                {{ SUIT_ASCII[card.suit] }}
              </div>

              {{ SUIT_ASCII[card.suit] }}

              <div class="text-left rotate-180">
                {{ card.text }}
                <br />
                {{ SUIT_ASCII[card.suit] }}
              </div>
            </div>
          </BasicCard>
        </TransitionGroup>
      </div>
      <div v-else class="flex justify-center gap-2">
        <NoCard />
      </div>
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
}

.card-deck-leave-to {
  transform: translateY(200px) rotate(-10deg);
}

.card-hand-leave-to {
  transform: translateY(-200px) rotate(-10deg);
}
</style>
