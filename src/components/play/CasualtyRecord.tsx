
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';
import { Skull } from 'lucide-react';
import { toast } from 'sonner';

interface CasualtyRecordProps {
  open: boolean;
  onClose: () => void;
}

const CasualtyRecord: React.FC<CasualtyRecordProps> = ({ open, onClose }) => {
  const { state, dispatch } = useGame();
  const [selectedUnit, setSelectedUnit] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUnit) {
      toast.error('Please select a unit');
      return;
    }
    
    const unit = state.units.find(u => u.id === selectedUnit);
    
    if (!unit) return;
    
    // Add casualty event
    dispatch({
      type: 'ADD_GAME_EVENT',
      payload: {
        id: uuidv4(),
        timestamp: Date.now(),
        type: 'casualty',
        unitId: selectedUnit,
        description: `${unit.name} was marked as a casualty`,
        playerId: unit.player
      }
    });
    
    // Update unit status to destroyed
    dispatch({
      type: 'UPDATE_UNIT',
      payload: {
        id: selectedUnit,
        updates: { status: 'destroyed' }
      }
    });
    
    toast.success('Casualty recorded');
    setSelectedUnit('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Skull className="w-5 h-5" />
            Record Casualty
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Unit</Label>
            <Select 
              value={selectedUnit} 
              onValueChange={setSelectedUnit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {state.units
                  .filter(unit => unit.status !== 'destroyed')
                  .map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name} ({state.players[unit.player]?.name || 'Unknown Player'})
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Record Casualty</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CasualtyRecord;
