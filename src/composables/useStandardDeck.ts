import type { CARD_BACKS } from '@/constants/cardStyles';
import type { TABLE_THEMES } from '@/constants/tableThemes';
import { SUIT_ASCII, type StandardCard as StandardCardType, type Suit } from '@/types/cards';
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
] as const;

// Create shared state at module level
const cardDeck = ref<StandardCardType[]>([]);
const playerHand = ref<StandardCardType[]>([]);
const computerHand = ref<StandardCardType[]>([]);
const discardPile = ref<StandardCardType[]>([]);
const cardBack = ref<keyof typeof CARD_BACKS>('red');
const tableTheme = ref<keyof typeof TABLE_THEMES>('classic');

const topOfDiscardPile = computed(() => {
  if (discardPile.value.length < 1) return null;
  return discardPile.value[discardPile.value.length - 1];
});

async function sleep(ms = 500): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(undefined);
    }, ms),
  );
}

function buildDeck(): void {
  const suits = Object.keys(SUIT_ASCII) as Suit[];

  cardDeck.value = []; // Clear existing deck

  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < 4; j++) {
      const suit = suits[j];
      cardDeck.value.push({
        value: cards[i].value,
        id: cards[i].id + '-' + suit,
        text: cards[i].text,
        suit: suit,
      });
    }
  }

  fillDeck();
}

function shuffle(): void {
  for (let i = cardDeck.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardDeck.value[i], cardDeck.value[j]] = [cardDeck.value[j], cardDeck.value[i]];
  }
}

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

function discardCardFromHand(index: number): void {
  if (playerHand.value.length > index) {
    const discardedCard = playerHand.value[index];
    discardPile.value.push(discardedCard);
    playerHand.value.splice(index, 1);
  }
}

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
// Export a single instance
export default {
  cards,
  cardDeck,
  cardBack,
  tableTheme,
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
