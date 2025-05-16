
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface WabIdInputProps {
  playerWabId: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  isVerifying: boolean;
  isVerified: boolean;
  index: number;
}

const WabIdInput: React.FC<WabIdInputProps> = ({
  playerWabId,
  onChange,
  onVerify,
  isVerifying,
  isVerified,
  index
}) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <Label htmlFor={`player-wabid-${index}`}>WAB ID</Label>
      <div className="flex gap-2">
        <Input
          id={`player-wabid-${index}`}
          value={playerWabId}
          onChange={onChange}
          placeholder="WAB-XXXX-XXXX-XXXX"
          className="mt-1 flex-1"
        />
        <button
          onClick={onVerify}
          disabled={isVerifying || !playerWabId}
          className={`mt-1 px-3 py-2 rounded ${
            isVerified 
              ? "bg-green-600 text-white" 
              : "bg-warcrow-gold text-warcrow-background"
          } disabled:opacity-50`}
        >
          {isVerifying ? "..." : isVerified ? "✓" : t('verify')}
        </button>
      </div>
      {isVerified && (
        <p className="text-xs text-green-500 mt-1">{t('idVerified')}</p>
      )}
    </div>
  );
};

export default WabIdInput;
