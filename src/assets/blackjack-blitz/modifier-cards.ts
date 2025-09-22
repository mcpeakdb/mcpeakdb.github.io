export interface ModifierCardData {
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic';
  id?: string;
  description: string;
  effects: Effect[];
  isActive?: boolean;
}

export type EffectTypes =
  | 'armor_add'
  | 'armor_add_hand'
  | 'draw_modifier'
  | 'damage'
  | 'draw_card'
  | 'prevent_bust'
  | 'reorder_deck'
  | 'set_card_value'
  | 'swap_card'
  | 'confuse'
  | 'block_next_damage'
  | 'ignore_bust'
  | 'double_damage'
  | 'duplicate_card'
  | 'lock_draw'
  | 'burn_top'
  | 'reveal_cards'
  | 'remove_card'
  | 'stun'
  | 'negate_modifier'
  | 'shuffle_opponent'
  | 'discard_card'
  | 'skip_turn'
  | 'count_aces'
  | 'heal'
  | 'randomize_card';

export type EffectWhen =
  | 'on_bust'
  | 'draw'
  | 'immediately'
  | 'game_end'
  | 'on_stand'
  | 'on_hit'
  | 'on_win'
  | 'on_lose';

export type EffectCondition =
  | `if_total_${number}`
  | `if_card_${number}`
  | `if_total_between_${number}_${number}`;

export interface Effect {
  target: 'self' | 'opponent';
  effect: EffectTypes;
  when: EffectWhen;
  value?: number;
  condition?: EffectCondition;
}

