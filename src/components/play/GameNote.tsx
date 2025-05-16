
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface GameNoteProps {
  open: boolean;
  onClose: () => void;
}

const GameNote: React.FC<GameNoteProps> = ({ open, onClose }) => {
  const { state, dispatch } = useGame();
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!note.trim()) {
      toast.error('Please enter a note');
      return;
    }
    
    // Get the first player ID as a fallback if needed
    const defaultPlayerId = Object.keys(state.players)[0] || '';
    
    // Add game event
    dispatch({
      type: 'ADD_GAME_EVENT',
      payload: {
        id: uuidv4(),
        timestamp: Date.now(),
        type: 'note',
        description: note,
        playerId: defaultPlayerId // Add required playerId property
      }
    });
    
    toast.success('Note added successfully');
    setNote('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Add Game Note
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Note</label>
            <textarea
              className="w-full h-32 p-2 border rounded-md"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your game note here..."
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GameNote;
