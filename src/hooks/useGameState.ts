import { useContext } from 'react';
import { GameContext } from '../store/gameStore';

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}
