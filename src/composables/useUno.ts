import type { CARD_BACKS } from '@/constants/cardStyles';
import type { TABLE_THEMES } from '@/constants/tableThemes';
import { ref, computed, reactive } from 'vue';

export interface UnoCard {
  id: string;
  suit: 'red' | 'green' | 'blue' | 'yellow' | 'wild';
  value: number;
  text: string;
  isWild: boolean;
  isActionCard: boolean;
  action?: 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild-draw4';
}

interface GameState {
  isDealt: boolean;
  isGameOver: boolean;
  isComputerThinking: boolean;
  showComputerHand: boolean;
  pendingWildCard: UnoCard | null;
  pendingWildCardIndex: number | null;
  direction: 1 | -1; // 1 for clockwise, -1 for counter-clockwise
}

const gameState = reactive<GameState>({
  isDealt: false,
  isGameOver: false,
  isComputerThinking: false,
  showComputerHand: false,
  pendingWildCard: null,
  pendingWildCardIndex: null,
  direction: 1,
});

const playerHand = ref<UnoCard[]>([]);
const computerHand = ref<UnoCard[]>([]);
const deck = ref<UnoCard[]>([]);
const discardPile = ref<UnoCard[]>([]);
const currentCard = ref<UnoCard | null>(null);
const currentColor = ref<'red' | 'green' | 'blue' | 'yellow'>('red');
const isPlayerTurn = ref(true);
const cardBack = ref<keyof typeof CARD_BACKS>('uno');
const tableTheme = ref<keyof typeof TABLE_THEMES>('classic');

const didPlayerWin = computed(() => {
  return gameState.isGameOver && playerHand.value.length === 0;
});

const createDeck = (): UnoCard[] => {
  const cards: UnoCard[] = [];
  const suits: Array<'red' | 'green' | 'blue' | 'yellow'> = ['red', 'green', 'blue', 'yellow'];
  // Number cards (0-9)
  suits.forEach((suit) => {
    // One 0 card per color
    cards.push({
      id: `${suit}-0`,
      suit,
      value: 0,
      text: '0',
      isWild: false,
      isActionCard: false,
    });
    // Two of each number 1-9 per color
    for (let i = 1; i <= 9; i++) {
      for (let j = 0; j < 2; j++) {
        cards.push({
          id: `${suit}-${i}-${j}`,
          suit,
          value: i,
          text: i.toString(),
          isWild: false,
          isActionCard: false,
        });
      }
    }
    // Action cards (2 of each per color)
    const actionCards = [
      { value: 10, text: 'Skip', action: 'skip' as const },
      { value: 11, text: 'Reverse', action: 'reverse' as const },
      { value: 12, text: '+2', action: 'draw2' as const },
    ];

    actionCards.forEach((actionCard) => {
      for (let j = 0; j < 2; j++) {
        cards.push({
          id: `${suit}-${actionCard.action}-${j}`,
          suit,
          value: actionCard.value,
          text: actionCard.text,
          isWild: false,
          isActionCard: true,
          action: actionCard.action,
        });
      }
    });
  });
  // Wild cards (4 of each)
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: `wild-${i}`,
      suit: 'wild',
      value: 13,
      text: 'Wild',
      isWild: true,
      isActionCard: true,
      action: 'wild',
    });
    cards.push({
      id: `wild-draw4-${i}`,
      suit: 'wild',
      value: 14,
      text: '+4',
      isWild: true,
      isActionCard: true,
      action: 'wild-draw4',
    });
  }
  return cards;
};

