export const CARD_BACKS = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  gradient: 'bg-gradient-to-br from-red-500 to-blue-500',
} as const;

export const CARD_SIZES = {
  xs: { width: 'w-12', height: 'h-16', text: 'text-xs' },
  sm: { width: 'w-16', height: 'h-24', text: 'text-sm' },
  md: { width: 'w-24', height: 'h-40', text: 'text-base' },
  lg: { width: 'w-32', height: 'h-48', text: 'text-lg' },
  xl: { width: 'w-40', height: 'h-60', text: 'text-xl' },
} as const;

export const CARD_ANIMATIONS = {
  deal: 'transition-all duration-500 ease-out',
  hover: 'hover:scale-105 hover:shadow-lg transition-transform duration-200',
  flip: 'transition-transform duration-300 transform-style-preserve-3d',
} as const;

export type CardSize = keyof typeof CARD_SIZES;
export type CardBack = keyof typeof CARD_BACKS;
