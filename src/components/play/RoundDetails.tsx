
import React from 'react';
import { Edit2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GameState, Player, GameEvent } from '@/types/game';
import { useIsMobile } from '@/hooks/use-mobile';

interface RoundDetailsProps {
  gameState: GameState;
  players: Player[];
  rounds: number[];
  onEditRoundScore: (roundNumber: number) => void;
}

const RoundDetails: React.FC<RoundDetailsProps> = ({
  gameState,
  players,
  rounds,
  onEditRoundScore
}) => {
  const isMobile = useIsMobile();
  
  // Ensure we always show at least rounds 1-3
  const displayRounds = rounds.length > 0 
    ? [...new Set([...rounds, 1, 2, 3])].sort((a, b) => a - b) 
    : [1, 2, 3];

  const getPlayerScore = (playerId: string, roundNumber: number) => {
    const player = gameState.players[playerId];
    return player.roundScores?.[roundNumber] || 0;
  };

  const getPlayerObjectives = (playerId: string, roundNumber: number) => {
    return gameState.gameEvents.filter(
      event => event.playerId === playerId && 
      event.roundNumber === roundNumber && 
      (event.type === 'objective' || event.type === 'mission')
    );
  };
  
  // Function to check if a player had initiative for a specific round
  const hadInitiative = (playerId: string, roundNumber: number) => {
    return gameState.gameEvents.some(
      event => event.playerId === playerId && 
              event.roundNumber === roundNumber && 
              event.type === 'initiative'
    );
  };

  // Function to check if a player had initial initiative (for round 1)
  const hadInitialInitiative = (playerId: string) => {
    return gameState.initialInitiativePlayerId === playerId;
  };

  return (
    <Card className="p-4 sm:p-6 border border-warcrow-gold/40 shadow-sm bg-warcrow-background">
      <div className="flex justify-between items-center mb-4 border-b border-warcrow-gold/20 pb-4">
        <h3 className="text-xl font-semibold text-warcrow-gold">Round-by-Round Breakdown</h3>
      </div>

      <div className="overflow-hidden">
        <Table className="round-details-table w-full">
          <TableHeader>
            <TableRow className="bg-warcrow-accent/50">
              <TableHead className="text-warcrow-gold min-w-[80px] w-[15%]">Round</TableHead>
              <TableHead className="text-warcrow-gold min-w-[120px] w-[25%]">Player</TableHead>
              {!isMobile && <TableHead className="text-warcrow-gold w-[45%]">Objectives</TableHead>}
              <TableHead className="text-warcrow-gold min-w-[60px] w-[15%]">VP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRounds.map((roundNumber) => (
              players.map((player, playerIndex) => {
                const objectives = getPlayerObjectives(player.id || '', roundNumber);
                const roundScore = getPlayerScore(player.id || '', roundNumber);
                const hasInitiative = hadInitiative(player.id || '', roundNumber);
                // Check if this player had initial initiative (only relevant for round 1)
                const hasInitialInitiative = roundNumber === 1 && hadInitialInitiative(player.id || '');
                
                return (
                  <TableRow 
                    key={`${roundNumber}-${player.id}`} 
                    className={playerIndex % 2 === 0 ? 'bg-warcrow-background' : 'bg-warcrow-accent/30'}
                  >
                    {playerIndex === 0 && (
                      <TableCell rowSpan={players.length} className="font-medium align-top border-r border-warcrow-gold/20 p-3 sm:p-4">
                        <div className="flex flex-col">
                          <div className="flex items-center text-warcrow-gold">
                            <Clock className="w-4 h-4 mr-2" />
                            Round {roundNumber}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditRoundScore(roundNumber)}
                            className="text-sm text-warcrow-gold hover:bg-warcrow-accent hover:text-warcrow-gold mt-2 justify-start pl-0"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            <span className={isMobile ? "sr-only sm:not-sr-only" : ""}>Edit Round</span>
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="font-medium text-warcrow-text p-3 sm:p-4">
                      <div className="flex items-center gap-1">
                        {player.name}
                        {(hasInitiative || hasInitialInitiative) && (
                          <img 
                            src="/art/icons/initiative-icon.png" 
                            alt="Initiative" 
                            className="h-5 w-5 ml-1"
                          />
                        )}
                      </div>
                      
                      {/* Show objectives below player name on mobile */}
                      {isMobile && objectives.length > 0 && (
                        <div className="mt-1 text-xs text-warcrow-muted">
                          {objectives.map((objective: GameEvent, idx) => (
                            <div key={objective.id} className="mt-1">
                              {objective.description || objective.objectiveType || 'Unknown'} 
                              {objective.value ? ` (${objective.value} VP)` : ''}
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    
                    {/* Only show objectives column on desktop */}
                    {!isMobile && (
                      <TableCell className="text-warcrow-muted p-3 sm:p-4">
                        {objectives.length > 0 ? (
                          <div className="text-sm">
                            {objectives.map((objective: GameEvent, idx) => (
                              <div key={objective.id} className="mb-1">
                                {objective.description || objective.objectiveType || 'Unknown'} 
                                {objective.value ? ` (${objective.value} VP)` : ''}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm">No objectives</span>
                        )}
                      </TableCell>
                    )}
                    
                    <TableCell className="text-warcrow-gold font-medium text-lg p-3 sm:p-4">{roundScore} VP</TableCell>
                  </TableRow>
                );
              })
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default RoundDetails;
