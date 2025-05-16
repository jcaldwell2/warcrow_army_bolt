
import React from 'react';
import { motion } from 'framer-motion';
import { Player, GameState } from '@/types/game';
import GameSummaryHeader from '@/components/play/GameSummaryHeader';
import FinalScores from '@/components/play/FinalScores';
import RoundDetails from '@/components/play/RoundDetails';
import { getAllRoundNumbers, sortPlayersByScore } from '@/utils/gameUtils';

interface GameSummaryProps {
  gameState: GameState;
  onEditRoundScore: (roundNumber: number) => void;
}

const GameSummary: React.FC<GameSummaryProps> = ({ gameState, onEditRoundScore }) => {
  const players = Object.values(gameState.players) as Player[];
  const orderedPlayers = sortPlayersByScore(players);
  const winner = orderedPlayers.length > 0 ? orderedPlayers[0] : undefined;
  
  // Get all round numbers from game events and turns
  // Always include rounds 1-3 in the game summary
  const existingRounds = getAllRoundNumbers(gameState.turns || []);
  const rounds = [...new Set([...existingRounds, 1, 2, 3])].sort((a, b) => a - b);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <GameSummaryHeader gameState={gameState} winner={winner} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinalScores players={players} gameState={gameState} />
        
        <RoundDetails 
          gameState={gameState}
          players={players}
          rounds={rounds}
          onEditRoundScore={onEditRoundScore}
        />
      </div>
    </motion.div>
  );
};

export default GameSummary;
