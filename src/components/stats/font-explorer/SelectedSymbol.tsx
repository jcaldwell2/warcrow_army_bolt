
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useLanguage } from '@/contexts/LanguageContext';

interface SelectedSymbolProps {
  symbol: string | null;
  fontSize: number;
  showBackground: boolean;
  backgroundColor: string;
}

const SelectedSymbol: React.FC<SelectedSymbolProps> = ({
  symbol,
  fontSize,
  showBackground,
  backgroundColor
}) => {
  const { t } = useLanguage();
  
  if (!symbol) {
    return (
      <div className="text-center p-8 text-warcrow-text/50">
        {t('noSymbolSelected') || 'No symbol selected'}
      </div>
    );
  }

  // Get the Unicode code point(s) for the symbol
  const getCodePoint = (str: string) => {
    let codePoints = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.codePointAt(i);
      if (code !== undefined) {
        // If this is a surrogate pair, skip the next code unit
        if (code > 0xFFFF) {
          i++;
        }
        codePoints.push(code);
      }
    }
    return codePoints.map(cp => 'U+' + cp.toString(16).toUpperCase().padStart(4, '0')).join(', ');
  };

  const symbolCodePoint = getCodePoint(symbol);

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <AspectRatio ratio={1 / 1}>
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              background: showBackground ? backgroundColor : undefined,
              borderRadius: '0.25rem'
            }}
          >
            <span 
              style={{ 
                fontSize: `${fontSize}px`,
                fontFamily: "'Warcrow', 'Warcrow', sans-serif"
              }}
              className="font-warcrow text-warcrow-gold"
            >
              {symbol}
            </span>
          </div>
        </AspectRatio>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-warcrow-gold">
            {t('unicodePoint') || 'Unicode Point:'}
          </div>
          <div className="font-mono text-warcrow-text">
            {symbolCodePoint}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="text-warcrow-gold">
            {t('fontSize') || 'Font Size:'}
          </div>
          <div className="text-warcrow-text">
            {fontSize}px
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedSymbol;
