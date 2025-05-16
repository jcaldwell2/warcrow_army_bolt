
import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { toast } from 'sonner';

export const useGameScoring = (currentRound: number) => {
  const { state, dispatch } = useGame();
  
  const [missionScoring, setMissionScoring] = useState<Record<string, Record<string, boolean>>>({});
  const [scoredFogMarkers, setScoredFogMarkers] = useState<Record<string, boolean>>({
    'fogContact1': false,
    'fogContact2': false,
    'fogContact3': false,
    'fogContact4': false
  });

  // Initialize mission scoring
  useEffect(() => {
    const playerIds = Object.keys(state.players);
    const initialScoring: Record<string, Record<string, boolean>> = {};
    
    // Init scoring based on mission type
    if (state.mission?.id === 'consolidated-progress') {
      playerIds.forEach(playerId => {
        initialScoring[playerId] = {
          'central': false,
          'opponent1': false,
          'opponent2': false,
          'defendObjectives': false
        };
      });
    } else if (state.mission?.id === 'take-positions') {
      playerIds.forEach(playerId => {
        initialScoring[playerId] = {
          'opponent1': false,
          'opponent2': false,
          'defendObjectives': false
        };
      });
    } else if (state.mission?.id === 'fog-of-death') {
      playerIds.forEach(playerId => {
        initialScoring[playerId] = {
          'fogContact1': false,
          'fogContact2': false,
          'fogContact3': false,
          'fogContact4': false,
          'controlArtifact': false
        };
      });
    } else {
      // Fallback for any other mission
      playerIds.forEach(playerId => {
        initialScoring[playerId] = {};
      });
    }
    
    setMissionScoring(initialScoring);
  }, [state.players, state.mission]);

  // Toggle mission scoring checkbox with mutual exclusivity check
  const toggleScoringCondition = (playerId: string, condition: string) => {
    setMissionScoring(prev => {
      const updated = { ...prev };
      
      if (state.mission?.id === 'consolidated-progress') {
        // Handle mutual exclusivity for central objective
        if (condition === 'central') {
          const otherPlayers = Object.keys(updated).filter(id => id !== playerId);
          
          // If we're checking this box, uncheck it for all other players
          if (!updated[playerId][condition]) {
            otherPlayers.forEach(otherId => {
              updated[otherId] = {
                ...updated[otherId],
                central: false
              };
            });
          }
        }
      }
      
      // Handle mutual exclusivity for player objectives
      // This depends on knowing which objectives belong to which player
      const playerIds = Object.keys(state.players);
      if (playerIds.length === 2) {
        const opponentId = playerIds.find(id => id !== playerId);
        
        if (opponentId) {
          // If player is claiming opponent's objective 1, opponent can't defend both objectives
          if (condition === 'opponent1' && updated[playerId][condition] === false) {
            updated[opponentId] = {
              ...updated[opponentId],
              defendObjectives: false
            };
          }
          
          // If player is claiming opponent's objective 2, opponent can't defend both objectives
          if (condition === 'opponent2' && updated[playerId][condition] === false) {
            updated[opponentId] = {
              ...updated[opponentId],
              defendObjectives: false
            };
          }
          
          // If player is setting defendObjectives, ensure opponent doesn't control either objective
          if (condition === 'defendObjectives' && updated[playerId][condition] === false) {
            const opponentObjectives = {
              opponent1: false,
              opponent2: false
            };
            
            // Find out if opponent has already claimed one of this player's objectives
            const opponentHasObjective = updated[opponentId].opponent1 || updated[opponentId].opponent2;
            
            if (opponentHasObjective) {
              // If opponent already has one of player's objectives, 
              // player can't claim to be defending both
              return updated;
            }
          }
        }
      }
      
      // Toggle the specific condition for this player
      updated[playerId] = {
        ...updated[playerId],
        [condition]: !updated[playerId][condition]
      };
      
      return updated;
    });
  };

  // Calculate VP based on checked conditions and mission type
  const calculateVP = (playerId: string): number => {
    const conditions = missionScoring[playerId];
    if (!conditions) return 0;
    
    let vp = 0;
    
    if (state.mission?.id === 'consolidated-progress') {
      if (conditions.central) vp += 1; // 1 VP for controlling central objective
      if (conditions.opponent1) vp += 1; // 1 VP for controlling opponent's objective 1
      if (conditions.opponent2) vp += 2; // 2 VP for controlling opponent's objective 2
      if (conditions.defendObjectives) vp += 1; // 1 VP if opponent controls neither of your objectives
    } else if (state.mission?.id === 'take-positions') {
      if (conditions.opponent1) vp += 1; // 1 VP for controlling opponent's first objective
      if (conditions.opponent2) vp += 1; // 1 VP for controlling opponent's second objective
      if (conditions.defendObjectives) vp += 1; // 1 VP if opponent controls neither of your objectives
    } else if (state.mission?.id === 'fog-of-death') {
      // Count each fog contact (1 VP each, up to 4)
      if (conditions.fogContact1) vp += 1;
      if (conditions.fogContact2) vp += 1;
      if (conditions.fogContact3) vp += 1;
      if (conditions.fogContact4) vp += 1;
      
      // 2 VP for controlling artifact at end of round
      if (conditions.controlArtifact) vp += 2;
    }
    
    return vp;
  };

  // Update scores for each player based on checked conditions
  const updateScores = () => {
    const newScoredFogMarkers = { ...scoredFogMarkers };
    
    Object.entries(missionScoring).forEach(([playerId, conditions]) => {
      const vp = calculateVP(playerId);
      
      // Only update if there are points to add
      if (vp > 0) {
        const currentScore = state.players[playerId]?.score || 0;
        
        // Add mission scoring events for each scored objective
        Object.entries(conditions).forEach(([objectiveType, isScored]) => {
          if (isScored) {
            // Track scored fog markers for the Fog of Death mission
            if (state.mission?.id === 'fog-of-death' && objectiveType.startsWith('fogContact')) {
              newScoredFogMarkers[objectiveType] = true;
            }
            
            let description = '';
            
            if (state.mission?.id === 'consolidated-progress') {
              switch (objectiveType) {
                case 'central':
                  description = 'Control central objective (1 VP)';
                  break;
                case 'opponent1':
                  description = 'Control opponent\'s objective 1 (1 VP)';
                  break;
                case 'opponent2':
                  description = 'Control opponent\'s objective 2 (2 VP)';
                  break;
                case 'defendObjectives':
                  description = 'Opponent controls neither of your objectives (1 VP)';
                  break;
              }
            } else if (state.mission?.id === 'take-positions') {
              switch (objectiveType) {
                case 'opponent1':
                  description = 'Control opponent\'s objective 1 (1 VP)';
                  break;
                case 'opponent2':
                  description = 'Control opponent\'s objective 2 (1 VP)';
                  break;
                case 'defendObjectives':
                  description = 'Opponent controls neither of your objectives (1 VP)';
                  break;
              }
            } else if (state.mission?.id === 'fog-of-death') {
              switch (objectiveType) {
                case 'fogContact1':
                  description = 'Fog marker 1 contacted conquest marker (1 VP)';
                  break;
                case 'fogContact2':
                  description = 'Fog marker 2 contacted conquest marker (1 VP)';
                  break;
                case 'fogContact3':
                  description = 'Fog marker 3 contacted conquest marker (1 VP)';
                  break;
                case 'fogContact4':
                  description = 'Fog marker 4 contacted conquest marker (1 VP)';
                  break;
                case 'controlArtifact':
                  description = 'Control artifact at end of round (2 VP)';
                  break;
              }
            }
            
            dispatch({
              type: 'ADD_GAME_EVENT',
              payload: {
                id: `mission-${Date.now()}-${playerId}-${objectiveType}`,
                timestamp: Date.now(),
                type: 'mission',
                playerId: playerId,
                description: description,
                objectiveType: 'mission',
                roundNumber: currentRound,
              }
            });
          }
        });
        
        dispatch({
          type: 'UPDATE_SCORE',
          payload: {
            playerId,
            score: currentScore + vp,
            roundNumber: currentRound
          }
        });
        
        toast.success(`Added ${vp} VP to ${state.players[playerId]?.name}`);
      }
    });
    
    // Update the tracked scored fog markers
    if (state.mission?.id === 'fog-of-death') {
      setScoredFogMarkers(newScoredFogMarkers);
    }
    
    // Reset scoring checkboxes for next round
    const playerIds = Object.keys(state.players);
    const resetScoring: Record<string, Record<string, boolean>> = {};
    
    if (state.mission?.id === 'consolidated-progress') {
      playerIds.forEach(playerId => {
        resetScoring[playerId] = {
          'central': false,
          'opponent1': false,
          'opponent2': false,
          'defendObjectives': false
        };
      });
    } else if (state.mission?.id === 'take-positions') {
      playerIds.forEach(playerId => {
        resetScoring[playerId] = {
          'opponent1': false,
          'opponent2': false,
          'defendObjectives': false
        };
      });
    } else if (state.mission?.id === 'fog-of-death') {
      playerIds.forEach(playerId => {
        // Initialize with all fog contacts set to false
        const fogContacts: Record<string, boolean> = {
          'fogContact1': false,
          'fogContact2': false,
          'fogContact3': false,
          'fogContact4': false,
          'controlArtifact': false
        };
        
        // Remove already scored fog markers from options
        Object.keys(newScoredFogMarkers).forEach(marker => {
          if (newScoredFogMarkers[marker]) {
            delete fogContacts[marker];
          }
        });
        
        resetScoring[playerId] = fogContacts;
      });
    } else {
      playerIds.forEach(playerId => {
        resetScoring[playerId] = {};
      });
    }
    
    setMissionScoring(resetScoring);
  };

  return {
    missionScoring,
    scoredFogMarkers,
    toggleScoringCondition,
    calculateVP,
    updateScores
  };
};
