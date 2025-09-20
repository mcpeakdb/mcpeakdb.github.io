import type { GameState } from './useBlackjackBlitz';
import useBlackjack from './useBlackjack';
import type { Effect } from '@/assets/blackjack-blitz/modifier-cards';

export const applyEffect = (
  effect: Effect,
  isPlayer: boolean,
  gameState: GameState,
  blackjackState: typeof useBlackjack,
) => {
  // determine actual target (true = player, false = computer)
  const targetIsPlayer = effect.target === 'self' ? isPlayer : !isPlayer;

  // safe access helpers for composable refs or gameState fallbacks
  const getHandLength = (player: boolean) => {
    try {
      // composable may expose playerHand/computerHand refs
      if (blackjackState && blackjackState.playerHand && blackjackState.playerHand.value) {
        return player
          ? blackjackState.playerHand.value.length
          : blackjackState.computerHand.value.length;
      }
    } catch {}
  };

  // apply damage: consume armor then health; fallback to pending damage
  const applyDamage = (amount: number, targetPlayer: boolean) => {
    amount = amount ?? 0;
    const armorKey = targetPlayer ? 'playerArmor' : 'computerArmor';
    const healthKey = targetPlayer ? 'playerChips' : 'computerChips';

    const armor = gameState[armorKey] ?? 0;
    if (armor >= amount) {
      gameState[armorKey] = armor - amount;
      return;
    }

    const remaining = Math.max(0, amount - armor);
    gameState[armorKey] = 0;

    gameState[healthKey] = Math.max(0, (gameState[healthKey] ?? 0) - remaining);
  };

  // Armor management
  const addArmor = (amount: number, isPlayer: boolean): void => {
    if (isPlayer) {
      gameState.playerArmor = (gameState.playerArmor ?? 0) + amount;
    } else {
      gameState.computerArmor = (gameState.computerArmor ?? 0) + amount;
    }
  };

  switch (effect.effect) {
    case 'armor_add':
      addArmor(effect.value ?? 1, targetIsPlayer);
      break;

    case 'armor_add_hand':
      addArmor(getHandLength(targetIsPlayer) ?? 0, targetIsPlayer);
      break;

    case 'draw_modifier':
      for (let i = 0; i < (effect.value ?? 1); i++) {
        // blackjackState.drawModifier(targetIsPlayer);
      }
      break;

    case 'reveal_cards':
      for (let i = 0; i < (effect.value ?? 1); i++) {
        // blackjackState.revealCards();
      }
      break;

    case 'damage':
      applyDamage(effect.value ?? 0, targetIsPlayer);
      break;

    default:
      // unhandled active effect: record for game loop to process
      break;
  }
};
