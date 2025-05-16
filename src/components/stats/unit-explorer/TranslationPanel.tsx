
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiUnit } from '@/types/army';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';

export interface TranslationPanelProps {
  units?: ApiUnit[];
  onTranslationComplete?: () => void;
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({
  units = [],
  onTranslationComplete = () => {}
}) => {
  const { t, language } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  
  const handleStartTranslation = () => {
    setIsTranslating(true);
    // In a real implementation, this would initiate translation of the units
    
    setTimeout(() => {
      setIsTranslating(false);
      onTranslationComplete();
    }, 2000);
  };
  
  return (
    <Card className="p-4 bg-warcrow-accent/50 border-warcrow-gold/30">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-warcrow-gold">{t('translationTools')}</h3>
        
        <p className="text-warcrow-text/80">
          {t('translationDescription')}
        </p>
        
        <Button
          onClick={handleStartTranslation}
          disabled={isTranslating || units.length === 0}
          className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
        >
          <Languages className="h-4 w-4 mr-2" />
          {isTranslating ? t('translating') : t('translateMissingTexts')}
        </Button>
      </div>
    </Card>
  );
};

export default TranslationPanel;
