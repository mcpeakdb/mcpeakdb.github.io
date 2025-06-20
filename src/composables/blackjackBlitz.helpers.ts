import type { Effect, GameState } from './useBlackjackBlitz';
import useBlackjack from './useBlackjack';

export const applyEffect = (
  effect: Effect,
  isPlayer: boolean,
  gameState: GameState,
  blackjackState: typeof useBlackjack,
) => {
  const splitEffect = effect.effect.split('_');
  if (splitEffect[0] === 'armor') {
    if (splitEffect[1] === 'add') {
      if (splitEffect[2] === 'hand') {
        addArmor(blackjackState.playerHand.value.length, isPlayer, gameState);
        return;
      }

      addArmor(effect.value ?? 1, isPlayer, gameState);
    }
  }
};

// Armor management
function addArmor(amount: number, isPlayer: boolean, gameState: GameState): void {
  if (isPlayer) {
    gameState.playerArmor += amount;
  } else {
    gameState.computerArmor += amount;
  }
}
