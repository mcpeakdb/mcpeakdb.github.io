import { ref } from 'vue';
import useStandardDeck from './useStandardDeck';
import type { UnoCard, UnoColor } from '@/components/UnoCard/types';
import { UNO_SYMBOLS } from '@/components/UnoCard/constants';
const { fillDeck } = useStandardDeck;

const cardDeck = ref<UnoCard[]>([]);

const cards = [
  { id: '0', text: '0', value: 0 },
  { id: '1', text: '1', value: 1 },
  { id: '2', text: '2', value: 2 },
  { id: '3', text: '3', value: 3 },
  { id: '4', text: '4', value: 4 },
  { id: '5', text: '5', value: 5 },
  { id: '6', text: '6', value: 6 },
  { id: '7', text: '7', value: 7 },
  { id: '8', text: '8', value: 8 },
  { id: '9', text: '9', value: 9 },
  { id: 'skip', text: UNO_SYMBOLS.skip, value: 10 },
  { id: 'refresh', text: UNO_SYMBOLS.refresh, value: 11 },
  { id: 'draw2', text: UNO_SYMBOLS.draw2, value: 12 },
];

const COLORS = ['red', 'green', 'yellow', 'blue'];

function buildDeck(): void {
  for (let c = 0; c < 2; c++) {
    for (let i = 0; i < cards.length; i++) {
      for (let j = 0; j < 4; j++) {
        const suit = COLORS[j];

        // duplicates for 1-9, nothing else
        if (c === 1 && (i === 0 || i > 9)) {
          continue;
        }

        cardDeck.value.push({
          value: cards[i].value,
          id: cards[i].id + '-' + suit + '-' + c,
          text: cards[i].text,
          suit: suit as UnoColor,
        });
      }
    }
  }

  fillDeck();
}

function reset(): void {
  cardDeck.value = [];
}

export default {
  cardDeck,
  buildDeck,
  reset,
};
