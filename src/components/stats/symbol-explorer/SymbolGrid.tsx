
import React from "react";

interface SymbolGridProps {
  symbols: number[];
  selectedSymbol: number | null;
  handleSymbolClick: (code: number) => void;
  fontSize: number;
}

export const SymbolGrid: React.FC<SymbolGridProps> = ({ 
  symbols, 
  selectedSymbol, 
  handleSymbolClick,
  fontSize
}) => {
  return (
    <div>
      <h3 className="text-warcrow-gold/90 text-sm mb-3 font-medium">
        Symbol Grid <span className="text-warcrow-text/60 text-xs font-normal">({symbols.length} symbols in range)</span>
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {symbols.map((code) => (
          <div
            id={`symbol-${code}`}
            key={code}
            className={`
              p-3 rounded-md border transition-all cursor-pointer
              ${selectedSymbol === code 
                ? "bg-warcrow-gold/20 border-warcrow-gold" 
                : "bg-black/60 border-warcrow-gold/30 hover:bg-warcrow-gold/10"}
            `}
            onClick={() => handleSymbolClick(code)}
          >
            <div 
              className="game-symbol mb-2 flex justify-center"
              style={{ fontSize: `${fontSize}px` }}
            >
              {String.fromCharCode(code)}
            </div>
            <div className="text-xs text-warcrow-text text-center">0x{code.toString(16).toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
