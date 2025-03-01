export const SUIT_ASCII = {
  diamond: '♦',
  heart: '♥',
  club: '♣',
  spade: '♠',
};

export type Suit = keyof typeof SUIT_ASCII;
export type StandardCard = { id: string; value: number[] | number; text: string; suit: Suit };
