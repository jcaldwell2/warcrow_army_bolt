
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Container } from '@/components/ui/custom';
import GameSummary from '@/components/play/GameSummary';
import GameResults from '@/components/play/GameResults';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { getAllRoundNumbersFromState } from '@/utils/gameUtils';
import { Button } from '@/components/ui/button';

const Summary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [currentRound, setCurrentRound] = useState(3); // Default to 3 rounds
  
  useEffect(() => {
    // Only allow access to summary page if a game has been started
    if (!state.mission) {
      navigate('/play');
    }
    
    // Set gameEndTime when arriving at summary page if not already set
    if (!state.gameEndTime) {
      dispatch({ 
        type: 'SET_GAME_END_TIME', 
        payload: Date.now() 
      });
    }
    
    // Determine the current round based on game state
    const rounds = getAllRoundNumbersFromState(state);
    if (rounds.length > 0) {
      setCurrentRound(Math.max(...rounds));
    }
  }, [state, navigate, dispatch]);
  
  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/play');
  };
  
  const handleEditRound = (roundNumber: number) => {
    // Navigate to the scoring page for the selected round
    navigate(`/scoring?round=${roundNumber}`);
  };
  
  if (!state.mission) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen py-6 bg-warcrow-background">
      <Container className="max-w-full px-4">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6">
            <GameSummary 
              gameState={state}
              onEditRoundScore={handleEditRound}
            />
            <GameResults />
          </div>
          
          {/* Move the New Game button to the bottom of the page */}
          <div className="flex justify-center mt-16 pt-8 border-t border-warcrow-gold/20">
            <Button
              onClick={handleNewGame}
              className="px-6 py-3 bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90 rounded-lg transition-colors font-medium"
            >
              Start New Game
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Summary;
