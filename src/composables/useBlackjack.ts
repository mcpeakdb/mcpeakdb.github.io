import { computed, ref } from 'vue';
import useStandardDeck from './useStandardDeck';
import { type StandardCard as StandardCardType } from '@/types/cards';

// Use the shared instance - don't destructure
const standardDeck = useStandardDeck;

const isDealt = ref(false);
const showComputerHand = ref(false);
const isComputerThinking = ref(false);
const isGameOver = ref(false);
const didPlayerWin = ref(false);

// Create gameState object to match your template
const gameState = computed(() => ({
  isDealt: isDealt.value,
  isGameOver: isGameOver.value,
  isComputerThinking: isComputerThinking.value,
  showComputerHand: showComputerHand.value,
  standardDeck: standardDeck,
}));

function reset(): void {
  standardDeck.cardDeck.value = [];
  isDealt.value = false;
  isComputerThinking.value = false;
  showComputerHand.value = false;
  isGameOver.value = false;
}

function initializeGame(): void {
  standardDeck.buildDeck();
}

async function dealHand(): Promise<void> {
  initializeGame();

  showComputerHand.value = false;
  isComputerThinking.value = true;
  isGameOver.value = false;

  setTimeout(async () => {
    standardDeck.dealCard();
    await standardDeck.sleep();
    standardDeck.dealComputerCard();
    await standardDeck.sleep();
    standardDeck.dealCard();
    await standardDeck.sleep();
    standardDeck.dealComputerCard();

    if (computerHandTotal.value === 21) {
      handleEndGame();
      showResult(false);
      return;
    }

    isComputerThinking.value = false;
    isDealt.value = true;
  }, 500);
}

function hit(): void {
  standardDeck.dealCard();

  if (playerHandTotal.value > 21) {
    handleEndGame();
    showResult(false);
    return;
  }
}

const playerHandTotal = computed(() => {
  return getTotal(standardDeck.playerHand.value);
});

const computerHandTotal = computed(() => {
  return getTotal(standardDeck.computerHand.value);
});

function getTotal(hand: StandardCardType[]): number {
  let total = 0;
  let totalAces = 0;

  hand.forEach((card) => {
    if (card.text === 'A') {
      totalAces += 1;
    } else if (card.values.length > 0) {
      total += card.values[0];
    } else {
      // TODO: fallback for wildcards or unexpected cards
    }
  });

  total += totalAces;

  while (totalAces > 0 && total < 21 && total + 10 <= 21) {
    if (total < 21 && total + 10 <= 21) {
      total += 10;
    }
    totalAces -= 1;
  }

  return total;
}

async function endTurn(): Promise<void> {
  isComputerThinking.value = true;
  showComputerHand.value = true;
  await standardDeck.sleep();

  while (computerHandTotal.value < 17) {
    standardDeck.dealComputerCard();
    await standardDeck.sleep();
  }

  handleEndGame();

  if (computerHandTotal.value > 21) {
    showResult(true);
  } else if (computerHandTotal.value === playerHandTotal.value) {
    if (standardDeck.computerHand.value.length >= standardDeck.playerHand.value.length) {
      showResult(false);
    } else {
      showResult(true);
    }
  } else if (computerHandTotal.value === 21 || computerHandTotal.value > playerHandTotal.value) {
    showResult(false);
  } else {
    showResult(true);
  }
}

function showResult(didWin: boolean): void {
  didPlayerWin.value = didWin;
}

function handleEndGame(): void {
  isGameOver.value = true;
  showComputerHand.value = true;
  isComputerThinking.value = false;
  isDealt.value = false;
}

export default {
  gameState,
  playerHand: standardDeck.playerHand,
  playerHandTotal,
  computerHand: standardDeck.computerHand,
  computerHandTotal,

  didPlayerWin,

  cardBack: standardDeck.cardBack,
  tableTheme: standardDeck.tableTheme,
  initializeGame,
  dealHand,
  hit,
  endTurn,
  reset,
};
