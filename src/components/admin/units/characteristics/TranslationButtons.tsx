
import React from 'react';
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

interface TranslationButtonsProps {
  isLoading: boolean;
  translationInProgress: boolean;
  spanishNamesMissing: number;
  frenchNamesMissing: number;
  spanishDescMissing: number;
  frenchDescMissing: number;
  onTranslateNames: (language: string) => Promise<void>;
  onTranslateDescriptions: (language: string) => Promise<void>;
}

const TranslationButtons: React.FC<TranslationButtonsProps> = ({
  isLoading,
  translationInProgress,
  spanishNamesMissing,
  frenchNamesMissing,
  spanishDescMissing,
  frenchDescMissing,
  onTranslateNames,
  onTranslateDescriptions
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="border-warcrow-gold/50 text-warcrow-gold"
          onClick={() => onTranslateNames('es')}
          disabled={isLoading || translationInProgress || spanishNamesMissing === 0}
          size="sm"
        >
          <Languages className="h-4 w-4 mr-1" />
          Names to Spanish {spanishNamesMissing > 0 && `(${spanishNamesMissing})`}
        </Button>
        <Button 
          variant="outline" 
          className="border-warcrow-gold/50 text-warcrow-gold"
          onClick={() => onTranslateDescriptions('es')}
          disabled={isLoading || translationInProgress || spanishDescMissing === 0}
          size="sm"
        >
          <Languages className="h-4 w-4 mr-1" />
          Descriptions to Spanish {spanishDescMissing > 0 && `(${spanishDescMissing})`}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="border-warcrow-gold/50 text-warcrow-gold"
          onClick={() => onTranslateNames('fr')}
          disabled={isLoading || translationInProgress || frenchNamesMissing === 0}
          size="sm"
        >
          <Languages className="h-4 w-4 mr-1" />
          Names to French {frenchNamesMissing > 0 && `(${frenchNamesMissing})`}
        </Button>
        <Button 
          variant="outline" 
          className="border-warcrow-gold/50 text-warcrow-gold"
          onClick={() => onTranslateDescriptions('fr')}
          disabled={isLoading || translationInProgress || frenchDescMissing === 0}
          size="sm"
        >
          <Languages className="h-4 w-4 mr-1" />
          Descriptions to French {frenchDescMissing > 0 && `(${frenchDescMissing})`}
        </Button>
      </div>
    </div>
  );
};

export default TranslationButtons;
