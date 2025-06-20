import { computed, reactive } from 'vue';
import useBlackjack from './useBlackjack';
import modifierCardsData from '@/assets/blackjack-blitz/modifier-cards.json';
import gameConfig from '@/assets/blackjack-blitz/game-config.json';
import { applyEffect } from './blackjackBlitz.helpers';

export interface ModifierCard {
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic';
  id?: string;
  description: string;
  effects: Effect[];
  isActive: boolean;
}

export interface Effect {
  target: 'self' | 'opponent';
  effect: string;
  when: 'on_bust' | 'draw' | 'immediately';
  value?: number;
}

export interface GameState {
  playerChips: number;
  playerArmor: number;
  computerChips: number;
  computerArmor: number;
  maxChips: number;
  playerModifierCards: ModifierCard[];
  computerModifierCards: ModifierCard[];
  activePlayerModifiers: ModifierCard[];
  activeComputerModifiers: ModifierCard[];
  currentPhase: 'setup' | 'modifier-selection' | 'blackjack' | 'damage-calculation' | 'game-over';
  roundNumber: number;
  isPlayerTurn: boolean;
  canPlayModifier: boolean;
  bustHandled: boolean;
  lastDamageBlocked: { player: number; computer: number };
}

// Initialize game state
const gameState = reactive<GameState>({
  playerChips: gameConfig.base_chips,
  playerArmor: 0,
  computerChips: gameConfig.base_chips,
  computerArmor: 0,
  maxChips: gameConfig.base_chips,
  playerModifierCards: [],
  computerModifierCards: [],
  activePlayerModifiers: [],
  activeComputerModifiers: [],
  currentPhase: 'setup',
  roundNumber: 1,
  isPlayerTurn: true,
  canPlayModifier: true,
  bustHandled: false,
  lastDamageBlocked: { player: 0, computer: 0 },
});

// Use the base blackjack composable
const blackjack = useBlackjack;

// Modifier card management
function generateModifierDeck(): ModifierCard[] {
  return modifierCardsData
    .map((card, index) => ({
      ...card,
      id: `${card.name}-${index}`,
    }))
    .filter((card) => card.isActive) as ModifierCard[];
}