const shuffleDeck = (cards: UnoCard[]): UnoCard[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const initializeGame = () => {
  deck.value = shuffleDeck(createDeck());
  playerHand.value = [];
  computerHand.value = [];
  discardPile.value = [];
  currentCard.value = null;
  currentColor.value = 'red';
  isPlayerTurn.value = true;
  gameState.isDealt = false;
  gameState.isGameOver = false;
  gameState.direction = 1;
};

const dealCards = () => {
  // Deal 7 cards to each player
  for (let i = 0; i < 7; i++) {
    playerHand.value.push(deck.value.pop()!);
    computerHand.value.push(deck.value.pop()!);
  }
  // Find first non-wild card for initial discard
  let firstCard;
  do {
    firstCard = deck.value.pop()!;
  } while (firstCard.isWild);
  discardPile.value.push(firstCard);
  currentCard.value = firstCard;
  currentColor.value = firstCard.suit as 'red' | 'green' | 'blue' | 'yellow';
  gameState.isDealt = true;
  // Handle initial card if it's an action card
  if (firstCard.isActionCard) {
    handleActionCard(firstCard);
  }
};

const canPlayCard = (card: UnoCard): boolean => {
  if (!currentCard.value) return false;

  // Wild cards can always be played
  if (card.isWild) return true;

  // Card matches color or value
  return card.suit === currentColor.value || card.value === currentCard.value.value;
};

const handleActionCard = (card: UnoCard) => {
  switch (card.action) {
    case 'skip':
      // Skip next player's turn (in 2-player game, skip opponent)
      isPlayerTurn.value = !isPlayerTurn.value;
      break;
    case 'reverse':
      // In 2-player game, reverse acts like skip
      isPlayerTurn.value = !isPlayerTurn.value;
      gameState.direction *= -1;
      break;
    case 'draw2':
      // Make opponent draw 2 cards
      const targetHand = isPlayerTurn.value ? computerHand.value : playerHand.value;
      drawCardsForPlayer(targetHand, 2);
      // Skip opponent's turn
      isPlayerTurn.value = !isPlayerTurn.value;
      break;
    case 'wild-draw4':
      // Make opponent draw 4 cards
      const targetHandWild = isPlayerTurn.value ? computerHand.value : playerHand.value;
      drawCardsForPlayer(targetHandWild, 4);
      // Skip opponent's turn
      isPlayerTurn.value = !isPlayerTurn.value;
      break;
  }
};

const drawCardsForPlayer = (hand: UnoCard[], count: number) => {
  for (let i = 0; i < count; i++) {
    if (deck.value.length === 0) {
      reshuffleDeck();
    }
    if (deck.value.length > 0) {
      hand.push(deck.value.pop()!);
    }
  }
};

const reshuffleDeck = () => {
  if (discardPile.value.length <= 1) return;

  // Keep current card, reshuffle the rest
  const currentCardToKeep = discardPile.value.pop()!;
  deck.value = shuffleDeck([...deck.value, ...discardPile.value]);
  discardPile.value = [currentCardToKeep];
};

const playCard = (cardIndex: number) => {
  const card = playerHand.value[cardIndex];
  if (!canPlayCard(card)) return;

  // Remove card from player's hand
  playerHand.value.splice(cardIndex, 1);

  // Add to discard pile
  discardPile.value.push(card);
  currentCard.value = card;

  // Update current color
  if (!card.isWild) {
    currentColor.value = card.suit as 'red' | 'green' | 'blue' | 'yellow';
  }

  // Handle action cards
  if (card.isActionCard) {
    handleActionCard(card);
  } else {
    // Normal card, switch turns
    isPlayerTurn.value = false;
  }

  // Check for win condition
  if (playerHand.value.length === 0) {
    gameState.isGameOver = true;
    return;
  }

  // Computer's turn
  if (!isPlayerTurn.value) {
    setTimeout(computerTurn, 1000);
  }
};

const drawCard = () => {
  if (deck.value.length === 0) {
    reshuffleDeck();
  }

  if (deck.value.length > 0) {
    const drawnCard = deck.value.pop()!;
    playerHand.value.push(drawnCard);

    // If the drawn card can be played, player can choose to play it
    // For simplicity, we'll just end the turn
    endTurn();
  }
};

const computerTurn = () => {
  gameState.isComputerThinking = true;

  // Find playable cards
  const playableCards = computerHand.value
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => canPlayCard(card));

  if (playableCards.length > 0) {
    // Play the first playable card (simple AI)
    const { card, index } = playableCards[0];

    // Remove card from computer's hand
    computerHand.value.splice(index, 1);

    // Add to discard pile
    discardPile.value.push(card);
    currentCard.value = card;

    // Handle wild cards - computer chooses color based on most cards in hand
    if (card.isWild) {
      const colorCounts = { red: 0, green: 0, blue: 0, yellow: 0 };
      computerHand.value.forEach((c) => {
        if (!c.isWild) {
          colorCounts[c.suit as keyof typeof colorCounts]++;
        }
      });

      const bestColor = Object.entries(colorCounts).reduce((a, b) =>
        colorCounts[a[0] as keyof typeof colorCounts] >
        colorCounts[b[0] as keyof typeof colorCounts]
          ? a
          : b,
      )[0] as 'red' | 'green' | 'blue' | 'yellow';

      currentColor.value = bestColor;
    } else {
      currentColor.value = card.suit as 'red' | 'green' | 'blue' | 'yellow';
    }

    // Handle action cards
    if (card.isActionCard) {
      handleActionCard(card);
    } else {
      // Normal card, switch turns
      isPlayerTurn.value = true;
    }

    // Check for win condition
    if (computerHand.value.length === 0) {
      gameState.isGameOver = true;
    }
  } else {
    // Computer draws a card
    if (deck.value.length === 0) {
      reshuffleDeck();
    }

    if (deck.value.length > 0) {
      computerHand.value.push(deck.value.pop()!);
    }

    isPlayerTurn.value = true;
  }

  gameState.isComputerThinking = false;
};

const setWildColor = (color: 'red' | 'green' | 'blue' | 'yellow') => {
  currentColor.value = color;
};

const endTurn = () => {
  if (isPlayerTurn.value) {
    isPlayerTurn.value = false;
    setTimeout(computerTurn, 1000);
  }
};

const reset = () => {
  initializeGame();
};

export default {
  gameState,
  playerHand,
  computerHand,
  discardPile,
  currentCard,
  currentColor,
  isPlayerTurn,
  canPlayCard,
  didPlayerWin,
  cardBack,
  tableTheme,
  initializeGame,
  dealCards,
  playCard,
  drawCard,
  endTurn,
  reset,
  setWildColor,
};
