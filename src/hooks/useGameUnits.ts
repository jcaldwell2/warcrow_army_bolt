
import { useGame } from '@/context/GameContext';
import { Unit } from '@/types/game';

export const useGameUnits = () => {
  const { state } = useGame();
  
  // Get all units for the game
  const getAllUnits = (): Unit[] => {
    if (state.units && state.units.length > 0) {
      console.log(`[useGameUnits] Found ${state.units.length} units in game state`);
      return state.units;
    }
    
    // If no units are defined, create default ones based on players
    console.log(`[useGameUnits] No units in state, creating defaults from ${Object.keys(state.players || {}).length} players`);
    
    const defaultUnits = Object.entries(state.players || {}).flatMap(([playerId, player]) => [
      { id: `${playerId}-1`, name: `${player.name}'s Unit 1`, player: playerId },
      { id: `${playerId}-2`, name: `${player.name}'s Unit 2`, player: playerId },
      { id: `${playerId}-3`, name: `${player.name}'s Unit 3`, player: playerId }
    ]);
    
    console.log(`[useGameUnits] Created ${defaultUnits.length} default units`);
    return defaultUnits;
  };
  
  return { getAllUnits };
};
