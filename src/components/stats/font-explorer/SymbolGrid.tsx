
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SymbolGridProps {
  symbols: string[];
  onSymbolClick: (symbol: string) => void;
  selectedSymbol: string | null;
  showBackground: boolean;
  backgroundColor: string;
}

const SymbolGrid: React.FC<SymbolGridProps> = ({
  symbols,
  onSymbolClick,
  selectedSymbol,
  showBackground,
  backgroundColor
}) => {
  return (
    <ScrollArea className="h-[60vh]">
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 pr-4">
        {symbols.map((symbol, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center cursor-pointer
              ${selectedSymbol === symbol ? 'ring-2 ring-warcrow-gold' : 'hover:bg-warcrow-gold/20'}
            `}
            style={{
              background: showBackground && selectedSymbol === symbol ? backgroundColor : undefined,
              borderRadius: '0.25rem'
            }}
            onClick={() => onSymbolClick(symbol)}
          >
            <span 
              className="font-warcrow text-2xl text-warcrow-text hover:text-warcrow-gold" 
              style={{ 
                fontFamily: "'Warcrow', 'Warcrow', sans-serif"
              }}
            >
              {symbol}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SymbolGrid;
