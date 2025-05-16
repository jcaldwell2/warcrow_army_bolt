
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EndGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const EndGameDialog: React.FC<EndGameDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-warcrow-background border-warcrow-gold/40">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">End Game</DialogTitle>
          <DialogDescription className="text-warcrow-text">
            Are you sure you want to end the game now?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
          >
            End Game & View Results
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EndGameDialog;
