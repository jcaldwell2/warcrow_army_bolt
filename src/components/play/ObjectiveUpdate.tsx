
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';

interface ObjectiveUpdateProps {
  open: boolean;
  onClose: () => void;
}

const ObjectiveUpdate: React.FC<ObjectiveUpdateProps> = ({ open, onClose }) => {
  const { state, dispatch } = useGame();
  const [playerId, setPlayerId] = useState<string>('');
  const [objectiveId, setObjectiveId] = useState<string>('');
  const [points, setPoints] = useState<number>(1);

  // Generate list of objectives from the mission
  const objectives = state.mission?.objectiveMarkers || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerId) {
      toast.error('Please select a player');
      return;
    }
    
    if (!objectiveId) {
      toast.error('Please select an objective');
      return;
    }
    
    // Add objective event
    dispatch({
      type: 'ADD_GAME_EVENT',
      payload: {
        id: uuidv4(),
        timestamp: Date.now(),
        type: 'objective',
        objectiveId: objectiveId,
        playerId: playerId,
        description: `${state.players[playerId]?.name || 'Player'} scored ${points} points from objective ${objectives.find(o => o.id === objectiveId)?.name || objectiveId}`,
        value: points,
        roundNumber: state.currentTurn
      }
    });
    
    // Update player score
    const currentScore = state.players[playerId]?.score || 0;
    dispatch({
      type: 'UPDATE_SCORE',
      payload: {
        playerId,
        score: currentScore + points,
        roundNumber: state.currentTurn
      }
    });
    
    toast.success('Objective score recorded');
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setPlayerId('');
    setObjectiveId('');
    setPoints(1);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Update Objective
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Player</Label>
            <Select 
              value={playerId} 
              onValueChange={setPlayerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a player" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(state.players).map(([id, player]) => (
                  <SelectItem key={id} value={id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Objective</Label>
            <Select 
              value={objectiveId} 
              onValueChange={setObjectiveId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an objective" />
              </SelectTrigger>
              <SelectContent>
                {objectives.map((objective) => (
                  <SelectItem key={objective.id} value={objective.id}>
                    {objective.name} ({objective.value} pt{objective.value !== 1 ? 's' : ''})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Points Scored</Label>
            <Input
              type="number"
              min={1}
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Record Score</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectiveUpdate;