function drawModifierCards(count: number = 3): ModifierCard[] {
  const deck = generateModifierDeck();
  const shuffled = deck.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function dealModifierCards(): void {
  gameState.playerModifierCards = drawModifierCards(3);
  gameState.computerModifierCards = drawModifierCards(3);
}

function applyArmorProtection(
  damage: number,
  isPlayer: boolean,
): { finalDamage: number; blockedDamage: number } {
  if (isPlayer) {
    const blockedDamage = Math.min(damage, gameState.playerArmor);
    const finalDamage = damage - blockedDamage;
    gameState.playerArmor -= blockedDamage;
    gameState.lastDamageBlocked.player = blockedDamage;
    return { finalDamage, blockedDamage };
  } else {
    const blockedDamage = Math.min(damage, gameState.computerArmor);
    const finalDamage = damage - blockedDamage;
    gameState.computerArmor -= blockedDamage;
    gameState.lastDamageBlocked.computer = blockedDamage;
    return { finalDamage, blockedDamage };
  }
}

// Chips management
function calculateDamage(handTotal: number, isBust: boolean): number {
  let damage = 0;
  if (isBust) {
    damage += gameConfig.damage_tiers.bust;
  }

  if (handTotal === 21) {
    damage += gameConfig.damage_tiers['21'];
  } else if (handTotal >= 18 && handTotal <= 20) {
    damage += gameConfig.damage_tiers['18-20'];
  } else if (handTotal >= 15 && handTotal <= 17) {
    damage += gameConfig.damage_tiers['15-17'];
  } else if (handTotal >= 12 && handTotal <= 14) {
    damage += gameConfig.damage_tiers['12-14'];
  } else if (handTotal >= 9 && handTotal <= 11) {
    damage += gameConfig.damage_tiers['1-11'];
  }

  return damage;
}

function applyDamage(
  damage: number,
  isPlayer: boolean,
): { finalDamage: number; blockedDamage: number } {
  // Apply armor protection first
  const { finalDamage, blockedDamage } = applyArmorProtection(damage, isPlayer);

  // Apply remaining damage to chips
  if (isPlayer) {
    gameState.playerChips = Math.max(0, gameState.playerChips - finalDamage);
  } else {
    gameState.computerChips = Math.max(0, gameState.computerChips - finalDamage);
  }

  return { finalDamage, blockedDamage };
}

// Modifier card effects
function applyModifierEffect(card: ModifierCard, isPlayer: boolean): void {
  // Add to active modifiers
  if (isPlayer) {
    gameState.activePlayerModifiers.push(card);
  } else {
    gameState.activeComputerModifiers.push(card);
  }

  // Apply specific card effects
  for (const effect in card.effects) {
    const effectData = card.effects[effect];
    if (effectData.when === 'immediately') {
      if (effectData.target === 'self') {
        applyEffect(effectData, true, gameState, blackjack);
      } else if (effectData.target === 'opponent') {
        applyEffect(effectData, false, gameState, blackjack);
      }
    }
  }
}

// Game flow management
async function startNewRound(): Promise<void> {
  gameState.currentPhase = 'setup';
  gameState.roundNumber++;
  gameState.isPlayerTurn = true;
  gameState.canPlayModifier = true;
  gameState.bustHandled = false;

  // Clear damage blocked tracking
  gameState.lastDamageBlocked = { player: 0, computer: 0 };

  // Clear active modifiers from previous round
  gameState.activePlayerModifiers = [];
  gameState.activeComputerModifiers = [];

  // Reset blackjack state for new round
  blackjack.reset();

  // Deal new modifier cards
  dealModifierCards();

  gameState.currentPhase = 'modifier-selection';
}

function playModifierCard(card: ModifierCard, isPlayer: boolean = true): void {
  if (!gameState.canPlayModifier) return;

  if (isPlayer) {
    const cardIndex = gameState.playerModifierCards.findIndex((c) => c.id === card.id);
    if (cardIndex !== -1) {
      gameState.playerModifierCards.splice(cardIndex, 1);
      applyModifierEffect(card, isPlayer);
    }
  } else {
    const cardIndex = gameState.computerModifierCards.findIndex((c) => c.id === card.id);
    if (cardIndex !== -1) {
      gameState.computerModifierCards.splice(cardIndex, 1);
      applyModifierEffect(card, isPlayer);
    }
  }
}

async function startBlackjackPhase(): Promise<void> {
  gameState.currentPhase = 'blackjack';
  gameState.canPlayModifier = false;
  gameState.bustHandled = false;
  await blackjack.dealHand();
}

function blitzHit(): void {
  gameState.canPlayModifier = true;
  // Allow modifier card play before hitting
  // The actual hit will be called after modifier selection
}

function executeHit(): void {
  blackjack.hit();
  gameState.canPlayModifier = false;

  // Check if player busted and handle it in Blitz mode
  if (blackjack.playerHandTotal.value > 21) {
    handlePlayerBust();
  }
}

async function handlePlayerBust(): Promise<void> {
  if (gameState.bustHandled) return;
  gameState.bustHandled = true;

  if (gameState.playerModifierCards.length > 0) {
    gameState.playerModifierCards.forEach((card) => {
      card.effects.forEach((effectData) => {
        if (effectData.when === 'on_bust') {
          if (effectData.target === 'self') {
            applyEffect(effectData, true, gameState, useBlackjack);
          } else if (effectData.target === 'opponent') {
            applyEffect(effectData, false, gameState, blackjack);
          }
        }
      });
    });
  }

  // Wait a moment for the bust to be visible
  setTimeout(async () => {
    // Force show computer hand and end the blackjack round
    blackjack.gameState.value.showComputerHand = true;
    blackjack.gameState.value.isGameOver = true;
    blackjack.gameState.value.isDealt = false;

    // Calculate round result
    await calculateRoundResult();
  }, 1500);
}

async function blitzStand(): Promise<void> {
  gameState.canPlayModifier = true;
  // Allow modifier card play before standing
  // The actual stand will be called after modifier selection
}

async function executeStand(): Promise<void> {
  await blackjack.endTurn();
  gameState.canPlayModifier = false;
  await calculateRoundResult();
}

async function calculateRoundResult(): Promise<void> {
  gameState.currentPhase = 'damage-calculation';

  const playerTotal = blackjack.playerHandTotal.value;
  const computerTotal = blackjack.computerHandTotal.value;
  const playerBust = playerTotal > 21;
  const computerBust = computerTotal > 21;

  // Calculate damage based on winner's hand
  let damageAmount = 0;
  let playerTakesDamage = false;

  // Determine winner and calculate damage based on winner's hand
  if (playerBust && !computerBust) {
    // Player busts, computer wins
    damageAmount = calculateDamage(computerTotal, playerBust);
    playerTakesDamage = true;
  } else if (computerBust && !playerBust) {
    // Computer busts, player wins
    damageAmount = calculateDamage(playerTotal, computerBust);
    playerTakesDamage = false;
  } else if (!playerBust && !computerBust) {
    if (playerTotal > computerTotal) {
      // Player wins with higher total
      damageAmount = calculateDamage(playerTotal, false);
      playerTakesDamage = false;
    } else if (computerTotal > playerTotal) {
      // Computer wins with higher total
      damageAmount = calculateDamage(computerTotal, false);
      playerTakesDamage = true;
    }
    // Tie = no damage
  } else if (playerBust && computerBust) {
    // Both bust - could be tie or special rule
    // For now, no damage on double bust
    damageAmount = 0;
  }

  // Apply damage to loser (with armor protection)
  if (damageAmount > 0) {
    applyDamage(damageAmount, playerTakesDamage);
  }

  // Check for game over
  if (gameState.playerChips <= 0 || gameState.computerChips <= 0) {
    gameState.currentPhase = 'game-over';
  } else {
    // Prepare for next round with a longer delay to show results
    setTimeout(() => {
      if (gameState.currentPhase === 'damage-calculation') {
        startNewRound();
      }
    }, 3000); // Increased delay to 3 seconds
  }
}

// Computer AI for modifier cards
function computerPlayModifier(): void {
  if (gameState.computerModifierCards.length > 0 && Math.random() > 0.3) {
    // Simple AI: 70% chance to play a random modifier, prefer armor cards when low on chips
    let selectedCard;

    if (gameState.computerChips < gameState.maxChips * 0.5) {
      // When low on chips, prefer defensive cards
      const defensiveCards = gameState.computerModifierCards.filter(
        (card) =>
          card.name.includes('Armor') ||
          card.name.includes('Shield') ||
          card.name.includes('Defense') ||
          card.name.includes('Safe'),
      );
      selectedCard =
        defensiveCards.length > 0
          ? defensiveCards[Math.floor(Math.random() * defensiveCards.length)]
          : gameState.computerModifierCards[
              Math.floor(Math.random() * gameState.computerModifierCards.length)
            ];
    } else {
      selectedCard =
        gameState.computerModifierCards[
          Math.floor(Math.random() * gameState.computerModifierCards.length)
        ];
    }

    playModifierCard(selectedCard, false);
  }
}

function resetGame(): void {
  gameState.playerChips = gameConfig.base_chips;
  gameState.playerArmor = 0;
  gameState.computerChips = gameConfig.base_chips;
  gameState.computerArmor = 0;
  gameState.playerModifierCards = [];
  gameState.computerModifierCards = [];
  gameState.activePlayerModifiers = [];
  gameState.activeComputerModifiers = [];
  gameState.currentPhase = 'setup';
  gameState.roundNumber = 1;
  gameState.isPlayerTurn = true;
  gameState.canPlayModifier = true;
  gameState.lastDamageBlocked = { player: 0, computer: 0 };

  blackjack.reset();
}

// Computed properties
const isGameOver = computed(
  () =>
    gameState.currentPhase === 'game-over' ||
    gameState.playerChips <= 0 ||
    gameState.computerChips <= 0,
);

const winner = computed(() => {
  if (!isGameOver.value) return null;
  if (gameState.playerChips <= 0) return 'computer';
  if (gameState.computerChips <= 0) return 'player';
  return null;
});

const playerChipsPercentage = computed(() => (gameState.playerChips / gameState.maxChips) * 100);

const computerChipsPercentage = computed(
  () => (gameState.computerChips / gameState.maxChips) * 100,
);

// Initialize game
function initializeBlitzGame(): void {
  resetGame();
  // Don't call startNewRound here, let the component handle the first round
  gameState.currentPhase = 'setup';
  dealModifierCards();
  gameState.currentPhase = 'modifier-selection';
}

export default {
  // Game state
  gameState: gameState,
  isGameOver,
  winner,
  playerChipsPercentage,
  computerChipsPercentage,

  // Blackjack properties (pass through)
  blackjackState: blackjack.gameState,
  playerHand: blackjack.playerHand,
  playerHandTotal: blackjack.playerHandTotal,
  computerHand: blackjack.computerHand,
  computerHandTotal: blackjack.computerHandTotal,
  didPlayerWin: blackjack.didPlayerWin,
  cardBack: blackjack.cardBack,
  tableTheme: blackjack.tableTheme,

  // Game management
  initializeBlitzGame,
  resetGame,
  startNewRound,

  // Modifier card actions
  playModifierCard,
  computerPlayModifier,

  // Enhanced blackjack actions
  blitzHit,
  executeHit,
  blitzStand,
  executeStand,
  startBlackjackPhase,

  // Armor management
  applyArmorProtection,

  // Utility functions
  calculateDamage,
  applyDamage,
};
