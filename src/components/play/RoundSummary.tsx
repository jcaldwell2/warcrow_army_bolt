
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player, Unit, Mission, GameEvent } from '@/types/game';
import { ArrowUp, ArrowDown, Target } from 'lucide-react';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface RoundSummaryProps {
  roundNumber: number;
  players: Record<string, Player>;
  units?: Unit[];
  mission?: Mission | null;
  onComplete: (scores: Record<string, number>) => void;
  onCancel: () => void;
}

const RoundSummary: React.FC<RoundSummaryProps> = ({
  roundNumber,
  players,
  units,
  mission,
  onComplete,
  onCancel
}) => {
  const { state, dispatch } = useGame();
  const playerIds = Object.keys(players);
  
  // Initialize scores with current round scores
  const [scores, setScores] = useState<Record<string, number>>(() => {
    return playerIds.reduce((acc, playerId) => {
      const roundScore = players[playerId]?.roundScores?.[roundNumber] || 0;
      return { ...acc, [playerId]: roundScore };
    }, {});
  });

  // Track which objectives each player has completed
  const [selectedObjectives, setSelectedObjectives] = useState<Record<string, string[]>>(() => {
    return playerIds.reduce((acc, playerId) => {
      const events = state.gameEvents.filter(
        event => event.playerId === playerId && 
        event.roundNumber === roundNumber && 
        (event.type === 'objective' || event.type === 'mission')
      );
      
      return {
        ...acc,
        [playerId]: events.map(event => event.id)
      };
    }, {});
  });
  
  const incrementScore = (playerId: string) => {
    setScores(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1
    }));
  };

  const decrementScore = (playerId: string) => {
    setScores(prev => ({
      ...prev,
      [playerId]: Math.max(0, (prev[playerId] || 0) - 1)
    }));
  };
  
  const handleScoreChange = (playerId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setScores(prev => ({
      ...prev,
      [playerId]: numValue
    }));
  };

  const toggleObjective = (playerId: string, eventId: string, checked: boolean) => {
    setSelectedObjectives(prev => {
      const currentSelected = [...(prev[playerId] || [])];
      
      if (checked) {
        if (!currentSelected.includes(eventId)) {
          return { ...prev, [playerId]: [...currentSelected, eventId] };
        }
      } else {
        return { 
          ...prev, 
          [playerId]: currentSelected.filter(id => id !== eventId) 
        };
      }
      
      return prev;
    });
  };
  
  const handleSave = () => {
    onComplete(scores);
    toast.success(`Round ${roundNumber} scores updated`);
  };

  const playerEvents = (playerId: string) => {
    return state.gameEvents.filter(
      event => event.playerId === playerId && 
      event.roundNumber === roundNumber &&
      (event.type === 'objective' || event.type === 'mission')
    );
  };
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Round {roundNumber} Scores</DialogTitle>
          <DialogDescription>
            Adjust scores and objectives for each player
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {playerIds.map((playerId) => {
            const events = playerEvents(playerId);
            
            return (
              <div key={playerId} className="bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between mb-4">
                  <Label htmlFor={`score-${playerId}`} className="text-lg font-medium">
                    {players[playerId].name}'s Points
                  </Label>
                  <div className="flex items-center">
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => decrementScore(playerId)}
                      className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
                    >
                      <ArrowDown className="h-4 w-4 text-white" />
                    </Button>
                    <Input
                      id={`score-${playerId}`}
                      type="number"
                      min="0"
                      className="text-lg h-12 w-20 mx-2"
                      value={scores[playerId] || 0}
                      onChange={(e) => handleScoreChange(playerId, e.target.value)}
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => incrementScore(playerId)}
                      className="bg-green-500/20 hover:bg-green-500/30 border-green-500/50"
                    >
                      <ArrowUp className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
                
                {events.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block">Objectives Completed</Label>
                    <div className="space-y-2">
                      {events.map((event) => (
                        <div key={event.id} className="flex items-start gap-2">
                          <Checkbox 
                            id={`objective-${event.id}`}
                            defaultChecked
                            onCheckedChange={(checked) => 
                              toggleObjective(playerId, event.id, checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`objective-${event.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {event.description || event.objectiveType || 'Objective'}
                              {event.value ? ` (${event.value} VP)` : ''}
                            </label>
                            {event.type === 'mission' && (
                              <Badge variant="outline" className="w-fit">Mission</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    type="button"
                    onClick={() => {
                      // Open objective dialog would go here if implemented
                      toast.info("Add objective functionality would go here");
                    }}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Add Objective
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoundSummary;
