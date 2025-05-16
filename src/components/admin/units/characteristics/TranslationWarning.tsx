
import React from 'react';
import { AlertTriangle } from "lucide-react";

interface TranslationWarningProps {
  spanishNamesMissing: number;
  frenchNamesMissing: number;
  spanishDescMissing: number;
  frenchDescMissing: number;
}

const TranslationWarning: React.FC<TranslationWarningProps> = ({
  spanishNamesMissing,
  frenchNamesMissing,
  spanishDescMissing,
  frenchDescMissing
}) => {
  if (spanishNamesMissing === 0 && frenchNamesMissing === 0 && 
      spanishDescMissing === 0 && frenchDescMissing === 0) {
    return null;
  }
  
  return (
    <div className="p-2 border border-amber-500/30 rounded bg-amber-500/10 flex items-start gap-2">
      <AlertTriangle className="text-amber-500 h-5 w-5 mt-0.5" />
      <div className="text-sm text-warcrow-text">
        <p className="font-medium">Missing translations detected:</p>
        <ul className="list-disc list-inside mt-1 ml-1 space-y-0.5">
          {spanishNamesMissing > 0 && (
            <li>{spanishNamesMissing} characteristic names missing Spanish translations</li>
          )}
          {spanishDescMissing > 0 && (
            <li>{spanishDescMissing} characteristic descriptions missing Spanish translations</li>
          )}
          {frenchNamesMissing > 0 && (
            <li>{frenchNamesMissing} characteristic names missing French translations</li>
          )}
          {frenchDescMissing > 0 && (
            <li>{frenchDescMissing} characteristic descriptions missing French translations</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TranslationWarning;
