
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Scoring = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  
  const handleContinueToSummary = () => {
    dispatch({ type: 'SET_PHASE', payload: 'summary' });
    navigate('/summary');
  };
  
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container py-8 max-w-5xl mx-auto"
    >
      <h1 className="text-center mb-8 text-2xl font-bold text-warcrow-gold">Final Scoring</h1>
      
      <div className="bg-warcrow-background border border-warcrow-gold/40 rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-warcrow-gold">Game Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {Object.entries(state.players).map(([playerId, player]) => (
            <div key={playerId} className="bg-warcrow-accent/30 rounded-lg p-4 border border-warcrow-gold/20">
              <div className="text-lg font-semibold mb-2 text-warcrow-text">{player.name}</div>
              <div className="flex justify-between items-center">
                <span className="text-warcrow-text">Final Score:</span>
                <span className="text-2xl font-bold text-warcrow-gold">{player.score}</span>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleContinueToSummary}
          className="w-full bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
        >
          Continue to Game Summary
        </Button>
      </div>
    </motion.div>
  );
};

export default Scoring;
