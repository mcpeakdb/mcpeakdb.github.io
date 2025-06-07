export type CardNumber = number | readonly [number, number];

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
  value: CardNumber;
}

export interface StandardCard extends BaseCard {
  suit: Suit;
}

export interface UnoCard extends BaseCard {
  suit: UnoColor;
}

export type UnoColor = 'red' | 'green' | 'yellow' | 'blue';

export interface CardPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
}
