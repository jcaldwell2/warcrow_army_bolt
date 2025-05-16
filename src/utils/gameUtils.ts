
import { GameState, GameEvent, Player, Turn } from '@/types/game';

// Get all round numbers that have events or scores in the game state
export const getAllRoundNumbersFromState = (state: GameState): number[] => {
  const rounds = new Set<number>();
  
  // Collect rounds from game events
  state.gameEvents.forEach(event => {
    if (event.roundNumber !== undefined) {
      rounds.add(event.roundNumber);
    }
  });
  
  // Collect rounds from player scores
  Object.values(state.players).forEach(player => {
    if (player.roundScores) {
      Object.keys(player.roundScores).forEach(roundStr => {
        const roundNum = parseInt(roundStr, 10);
        if (!isNaN(roundNum)) {
          rounds.add(roundNum);
        }
      });
    }
  });
  
  // Return as a sorted array
  return Array.from(rounds).sort((a, b) => a - b);
};

// Function to get all round numbers from turns array
export const getAllRoundNumbers = (turns: Turn[]): number[] => {
  const rounds = new Set<number>();
  
  // Collect round numbers from turns
  turns.forEach(turn => {
    // Check if turn and roundNumber exist before accessing
    if (turn && typeof turn.roundNumber === 'number') {
      rounds.add(turn.roundNumber);
    }
  });
  
  // Return as a sorted array
  return Array.from(rounds).sort((a, b) => a - b);
};

// Sort players by their total score in descending order
export const sortPlayersByScore = (players: Player[]): Player[] => {
  return [...players].sort((a, b) => {
    // Default to 0 if score is undefined
    const scoreA = a.score || 0;
    const scoreB = b.score || 0;
    return scoreB - scoreA;
  });
};