/* Modifier cards with mapped effects */
const ModifierCards: ModifierCardData[] = [
  {
    name: 'Safe Bet',
    rarity: 'Common',
    description: 'Draw one card without risking a bust when your total is 15 or less.',
    effects: [
      { target: 'self', when: 'draw', effect: 'draw_card', value: 1, condition: 'if_total_15' },
      { target: 'self', when: 'draw', effect: 'prevent_bust', value: 1, condition: 'if_total_15' },
    ],
  },
  {
    name: 'Stack the Deck',
    rarity: 'Common',
    description: 'Reorder the top two cards of the dealer deck to your advantage.',
    effects: [{ target: 'self', when: 'immediately', effect: 'reorder_deck', value: 2 }],
  },
  {
    name: 'Uppercut',
    rarity: 'Common',
    description: 'Deal extra damage to the opponent if your final total is 18 or higher.',
    effects: [
      {
        target: 'opponent',
        when: 'game_end',
        effect: 'damage',
        condition: 'if_total_18',
        value: 3,
      },
    ],
    isActive: true,
  },
  {
    name: 'Soft Stand',
    rarity: 'Common',
    description: 'Gain +2 armor when you stand with a total of 16 or less.',
    effects: [
      {
        target: 'self',
        when: 'on_stand',
        effect: 'armor_add',
        condition: 'if_total_between_0_16',
        value: 2,
      },
    ],
  },
  {
    name: 'Guard Stance',
    rarity: 'Common',
    description: 'Gain +3 armor for this round.',
    effects: [{ target: 'self', when: 'immediately', effect: 'armor_add', value: 3 }],
    isActive: true,
  },
  {
    name: 'Calculated Risk',
    rarity: 'Common',
    description: 'Treat one ace in your hand as either 1 or 11 for this turn.',
    effects: [{ target: 'self', when: 'immediately', effect: 'count_aces', value: 1 }],
  },
  {
    name: 'Feint',
    rarity: 'Common',
    description: 'Confuse the opponent and reduce their next hit damage.',
    effects: [{ target: 'opponent', when: 'on_hit', effect: 'confuse', value: 1 }],
  },
  {
    name: 'Swift Jab',
    rarity: 'Common',
    description: 'Immediately deal a small amount of damage to the opponent.',
    effects: [{ target: 'opponent', when: 'immediately', effect: 'damage', value: 2 }],
  },
  {
    name: 'Defensive Draw',
    rarity: 'Common',
    description: 'Gain +2 armor and draw one extra modifier card immediately.',
    effects: [
      { target: 'self', when: 'immediately', effect: 'armor_add', value: 2 },
      { target: 'self', when: 'immediately', effect: 'draw_modifier', value: 1 },
    ],
    isActive: true,
  },
  {
    name: 'Low Profile',
    rarity: 'Common',
    description: 'Take half damage this round if you stand.',
    effects: [{ target: 'self', when: 'on_stand', effect: 'block_next_damage', value: 50 }],
  },
  {
    name: 'Shady Deal',
    rarity: 'Common',
    description: 'Swap a card in your hand with one from the opponent’s hand.',
    effects: [{ target: 'opponent', when: 'immediately', effect: 'swap_card', value: 1 }],
  },
  {
    name: 'Tilt Control',
    rarity: 'Common',
    description: 'Set one card’s value to 5 for this turn.',
    effects: [{ target: 'self', when: 'immediately', effect: 'set_card_value', value: 5 }],
  },
  {
    name: 'Mirror Move',
    rarity: 'Common',
    description: 'Duplicate the next card your opponent plays into your hand.',
    effects: [{ target: 'self', when: 'on_hit', effect: 'duplicate_card', value: 1 }],
  },
  {
    name: 'Escape Artist',
    rarity: 'Common',
    description: 'Avoid penalties if you lose this round.',
    effects: [{ target: 'self', when: 'on_lose', effect: 'ignore_bust', value: 1 }],
  },
  {
    name: 'Redraw Gambit',
    rarity: 'Common',
    description: 'Draw two cards and discard one without taking a hit action.',
    effects: [
      { target: 'self', when: 'immediately', effect: 'draw_card', value: 2 },
      { target: 'self', when: 'immediately', effect: 'discard_card', value: 1 },
    ],
  },
  {
    name: 'Dealer’s Favor',
    rarity: 'Common',
    description: 'Gain +1 to your next draw when your hand total is odd.',
    effects: [
      {
        target: 'self',
        when: 'draw',
        effect: 'draw_card',
        value: 1,
        condition: 'if_total_between_1_21',
      },
    ],
  },
  {
    name: 'Steady Hand',
    rarity: 'Common',
    description: 'Prevent a bust when your total is 19 or less.',
    effects: [
      {
        target: 'self',
        when: 'on_bust',
        effect: 'prevent_bust',
        condition: 'if_total_19',
        value: 1,
      },
    ],
  },
  {
    name: 'Absorb Hit',
    rarity: 'Rare',
    description: 'Gain +10 armor that blocks incoming damage.',
    effects: [{ target: 'self', when: 'immediately', effect: 'armor_add', value: 10 }],
    isActive: true,
  },
  {
    name: 'High Roller',
    rarity: 'Common',
    description: 'Draw a card; if its value is 8 or higher, gain +2 bonus damage.',
    effects: [
      { target: 'self', when: 'draw', effect: 'draw_card', value: 1 },
      { target: 'self', when: 'draw', effect: 'damage', condition: 'if_card_8', value: 2 },
    ],
  },
  {
    name: 'Brace',
    rarity: 'Common',
    description: 'Negate loss damage if you played no modifier this turn.',
    effects: [{ target: 'self', when: 'on_lose', effect: 'ignore_bust', value: 1 }],
  },
  {
    name: 'Card Counter',
    rarity: 'Uncommon',
    description: 'Reveal the next three cards in the dealer deck.',
    effects: [{ target: 'self', when: 'immediately', effect: 'reveal_cards', value: 3 }],
    isActive: true,
  },
  {
    name: 'Hold Back',
    rarity: 'Uncommon',
    description: 'Remove one card from your hand this turn.',
    effects: [{ target: 'self', when: 'immediately', effect: 'remove_card', value: 1 }],
  },
  {
    name: 'Fake Stand',
    rarity: 'Uncommon',
    description: 'Make the opponent believe you stood until the round resolves.',
    effects: [{ target: 'opponent', when: 'immediately', effect: 'confuse', value: 1 }],
  },
  {
    name: 'Dead Man’s Draw',
    rarity: 'Uncommon',
    description: 'When you bust, deal damage to both players.',
    effects: [
      { target: 'self', when: 'on_bust', effect: 'damage', value: 2 },
      { target: 'opponent', when: 'on_bust', effect: 'damage', value: 2 },
    ],
  },
  {
    name: 'Busted Shield',
    rarity: 'Uncommon',
    description: 'Gain +5 armor immediately if you bust.',
    effects: [{ target: 'self', when: 'on_bust', effect: 'armor_add', value: 5 }],
    isActive: true,
  },
  {
    name: 'Follow Through',
    rarity: 'Uncommon',
    description: 'Gain +1 bonus attack for each card remaining in your hand at resolution.',
    effects: [{ target: 'self', when: 'game_end', effect: 'damage', value: 1 }],
  },
  {
    name: 'Reactive Guard',
    rarity: 'Uncommon',
    description: 'Gain armor equal to the number of cards in your hand at game end.',
    effects: [{ target: 'self', when: 'game_end', effect: 'armor_add_hand' }],
    isActive: true,
  },
  {
    name: 'Risky Business',
    rarity: 'Uncommon',
    description: 'Take 2 damage immediately to draw one extra card.',
    effects: [
      { target: 'self', when: 'immediately', effect: 'damage', value: 2 },
      { target: 'self', when: 'immediately', effect: 'draw_card', value: 1 },
    ],
  },
  {
    name: 'Soft Bounce',
    rarity: 'Uncommon',
    description: 'Make the first bust this round deal no self-damage.',
    effects: [{ target: 'self', when: 'on_bust', effect: 'ignore_bust', value: 1 }],
  },
  {
    name: 'Ambush',
    rarity: 'Uncommon',
    description: 'Deal 2 damage to the opponent if they hit next.',
    effects: [{ target: 'opponent', when: 'on_hit', effect: 'damage', value: 2 }],
  },
  {
    name: 'Double Top',
    rarity: 'Uncommon',
    description: 'If you draw two cards of value 9 or higher, deal +5 damage to the opponent.',
    effects: [
      { target: 'opponent', when: 'draw', effect: 'damage', condition: 'if_card_9', value: 5 },
    ],
  },
  {
    name: 'Overwhelm',
    rarity: 'Uncommon',
    description: 'If you draw four or more cards this round, gain +5 attack at resolution.',
    effects: [
      {
        target: 'self',
        when: 'game_end',
        effect: 'damage',
        condition: 'if_total_between_4_99',
        value: 5,
      },
    ],
  },
  {
    name: 'Critical Focus',
    rarity: 'Uncommon',
    description: 'Deal double damage when your total is 21.',
    effects: [
      {
        target: 'self',
        when: 'game_end',
        effect: 'double_damage',
        condition: 'if_total_21',
        value: 2,
      },
    ],
  },
  {
    name: 'Snare Trap',
    rarity: 'Uncommon',
    description: 'Deal 4 damage to the opponent if they draw a card with value 9 or higher.',
    effects: [
      { target: 'opponent', when: 'draw', effect: 'damage', condition: 'if_card_9', value: 4 },
    ],
  },
  {
    name: 'Push Limit',
    rarity: 'Uncommon',
    description: 'If you bust at 22 or 23, set your total to 20 instead.',
    effects: [
      {
        target: 'self',
        when: 'on_bust',
        effect: 'set_card_value',
        condition: 'if_total_between_22_23',
        value: 20,
      },
    ],
  },
  {
    name: 'Hallucinate',
    rarity: 'Uncommon',
    description: 'Make the opponent see a fake card value for one turn.',
    effects: [{ target: 'opponent', when: 'immediately', effect: 'confuse', value: 1 }],
  },
  {
    name: 'Copycat',
    rarity: 'Uncommon',
    description: "Set your hand total to match the opponent's current total.",
    effects: [{ target: 'self', when: 'immediately', effect: 'set_card_value', value: 0 }],
  },
  {
    name: 'Twist Fate',
    rarity: 'Uncommon',
    description: 'Prevent the opponent from gaining damage benefits if they win.',
    effects: [{ target: 'opponent', when: 'on_win', effect: 'negate_modifier', value: 1 }],
  },
  {
    name: 'Turn the Tables',
    rarity: 'Uncommon',
    description: 'Mirror the opponent’s current hand total for immediate effect.',
    effects: [{ target: 'self', when: 'immediately', effect: 'set_card_value', value: 0 }],
  },
  {
    name: 'Rattled',
    rarity: 'Uncommon',
    description: 'Force the opponent to hit if their total is between 14 and 17.',
    effects: [
      {
        target: 'opponent',
        when: 'immediately',
        effect: 'confuse',
        condition: 'if_total_between_14_17',
        value: 1,
      },
    ],
  },
  {
    name: 'Counting Ace',
    rarity: 'Rare',
    description: 'Count aces in your hand as both 1 and 11 for this turn.',
    effects: [{ target: 'self', when: 'immediately', effect: 'count_aces', value: 1 }],
  },
  {
    name: 'Sleight of Hand',
    rarity: 'Rare',
    description: 'Hide your final total until combat resolves.',
    effects: [{ target: 'self', when: 'immediately', effect: 'confuse', value: 1 }],
  },
  {
    name: 'Sabotage',
    rarity: 'Rare',
    description: "Reduce the opponent's next draw value by 2.",
    effects: [{ target: 'opponent', when: 'draw', effect: 'set_card_value', value: -2 }],
  },
  {
    name: "Jester's Gambit",
    rarity: 'Rare',
    description: 'Roll a d20; on a 1 or 20 deal 20 damage to the opponent.',
    effects: [{ target: 'opponent', when: 'immediately', effect: 'damage', value: 20 }],
  },
  {
    name: 'Blackjack Lock',
    rarity: 'Rare',
    description: 'Prevent both players from drawing cards this round.',
    effects: [{ target: 'self', when: 'immediately', effect: 'lock_draw', value: 1 }],
  },
  {
    name: 'Emergency Evade',
    rarity: 'Rare',
    description: 'Ignore the first bust that occurs in this game.',
    effects: [{ target: 'self', when: 'on_bust', effect: 'ignore_bust', value: 1 }],
  },
  {
    name: 'Triple Twist',
    rarity: 'Rare',
    description: 'Draw three cards from the dealer deck and keep one of them.',
    effects: [
      { target: 'self', when: 'immediately', effect: 'draw_card', value: 3 },
      { target: 'self', when: 'immediately', effect: 'discard_card', value: 2 },
    ],
  },
  {
    name: 'Weighted Deck',
    rarity: 'Rare',
    description: 'Set the top card of the deck to value 6.',
    effects: [{ target: 'self', when: 'immediately', effect: 'set_card_value', value: 6 }],
  },
  {
    name: 'Mirror Guard',
    rarity: 'Rare',
    description: 'Reflect 50% of damage taken back to the attacker this round.',
    effects: [{ target: 'self', when: 'immediately', effect: 'block_next_damage', value: 50 }],
  },
  {
    name: 'Time Skip',
    rarity: 'Rare',
    description: 'Take two turns in a row and skip the next round.',
    effects: [
      { target: 'self', when: 'immediately', effect: 'skip_turn', value: 1 },
      { target: 'self', when: 'immediately', effect: 'skip_turn', value: -1 },
    ],
  },
  {
    name: 'Sudden Death',
    rarity: 'Rare',
    description: 'Make the opponent lose immediately if they bust while having zero armor.',
    effects: [
      {
        target: 'opponent',
        when: 'on_bust',
        effect: 'damage',
        condition: 'if_total_0',
        value: 999,
      },
    ],
  },
  {
    name: 'Damage Echo',
    rarity: 'Rare',
    description: "Repeat half of your last round's damage to the opponent if you hit.",
    effects: [{ target: 'self', when: 'on_hit', effect: 'damage', value: 0 }],
  },
  {
    name: 'Ghost Draw',
    rarity: 'Rare',
    description: 'Draw a card that does not contribute to your hand total.',
    effects: [{ target: 'self', when: 'draw', effect: 'draw_card', value: 1 }],
  },
  {
    name: 'Invert Hand',
    rarity: 'Rare',
    description: 'Change your hand total to 21 minus your current total.',
    effects: [{ target: 'self', when: 'immediately', effect: 'set_card_value', value: 21 }],
  },
  {
    name: 'Wild Swing',
    rarity: 'Rare',
    description: 'When you bust, deal damage equal to your hand total to the opponent.',
    effects: [{ target: 'opponent', when: 'on_bust', effect: 'damage', value: 0 }],
  },
  {
    name: "Dealer's Edge",
    rarity: 'Rare',
    description: "Deal +3 damage when the dealer's visible card has value 6 or less.",
    effects: [
      { target: 'self', when: 'immediately', effect: 'damage', condition: 'if_card_6', value: 3 },
    ],
  },
  {
    name: 'Backstab',
    rarity: 'Rare',
    description: 'Deal +3 damage if the opponent stands and you do not.',
    effects: [{ target: 'opponent', when: 'on_stand', effect: 'damage', value: 3 }],
  },
  {
    name: 'Unstable Shot',
    rarity: 'Rare',
    description: 'Deal +6 damage immediately and skip your next turn.',
    effects: [
      { target: 'opponent', when: 'immediately', effect: 'damage', value: 6 },
      { target: 'self', when: 'immediately', effect: 'skip_turn', value: 1 },
    ],
  },
  {
    name: "Dealer's Debt",
    rarity: 'Rare',
    description: 'Force the dealer to burn the top card of their deck.',
    effects: [{ target: 'opponent', when: 'immediately', effect: 'burn_top', value: 1 }],
  },
  {
    name: 'Wild Card',
    rarity: 'Epic',
    description: 'Set a selected card’s value to a random number between 2 and 11.',
    effects: [{ target: 'self', when: 'immediately', effect: 'randomize_card', value: 1 }],
  },
  {
    name: 'Lucky Seven',
    rarity: 'Epic',
    description: 'Gain +7 damage if your final total is exactly 7.',
    effects: [
      { target: 'self', when: 'game_end', effect: 'damage', condition: 'if_total_7', value: 7 },
    ],
  },
  {
    name: 'Haunted Card',
    rarity: 'Epic',
    description: 'Duplicate one card in your hand on the next turn.',
    effects: [{ target: 'self', when: 'immediately', effect: 'duplicate_card', value: 1 }],
  },
  {
    name: 'Jackpot',
    rarity: 'Epic',
    description: 'When you draw a 7 or 11, draw two additional cards.',
    effects: [
      { target: 'self', when: 'draw', effect: 'draw_card', condition: 'if_card_7', value: 2 },
      { target: 'self', when: 'draw', effect: 'draw_card', condition: 'if_card_11', value: 2 },
    ],
  },
  {
    name: 'Karma Hit',
    rarity: 'Epic',
    description: 'If you bust, redirect the damage to the opponent instead.',
    effects: [{ target: 'opponent', when: 'on_bust', effect: 'damage', value: 0 }],
  },
  {
    name: 'Glass Cannon',
    rarity: 'Epic',
    description: 'Double your next attack and forgo defense next round.',
    effects: [
      { target: 'self', when: 'immediately', effect: 'double_damage', value: 2 },
      { target: 'self', when: 'immediately', effect: 'skip_turn', value: 1 },
    ],
  },
  {
    name: 'Echo Draw',
    rarity: 'Epic',
    description: 'Play the next card you draw twice.',
    effects: [{ target: 'self', when: 'draw', effect: 'duplicate_card', value: 1 }],
  },
  {
    name: 'Out of Sync',
    rarity: 'Epic',
    description: "Resolve the opponent's cards in a random order.",
    effects: [{ target: 'opponent', when: 'immediately', effect: 'shuffle_opponent', value: 1 }],
  },
  {
    name: 'Risk Spike',
    rarity: 'Epic',
    description: 'Change the opponent’s bust threshold to 20 instead of 21.',
    effects: [{ target: 'opponent', when: 'immediately', effect: 'set_card_value', value: 20 }],
  },
  {
    name: "Dealer's Whisper",
    rarity: 'Epic',
    description: 'Force the dealer to reveal their next card.',
    effects: [{ target: 'opponent', when: 'immediately', effect: 'reveal_cards', value: 1 }],
  },
  {
    name: 'False Confidence',
    rarity: 'Epic',
    description: "Negate the opponent's next modifier card.",
    effects: [{ target: 'opponent', when: 'immediately', effect: 'negate_modifier', value: 1 }],
  },
  {
    name: 'Decoy',
    rarity: 'Epic',
    description: 'Force the opponent to draw one extra card immediately.',
    effects: [{ target: 'opponent', when: 'immediately', effect: 'draw_card', value: 1 }],
  },
  {
    name: 'Split Strike',
    rarity: 'Epic',
    description: 'If you drew two cards with the same value, attack twice at resolution.',
    effects: [
      {
        target: 'self',
        when: 'game_end',
        effect: 'double_damage',
        condition: 'if_total_between_2_99',
        value: 2,
      },
    ],
  },
  {
    name: 'Memory Play',
    rarity: 'Epic',
    description: 'Replay the last card you played during this run.',
    effects: [{ target: 'self', when: 'immediately', effect: 'duplicate_card', value: 1 }],
  },
  {
    name: 'Double or Nothing',
    rarity: 'Epic',
    description: 'Double your damage on a win; take 5 damage on a loss.',
    effects: [
      { target: 'self', when: 'on_win', effect: 'double_damage', value: 2 },
      { target: 'self', when: 'on_lose', effect: 'damage', value: 5 },
    ],
  },
  {
    name: 'Flare Attack',
    rarity: 'Epic',
    description: 'Deal bonus burn damage when your total ends in 9.',
    effects: [
      { target: 'opponent', when: 'game_end', effect: 'damage', condition: 'if_total_9', value: 3 },
    ],
  },
  {
    name: 'Early Exit',
    rarity: 'Epic',
    description: 'Leave the round early to avoid damage from resolution.',
    effects: [{ target: 'self', when: 'immediately', effect: 'skip_turn', value: 1 }],
  },
  {
    name: 'Panic Trigger',
    rarity: 'Epic',
    description: 'Stun the opponent next turn if they draw three or more cards.',
    effects: [
      {
        target: 'opponent',
        when: 'draw',
        effect: 'stun',
        condition: 'if_total_between_3_99',
        value: 1,
      },
    ],
  },
  {
    name: 'Rewire',
    rarity: 'Epic',
    description: "Shuffle and redraw the opponent's hand.",
    effects: [{ target: 'opponent', when: 'immediately', effect: 'shuffle_opponent', value: 1 }],
  },
  {
    name: 'Anchor Card',
    rarity: 'Epic',
    description: 'Lock a card in your hand so it cannot be changed.',
    effects: [{ target: 'self', when: 'immediately', effect: 'lock_draw', value: 1 }],
  },
];

export default ModifierCards;
