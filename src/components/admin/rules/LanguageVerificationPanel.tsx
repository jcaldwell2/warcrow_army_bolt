
import React from 'react';
import { Languages } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Update the Language type to ensure it only includes 'es' and 'fr'
export type Language = 'es' | 'fr';

interface LanguageVerificationPanelProps {
  onLanguageChange: (language: Language) => void;
  currentLanguage: Language;
}

export const LanguageVerificationPanel: React.FC<LanguageVerificationPanelProps> = ({
  onLanguageChange,
  currentLanguage
}) => {
  return (
    <Card className="border border-warcrow-gold/40 bg-black mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-warcrow-gold">
          <Languages className="h-4 w-4" />
          Translation Verification View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-white mb-2">
          Switch between languages to verify translations
        </div>
        <RadioGroup 
          value={currentLanguage} 
          onValueChange={(value) => onLanguageChange(value as Language)}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="es" id="lang-es" className="text-warcrow-gold" />
            <Label htmlFor="lang-es" className="text-sm text-white">Spanish</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="fr" id="lang-fr" className="text-warcrow-gold" />
            <Label htmlFor="lang-fr" className="text-sm text-white">French</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
