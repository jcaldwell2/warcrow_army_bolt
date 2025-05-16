import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';
import { ArrowRight, Star, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MissionScoring from '@/components/play/MissionScoring';
import { useGameScoring } from '@/hooks/useGameScoring';
import InitiativeDialog from '@/components/play/InitiativeDialog';

const Game = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [currentRound, setCurrentRound] = useState(1);
  const [showInitiativeDialog, setShowInitiativeDialog] = useState(false);
  const [initiativePlayerId, setInitiativePlayerId] = useState<string>('');
  const [gameTime, setGameTime] = useState<string>('00:00:00');
  
  const {
    missionScoring,
    scoredFogMarkers,
    toggleScoringCondition,
    calculateVP,
    updateScores
  } = useGameScoring(currentRound);
  
  useEffect(() => {
    if (state.currentPhase !== 'game') {
      navigate('/setup');
    }
  }, [state.currentPhase, navigate]);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (state.gameStartTime) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const elapsed = now - state.gameStartTime!;
        
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / 1000 / 60) % 60);
        const hours = Math.floor(elapsed / 1000 / 60 / 60);
        
        const formattedTime = 
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        setGameTime(formattedTime);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.gameStartTime]);
  
  const handleEndGame = () => {
    dispatch({ type: 'SET_GAME_END_TIME', payload: Date.now() });
    dispatch({ type: 'SET_PHASE', payload: 'scoring' });
    navigate('/summary');
  };

  const handleScoreRound = () => {
    updateScores();
    
    if (currentRound < 3) {
      setShowInitiativeDialog(true);
    } else {
      toast.success(`Final round ${currentRound} scored! The game is complete.`);
      handleEndGame();
    }
  };
  
  const handleConfirmInitiative = () => {
    if (initiativePlayerId) {
      setCurrentRound(prev => prev + 1);
      
      dispatch({
        type: 'ADD_GAME_EVENT',
        payload: {
          id: `round-${currentRound}-initiative`,
          type: 'initiative',
          playerId: initiativePlayerId,
          roundNumber: currentRound + 1,
          description: `${state.players[initiativePlayerId]?.name} has initiative for round ${currentRound + 1}`,
          timestamp: Date.now()
        }
      });
      
      toast.success(`Round ${currentRound} scored successfully. ${state.players[initiativePlayerId]?.name} has initiative for round ${currentRound + 1}`);
      setShowInitiativeDialog(false);
    } else {
      toast.error("Please select a player with initiative");
    }
  };

  const getMissionImagePath = () => {
    if (!state.mission?.title) return null;
    
    const MISSION_IMAGES: Record<string, string> = {
      'Consolidated Progress': '/art/missions/consolidated_progress.jpg',
      'Take Positions': '/art/missions/take_positions.jpg',
      'Fog of Death': '/art/missions/fog_of_death.jpg',
    };
    
    return MISSION_IMAGES[state.mission.title] || null;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-warcrow-gold">Game In Progress</h1>
            <Button onClick={handleEndGame}>
              End Game & Score
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <Card className="p-6 border border-border/40 shadow-sm bg-black/80">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-warcrow-gold">Game Information</h2>
                
                <div className="flex flex-col md:flex-row mb-6">
                  <div className="space-y-2 flex-1 text-warcrow-text">
                    {state.mission && (
                      <p><strong className="text-warcrow-text">Mission:</strong> {state.mission.name}</p>
                    )}
                    <p><strong className="text-warcrow-text">Players:</strong> {Object.values(state.players).map(p => p.name).join(' vs ')}</p>
                    <p><strong className="text-warcrow-text">Current Turn:</strong> {state.currentTurn}</p>
                    <p><strong className="text-warcrow-text">Current Round:</strong> {currentRound} of 3</p>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-warcrow-gold" />
                      <strong className="text-warcrow-text">Game Time:</strong> <span className="ml-2 text-warcrow-gold">{gameTime}</span>
                    </p>
                  </div>
                  
                  {state.mission && getMissionImagePath() && (
                    <div className="mt-4 md:mt-0 md:ml-4 md:w-1/3 flex-shrink-0 flex justify-end">
                      <img 
                        src={getMissionImagePath() || ''} 
                        alt={`${state.mission.name} Map`}
                        className="w-full rounded-lg shadow-lg object-contain h-[160px]"
                      />
                    </div>
                  )}
                </div>
              </div>
               
              <div>
                <div className="flex justify-between items-center mb-4 border-t pt-4 border-border/20">
                  <h2 className="text-xl font-semibold text-warcrow-gold">Round {currentRound} Scoring</h2>
                </div>
                
                {state.mission ? (
                  <MissionScoring 
                    mission={state.mission}
                    players={state.players}
                    missionScoring={missionScoring}
                    currentRound={currentRound}
                    toggleScoringCondition={toggleScoringCondition}
                    calculateVP={calculateVP}
                    scoredFogMarkers={scoredFogMarkers}
                  />
                ) : (
                  <div className="text-center py-8 text-warcrow-text">
                    No mission selected
                  </div>
                )}
              </div>
              
              <div className="flex justify-center mt-12 pb-4">
                <Button 
                  onClick={handleScoreRound}
                  size="lg"
                  className="flex items-center gap-2 px-12 py-7 text-lg"
                >
                  <Star className="h-6 w-6" />
                  <span>Score Round {currentRound}</span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <InitiativeDialog
        open={showInitiativeDialog}
        onOpenChange={setShowInitiativeDialog}
        players={state.players}
        currentRound={currentRound + 1}
        initiativePlayerId={initiativePlayerId}
        setInitiativePlayerId={setInitiativePlayerId}
        onConfirm={handleConfirmInitiative}
      />
    </div>
  );
};

export default Game;
