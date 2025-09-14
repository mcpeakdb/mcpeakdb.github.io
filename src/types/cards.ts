export type CardValues = number[];

export const SUIT_ASCII = {
  diamond: '♦',
  heart: '♥',
  club: '♣',
  spade: '♠',
} as const;

export const SUIT_COLORS = {
  diamond: 'red',
  heart: 'red',
  club: 'black',
  spade: 'black',
} as const;

export type Suit = keyof typeof SUIT_ASCII;
export type SuitColor = (typeof SUIT_COLORS)[Suit];

export interface BaseCard {
  id: string;
  text: string;
  values: CardValues;
}

export interface StandardCard extends BaseCard {
  suit: Suit;
}

export interface CardPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
}
