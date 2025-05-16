
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { NumericInput } from './NumericInput';

interface SymbolControlsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  showBackground: boolean;
  onBackgroundToggle: () => void;
  backgroundColor: string;
  onColorChange: (color: string) => void;
}

const SymbolControls: React.FC<SymbolControlsProps> = ({
  fontSize,
  onFontSizeChange,
  showBackground,
  onBackgroundToggle,
  backgroundColor,
  onColorChange
}) => {
  const { t } = useLanguage();
  
  // Preset background colors
  const colorPresets = [
    'rgba(40, 40, 40, 0.7)',
    'rgba(60, 50, 0, 0.7)',
    'rgba(50, 0, 0, 0.7)',
    'rgba(0, 50, 50, 0.7)',
    'rgba(0, 40, 0, 0.7)',
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="font-size" className="text-warcrow-text">
            {t('fontSize') || 'Font Size'}
          </Label>
          <NumericInput
            id="font-size"
            value={fontSize}
            onChange={onFontSizeChange}
            min={8}
            max={128}
          />
        </div>
        <Slider
          id="font-size-slider"
          value={[fontSize]}
          min={8}
          max={128}
          step={1}
          onValueChange={(values) => onFontSizeChange(values[0])}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-background" className="text-warcrow-text cursor-pointer">
            {t('showBackground') || 'Show Background'}
          </Label>
          <Switch
            id="show-background"
            checked={showBackground}
            onCheckedChange={onBackgroundToggle}
          />
        </div>

        {showBackground && (
          <div className="space-y-2">
            <Label className="text-warcrow-text block">
              {t('backgroundColor') || 'Background Color'}
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {colorPresets.map((color, index) => (
                <Button
                  key={index}
                  type="button"
                  className={`w-full h-8 rounded-md ${
                    backgroundColor === color ? 'ring-2 ring-warcrow-gold' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymbolControls;
