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
  direction: 1 | -1;
  playerJustDrewCard: boolean;
  drawnCard: UnoCard | null;
  playerCanDraw: boolean;
}

const gameState = reactive<GameState>({
  isDealt: false,
  isGameOver: false,
  isComputerThinking: false,
  showComputerHand: false,
  pendingWildCard: null,
  pendingWildCardIndex: null,
  direction: 1,
  playerJustDrewCard: false,
  drawnCard: null,
  playerCanDraw: true,
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

const canDrawCard = computed(() => {
  return (
    isPlayerTurn.value &&
    gameState.isDealt &&
    !gameState.isGameOver &&
    !gameState.isComputerThinking &&
    gameState.playerCanDraw &&
    !gameState.playerJustDrewCard
  );
});

const createDeck = (): UnoCard[] => {
  const cards: UnoCard[] = [];
  const suits: Array<'red' | 'green' | 'blue' | 'yellow'> = ['red', 'green', 'blue', 'yellow'];

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
  // Reset all game state
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
  gameState.playerJustDrewCard = false;
  gameState.drawnCard = null;
  gameState.playerCanDraw = true;
  gameState.isComputerThinking = false;

  // Automatically deal cards
  setTimeout(() => {
    dealCards();
  }, 500);
};

const dealCards = () => {
  // Deal 7 cards to each player
  for (let i = 0; i < 7; i++) {
    if (deck.value.length > 0) {
      playerHand.value.push(deck.value.pop()!);
    }
    if (deck.value.length > 0) {
      computerHand.value.push(deck.value.pop()!);
    }
  }

  // Find first non-action card for initial discard
  let firstCard;
  do {
    if (deck.value.length === 0) {
      // If we run out of cards, reshuffle (shouldn't happen normally)
      deck.value = shuffleDeck(createDeck());
    }
    firstCard = deck.value.pop()!;
  } while (firstCard.isWild || firstCard.isActionCard);

  discardPile.value.push(firstCard);
  currentCard.value = firstCard;
  currentColor.value = firstCard.suit as 'red' | 'green' | 'blue' | 'yellow';
  gameState.isDealt = true;
  gameState.playerCanDraw = true;
};

const canPlayCard = (card: UnoCard): boolean => {
  if (!currentCard.value) return false;
  if (card.isWild) return true;
  return card.suit === currentColor.value || card.value === currentCard.value.value;
};

const hasPlayableCard = (hand: UnoCard[]): boolean => {
  return hand.some((card) => canPlayCard(card));
};

const handleActionCard = (card: UnoCard, playedByPlayer: boolean) => {
  switch (card.action) {
    case 'skip':
    case 'reverse':
      // In 2-player game, skip and reverse both mean current player gets another turn
      // No additional logic needed, turn won't switch
      break;
    case 'draw2':
      // Make opponent draw 2 cards and skip their turn
      const targetHand = playedByPlayer ? computerHand.value : playerHand.value;
      drawCardsForPlayer(targetHand, 2);
      break;
    case 'wild-draw4':
      // Make opponent draw 4 cards and skip their turn
      const targetHandWild = playedByPlayer ? computerHand.value : playerHand.value;
      drawCardsForPlayer(targetHandWild, 4);
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

  // Reset draw state
  gameState.playerJustDrewCard = false;
  gameState.drawnCard = null;
  gameState.playerCanDraw = true;

  // Update current color (will be set by wild color picker for wild cards)
  if (!card.isWild) {
    currentColor.value = card.suit as 'red' | 'green' | 'blue' | 'yellow';
  }

  // Check for win condition
  if (playerHand.value.length === 0) {
    gameState.isGameOver = true;
    return;
  }

  // Handle action cards
  if (card.isActionCard && (card.action === 'skip' || card.action === 'reverse')) {
    // Player gets another turn
    handleActionCard(card, true);
    return;
  } else if (card.isActionCard) {
    // Draw cards affect opponent, then player's turn ends
    handleActionCard(card, true);
  }

  // End player's turn
  isPlayerTurn.value = false;
  setTimeout(computerTurn, 1000);
};

const drawCard = () => {
  // Only allow drawing if conditions are met
  if (!canDrawCard.value) return;

  if (deck.value.length === 0) {
    reshuffleDeck();
  }

  if (deck.value.length > 0) {
    const drawnCard = deck.value.pop()!;
    playerHand.value.push(drawnCard);

    // Player can no longer draw this turn
    gameState.playerCanDraw = false;

    // Check if drawn card can be played
    if (canPlayCard(drawnCard)) {
      gameState.playerJustDrewCard = true;
      gameState.drawnCard = drawnCard;
      // Player can choose to play the drawn card or pass
    } else {
      // Can't play drawn card, turn ends automatically
      setTimeout(() => {
        endTurn();
      }, 1000);
    }
  }
};

const computerTurn = () => {
  gameState.isComputerThinking = true;

  setTimeout(() => {
    // Check if computer has playable cards
    if (!hasPlayableCard(computerHand.value)) {
      // Computer must draw a card
      if (deck.value.length === 0) {
        reshuffleDeck();
      }

      if (deck.value.length > 0) {
        const drawnCard = deck.value.pop()!;
        computerHand.value.push(drawnCard);

        // Check if computer can play the drawn card
        if (canPlayCard(drawnCard)) {
          // Computer plays the drawn card immediately
          const cardIndex = computerHand.value.length - 1;
          computerHand.value.splice(cardIndex, 1);

          discardPile.value.push(drawnCard);
          currentCard.value = drawnCard;

          if (drawnCard.isWild) {
            // Choose best color for wild card
            const colorCounts = { red: 0, green: 0, blue: 0, yellow: 0 };
            computerHand.value.forEach((c) => {
              if (!c.isWild) {
                colorCounts[c.suit as keyof typeof colorCounts]++;
              }
            });

            const bestColor = Object.entries(colorCounts).reduce((a, b) =>
              colorCounts[a[0] as keyof typeof colorCounts] >=
              colorCounts[b[0] as keyof typeof colorCounts]
                ? a
                : b,
            )[0] as 'red' | 'green' | 'blue' | 'yellow';

            currentColor.value = bestColor;
          } else {
            currentColor.value = drawnCard.suit as 'red' | 'green' | 'blue' | 'yellow';
          }

          // Check for win condition
          if (computerHand.value.length === 0) {
            gameState.isGameOver = true;
            gameState.isComputerThinking = false;
            return;
          }

          // Handle action cards
          if (drawnCard.isActionCard) {
            handleActionCard(drawnCard, false);
            if (drawnCard.action === 'skip' || drawnCard.action === 'reverse') {
              // Computer gets another turn
              gameState.isComputerThinking = false;
              setTimeout(computerTurn, 1000);
              return;
            }
          }
        }

        // Turn ends
        isPlayerTurn.value = true;
        gameState.playerCanDraw = true;
        gameState.isComputerThinking = false;
        return;
      }
    }

    // Find playable cards
    const playableCards = computerHand.value
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => canPlayCard(card));

    if (playableCards.length > 0) {
      // Simple AI: prefer action cards, then by color match
      const { card, index } = playableCards.sort((a, b) => {
        if (a.card.isActionCard && !b.card.isActionCard) return -1;
        if (!a.card.isActionCard && b.card.isActionCard) return 1;
        if (a.card.suit === currentColor.value && b.card.suit !== currentColor.value) return -1;
        if (a.card.suit !== currentColor.value && b.card.suit === currentColor.value) return 1;
        return 0;
      })[0];

      // Remove card from computer's hand
      computerHand.value.splice(index, 1);

      // Add to discard pile
      discardPile.value.push(card);
      currentCard.value = card;

      // Handle wild cards
      if (card.isWild) {
        const colorCounts = { red: 0, green: 0, blue: 0, yellow: 0 };
        computerHand.value.forEach((c) => {
          if (!c.isWild) {
            colorCounts[c.suit as keyof typeof colorCounts]++;
          }
        });

        const bestColor = Object.entries(colorCounts).reduce((a, b) =>
          colorCounts[a[0] as keyof typeof colorCounts] >=
          colorCounts[b[0] as keyof typeof colorCounts]
            ? a
            : b,
        )[0] as 'red' | 'green' | 'blue' | 'yellow';

        currentColor.value = bestColor;
      } else {
        currentColor.value = card.suit as 'red' | 'green' | 'blue' | 'yellow';
      }

      // Check for win condition
      if (computerHand.value.length === 0) {
        gameState.isGameOver = true;
        gameState.isComputerThinking = false;
        return;
      }

      // Handle action cards
      if (card.isActionCard && (card.action === 'skip' || card.action === 'reverse')) {
        // Computer gets another turn
        handleActionCard(card, false);
        gameState.isComputerThinking = false;
        setTimeout(computerTurn, 1000);
        return;
      } else if (card.isActionCard) {
        // Draw cards affect player
        handleActionCard(card, false);
      }

      // End computer's turn
      isPlayerTurn.value = true;
      gameState.playerCanDraw = true;
    }

    gameState.isComputerThinking = false;
  }, 1000);
};

const setWildColor = (color: 'red' | 'green' | 'blue' | 'yellow') => {
  currentColor.value = color;
};

const endTurn = () => {
  if (isPlayerTurn.value) {
    gameState.playerJustDrewCard = false;
    gameState.drawnCard = null;
    gameState.playerCanDraw = true;
    isPlayerTurn.value = false;
    setTimeout(computerTurn, 1000);
  }
};

const playDrawnCard = () => {
  if (gameState.drawnCard && gameState.playerJustDrewCard) {
    const cardIndex = playerHand.value.findIndex((card) => card.id === gameState.drawnCard!.id);
    if (cardIndex !== -1) {
      playCard(cardIndex);
    }
  }
};

const reset = () => {
  initializeGame();
};

export default {
  gameState,
  playerHand,
  computerHand,
  deck,
  discardPile,
  currentCard,
  currentColor,
  isPlayerTurn,
  canPlayCard,
  canDrawCard,
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
  playDrawnCard,
};
