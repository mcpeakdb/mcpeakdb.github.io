import { computed, reactive } from 'vue';
import useBlackjack from './useBlackjack';
import modifierCardsData, {
  type EffectWhen,
  type ModifierCardData,
} from '@/assets/blackjack-blitz/modifier-cards';
import gameConfig from '@/assets/blackjack-blitz/game-config.json';
import { applyEffect } from './blackjackBlitz.helpers';

export interface GameState {
  playerChips: number;
  playerArmor: number;
  computerChips: number;
  computerArmor: number;
  maxChips: number;
  playerModifierCards: ModifierCardData[];
  activePlayerModifiers: ModifierCardData[];
  currentPhase: 'setup' | 'modifier-selection' | 'blackjack' | 'damage-calculation' | 'game-over';
  roundNumber: number;
  isPlayerTurn: boolean;
  canPlayModifier: boolean;
  lastDamageBlocked: { player: number; computer: number };
  lastDamageTaken: { player: number; computer: number };
}

// Initialize game state
const gameState = reactive<GameState>({
  playerChips: gameConfig.base_chips,
  playerArmor: 0,
  computerChips: gameConfig.base_chips,
  computerArmor: 0,
  maxChips: gameConfig.base_chips,
  playerModifierCards: [],
  activePlayerModifiers: [],
  currentPhase: 'setup',
  roundNumber: 1,
  isPlayerTurn: true,
  canPlayModifier: true,
  lastDamageBlocked: { player: 0, computer: 0 },
  lastDamageTaken: { player: 0, computer: 0 },
});

// Use the base blackjack composable
const blackjack = useBlackjack;

// Modifier card management
function generateModifierDeck(): ModifierCardData[] {
  return modifierCardsData
    .map((card, index) => ({
      ...card,
      id: `${card.name}-${index}`,
    }))
    .filter((card) => card.isActive) as ModifierCardData[];
}

function drawModifierCards(count: number = 3): ModifierCardData[] {
  const deck = generateModifierDeck();
  const shuffled = deck.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function dealModifierCards(): void {
  gameState.playerModifierCards = drawModifierCards(3);
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
    gameState.lastDamageTaken.player = finalDamage;
  } else {
    gameState.computerChips = Math.max(0, gameState.computerChips - finalDamage);
    gameState.lastDamageTaken.computer = finalDamage;
  }

  return { finalDamage, blockedDamage };
}

// Modifier card effects
function applyModifierEffect(card: ModifierCardData): void {
  // Add to active modifiers

  gameState.activePlayerModifiers.push(card);

  // Apply specific card effects
  processEffects('immediately', card, gameState);
}

async function startNewRound(): Promise<void> {
  gameState.currentPhase = 'setup';
  gameState.roundNumber++;
  gameState.isPlayerTurn = true;
  gameState.canPlayModifier = true;

  // Clear damage blocked tracking
  gameState.lastDamageBlocked = { player: 0, computer: 0 };

  // Clear active modifiers from previous round
  gameState.activePlayerModifiers = [];

  // Deal new modifier cards
  dealModifierCards();

  gameState.currentPhase = 'modifier-selection';
}

function playModifierCard(card: ModifierCardData): void {
  if (!gameState.canPlayModifier) return;

  const cardIndex = gameState.playerModifierCards.findIndex((c) => c.id === card.id);
  if (cardIndex !== -1) {
    gameState.playerModifierCards.splice(cardIndex, 1);
    applyModifierEffect(card);
  }
}

async function startBlackjackPhase(): Promise<void> {
  gameState.currentPhase = 'blackjack';
  gameState.canPlayModifier = false;
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
  if (gameState.activePlayerModifiers.length > 0) {
    gameState.activePlayerModifiers.forEach((card) => {
      processEffects('on_bust', card, gameState);
    });

    gameState.activePlayerModifiers.forEach((card) => {
      processEffects('game_end', card, gameState);
    });
  }

  // Force show computer hand and end the blackjack round
  blackjack.gameState.value.showComputerHand = true;
  blackjack.gameState.value.isGameOver = true;
  blackjack.gameState.value.isDealt = false;

  // Calculate round result
  await calculateRoundResult();
}

async function blitzStand(): Promise<void> {
  gameState.canPlayModifier = true;
  // Allow modifier card play before standing
  // The actual stand will be called after modifier selection
}

async function executeStand(): Promise<void> {
  gameState.activePlayerModifiers.forEach((card) => {
    processEffects('game_end', card, gameState);
  });

  await blackjack.endTurn();
  gameState.canPlayModifier = false;
  await calculateRoundResult();
}

function processEffects(when: EffectWhen, card: ModifierCardData, gameState: GameState): void {
  card.effects?.forEach((effectData) => {
    if (effectData.when === when) {
      if (effectData.target === 'self') {
        applyEffect(effectData, true, gameState, useBlackjack);
      } else if (effectData.target === 'opponent') {
        applyEffect(effectData, false, gameState, blackjack);
      }
    }
  });
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

function resetGame(): void {
  gameState.playerChips = gameConfig.base_chips;
  gameState.playerArmor = 0;
  gameState.computerChips = gameConfig.base_chips;
  gameState.computerArmor = 0;
  gameState.playerModifierCards = [];
  gameState.activePlayerModifiers = [];
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
  gameState,
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
