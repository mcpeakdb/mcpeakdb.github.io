export const CARD_BACKS = {
  red: 'bg-red-500 bg-opacity-90 shadow-inner shadow-red-700 text-white',
  blue: 'bg-blue-500 bg-opacity-90 shadow-inner shadow-blue-700 text-white',
  green: 'bg-green-500 bg-opacity-90 shadow-inner shadow-green-700 text-white',
  purple: 'bg-purple-500 bg-opacity-90 shadow-inner shadow-purple-700 text-white',
  gradient: 'bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 shadow-lg text-white',
  rainbow:
    'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient text-white',
  cosmic:
    'bg-black bg-opacity-90 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600 via-blue-900 to-black animate-pulse text-white',
  uno: 'bg-black text-white',
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
