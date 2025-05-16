
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

export interface SymbolControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onCopy: () => void;
  copied: boolean;
}

export const SymbolControls: React.FC<SymbolControlsProps> = ({
  onPrevious,
  onNext,
  onCopy,
  copied
}) => {
  return (
    <div className="flex items-center justify-between">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onPrevious}
        className="border-warcrow-gold/30 text-warcrow-gold"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onCopy}
        className={`border-warcrow-gold/30 ${copied ? 'bg-warcrow-gold/20 text-warcrow-gold' : 'text-warcrow-gold'}`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onNext}
        className="border-warcrow-gold/30 text-warcrow-gold"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
