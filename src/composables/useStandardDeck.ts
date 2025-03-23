import type { CARD_BACKS } from '@/components/StandardCard/constants';
import { SUIT_ASCII, type StandardCard, type Suit } from '@/components/StandardCard/types';
import { computed, ref } from 'vue';

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

async function sleep(ms = 500): Promise<void> {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve(undefined);
    }, ms),
  );
}

function buildDeck(): void {
  const suits = Object.keys(SUIT_ASCII);

  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < 4; j++) {
      const suit = suits[j];
      cardDeck.value.push({
        value: cards[i].value,
        id: cards[i].id + '-' + suit,
        text: cards[i].text,
        suit: suit as Suit,
      });
    }
  }

  fillDeck();
}

function shuffle() {
  for (let i = cardDeck.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardDeck.value[i], cardDeck.value[j]] = [cardDeck.value[j], cardDeck.value[i]];
  }
}

const cardDeck = ref<StandardCard[]>([]);

function dealCard(): void {
  const topCard = cardDeck.value.shift();

  if (topCard) {
    playerHand.value.push(topCard);
  }
}

function dealComputerCard(): void {
  const topCard = cardDeck.value.shift();

  if (topCard) {
    computerHand.value.push(topCard);
  }
}

const playerHand = ref<StandardCard[]>([]);
const computerHand = ref<StandardCard[]>([]);

function discardCardFromHand(index: number): void {
  if (playerHand.value.length) {
    discardPile.value.push(playerHand.value[index]);

    playerHand.value.splice(index, 1);
  }
}

const discardPile = ref<StandardCard[]>([]);
const topOfDiscardPile = computed(() => {
  if (discardPile.value.length < 1) return null;

  return discardPile.value[discardPile.value.length - 1];
});

function fillDeck(): void {
  cardDeck.value = [
    ...cardDeck.value,
    ...discardPile.value,
    ...playerHand.value,
    ...computerHand.value,
  ];

  discardPile.value = [];
  playerHand.value = [];
  computerHand.value = [];
  shuffle();
}

const cardBack = ref<keyof typeof CARD_BACKS>('red');

export default {
  cards,
  cardDeck,
  cardBack,
  playerHand,
  computerHand,
  discardPile,
  topOfDiscardPile,
  buildDeck,
  dealCard,
  dealComputerCard,
  discardCardFromHand,
  shuffle,
  fillDeck,
  sleep,
};
