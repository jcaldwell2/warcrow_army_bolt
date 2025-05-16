
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface TranslationProgressProps {
  translationInProgress: boolean;
  translationProgress: number;
}

const TranslationProgress: React.FC<TranslationProgressProps> = ({
  translationInProgress,
  translationProgress
}) => {
  if (!translationInProgress) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm text-warcrow-text/90">Translation progress</span>
        <span className="text-sm font-medium text-warcrow-gold">{translationProgress}%</span>
      </div>
      <Progress value={translationProgress} className="h-1.5 bg-warcrow-gold/20" />
    </div>
  );
};

export default TranslationProgress;
