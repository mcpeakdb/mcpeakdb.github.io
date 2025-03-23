import { computed, ref } from 'vue';
import useStandardDeck from './useStandardDeck';
import type { StandardCard } from '@/components/StandardCard/types';

const {
  cardBack,
  playerHand,
  computerHand,
  buildDeck,
  dealCard,
  dealComputerCard,
  sleep,
  fillDeck,
} = useStandardDeck;

const isDealt = ref(false);
const showComputerHand = ref(false);

function reset(): void {
  fillDeck();
  isDealt.value = false;
  isComputerThinking.value = false;
  showComputerHand.value = false;
  isGameOver.value = false;
}

async function dealHand(): Promise<void> {
  showComputerHand.value = false;
  isComputerThinking.value = true;
  isGameOver.value = false;

  fillDeck();

  dealCard();
  await sleep();
  dealComputerCard();
  await sleep();
  dealCard();
  await sleep();
  dealComputerCard();

  if (computerHandTotal.value === 21) {
    handleEndGame();
    showResult(false);
    return;
  }

  isComputerThinking.value = false;
  isDealt.value = true;
}

function hit(): void {
  dealCard();

  if (playerHandTotal.value > 21) {
    handleEndGame();
    showResult(false);
    return;
  }
}

const playerHandTotal = computed(() => {
  return getTotal(playerHand.value);
});

const isComputerThinking = ref(false);
const computerHandTotal = computed(() => {
  return getTotal(computerHand.value);
});

function getTotal(hand: StandardCard[]): number {
  let total = 0;
  let totalAces = 0;

  hand
    .toSorted((a, b) => {
      if (typeof a.value === 'number') {
        return -1;
      } else if (typeof b.value === 'number') {
        return 1;
      } else {
        return 1;
      }
    })
    .forEach((card) => {
      if (typeof card.value === 'number') {
        total += card.value;
      } else {
        totalAces += 1;
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

  await sleep();

  while (computerHandTotal.value < 17) {
    dealComputerCard();

    await sleep();
  }

  handleEndGame();

  if (computerHandTotal.value > 21) {
    showResult(true);
  } else if (computerHandTotal.value === playerHandTotal.value) {
    if (computerHand.value.length >= playerHand.value.length) {
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

const didPlayerWin = ref(false);
function showResult(didWin: boolean): void {
  didPlayerWin.value = didWin;
}

const isGameOver = ref(false);
function handleEndGame(): void {
  isGameOver.value = true;
  showComputerHand.value = true;
  isComputerThinking.value = false;
  isDealt.value = false;
}

export default {
  cardBack,
  playerHand,
  playerHandTotal,
  computerHand,
  computerHandTotal,
  isComputerThinking,
  showComputerHand,
  isDealt,
  didPlayerWin,
  isGameOver,
  buildDeck,
  dealHand,
  hit,
  endTurn,
  reset,
};
