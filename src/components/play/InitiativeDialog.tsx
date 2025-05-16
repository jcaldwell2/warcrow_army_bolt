
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/game';
import { User, UserCheck } from 'lucide-react';

interface InitiativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Record<string, Player>;
  currentRound: number;
  initiativePlayerId: string;
  setInitiativePlayerId: (id: string) => void;
  onConfirm: () => void;
}

const InitiativeDialog: React.FC<InitiativeDialogProps> = ({
  open,
  onOpenChange,
  players,
  currentRound,
  initiativePlayerId,
  setInitiativePlayerId,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-warcrow-background border border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">Select Player with Initiative</DialogTitle>
          <DialogDescription className="text-warcrow-text/80">
            Choose which player has initiative for round {currentRound}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(players).map(([id, player]) => (
              <Button
                key={id}
                type="button"
                variant={initiativePlayerId === id ? "default" : "outline"}
                className={`
                  h-auto py-6 flex flex-col items-center justify-center gap-2
                  ${initiativePlayerId === id 
                    ? "bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90" 
                    : "bg-warcrow-accent border-warcrow-gold/50 text-warcrow-text hover:bg-warcrow-accent/70 hover:text-warcrow-gold"}
                `}
                onClick={() => setInitiativePlayerId(id)}
              >
                {initiativePlayerId === id ? (
                  <UserCheck className="h-6 w-6" />
                ) : (
                  <User className="h-6 w-6" />
                )}
                <span>{player.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end mt-2">
          <Button 
            onClick={onConfirm}
            className="bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
          >
            Confirm Initiative
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InitiativeDialog;
