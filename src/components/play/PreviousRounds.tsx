
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PreviousRoundsProps {
  currentRound: number;
  onEditRound: (roundNumber: number) => void;
}

const PreviousRounds: React.FC<PreviousRoundsProps> = ({ currentRound, onEditRound }) => {
  if (currentRound <= 1) return null;
  
  return (
    <div className="mb-4 border-b pb-4">
      <div className="text-sm font-medium mb-2 flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1.5 text-muted-foreground" />
        Previous Rounds
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: currentRound - 1 }, (_, i) => i + 1).map(round => (
          <Button 
            key={round} 
            variant="outline" 
            size="sm"
            onClick={() => onEditRound(round)}
          >
            Round {round}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PreviousRounds;
