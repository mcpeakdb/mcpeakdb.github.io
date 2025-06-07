import { ref, type Ref } from 'vue';
import type { UnoCard, UnoColor } from '@/components/UnoCard/types';
import { UNO_SYMBOLS } from '@/components/UnoCard/constants';

interface UnoCardDefinition {
  id: string;
  text: string;
  value: number;
  duplicates?: number;
}

const UNO_CARD_DEFINITIONS: UnoCardDefinition[] = [
  { id: '0', text: '0', value: 0, duplicates: 1 }, // Only one 0 per color
  { id: '1', text: '1', value: 1, duplicates: 2 },
  { id: '2', text: '2', value: 2, duplicates: 2 },
  { id: '3', text: '3', value: 3, duplicates: 2 },
  { id: '4', text: '4', value: 4, duplicates: 2 },
  { id: '5', text: '5', value: 5, duplicates: 2 },
  { id: '6', text: '6', value: 6, duplicates: 2 },
  { id: '7', text: '7', value: 7, duplicates: 2 },
  { id: '8', text: '8', value: 8, duplicates: 2 },
  { id: '9', text: '9', value: 9, duplicates: 2 },
  { id: 'skip', text: UNO_SYMBOLS.skip, value: 10, duplicates: 2 },
  { id: 'refresh', text: UNO_SYMBOLS.refresh, value: 11, duplicates: 2 },
  { id: 'draw2', text: UNO_SYMBOLS.draw2, value: 12, duplicates: 2 },
] as const;

const UNO_COLORS: UnoColor[] = ['red', 'green', 'yellow', 'blue'] as const;

export function useUnoDeck() {
  const cardDeck = ref<UnoCard[]>([]);

  const shuffle = (cards: UnoCard[]): UnoCard[] => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const createUnoCard = (
    cardDef: UnoCardDefinition,
    color: UnoColor,
    copyIndex: number,
  ): UnoCard => ({
    id: `${cardDef.id}-${color}-${copyIndex}`,
    text: cardDef.text,
    value: cardDef.value,
    suit: color,
  });

  const buildDeck = (): void => {
    const newDeck: UnoCard[] = [];

    UNO_CARD_DEFINITIONS.forEach((cardDef) => {
      UNO_COLORS.forEach((color) => {
        const duplicates = cardDef.duplicates ?? 1;
        for (let copy = 0; copy < duplicates; copy++) {
          newDeck.push(createUnoCard(cardDef, color, copy));
        }
      });
    });

    cardDeck.value = shuffle(newDeck);
  };

  const dealCard = (targetHand: Ref<UnoCard[]>): UnoCard | null => {
    const card = cardDeck.value.shift();
    if (card) {
      targetHand.value.push(card);
      return card;
    }
    return null;
  };

  const reset = (): void => {
    cardDeck.value = [];
  };

  return {
    // State
    cardDeck,

    // Actions
    buildDeck,
    dealCard,
    reset,

    // Utilities
    shuffle,

    // Constants
    cards: UNO_CARD_DEFINITIONS,
    colors: UNO_COLORS,
  };
}

export default useUnoDeck;
