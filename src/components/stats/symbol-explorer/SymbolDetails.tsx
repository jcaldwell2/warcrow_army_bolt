
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SymbolDetailsProps {
  customChar: string;
  fontSize: number;
  setFontSize: (size: number) => void;
}

export const SymbolDetails: React.FC<SymbolDetailsProps> = ({ 
  customChar, 
  fontSize, 
  setFontSize 
}) => {
  if (!customChar) {
    return (
      <div className="bg-black/40 p-8 rounded-lg border border-warcrow-gold/30 text-center">
        <p className="text-warcrow-gold/80">Select a symbol from the grid view to see details</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 p-6 rounded-lg border border-warcrow-gold/30">
      <h3 className="text-warcrow-gold text-lg mb-4 font-medium">Symbol Details</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div 
            className="game-symbol bg-black/60 p-8 rounded-md border border-warcrow-gold/20 flex items-center justify-center mb-4"
            style={{ fontSize: `${fontSize * 2}px` }}
          >
            {customChar}
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm text-warcrow-text/90 block">
              Font Size
            </Label>
            <div className="flex gap-2">
              {[24, 36, 48, 60, 72].map((size) => (
                <Button 
                  key={size}
                  size="sm"
                  variant="outline"
                  onClick={() => setFontSize(size)}
                  className={`
                    ${fontSize === size 
                      ? "bg-warcrow-gold/20 border-warcrow-gold text-warcrow-gold" 
                      : "bg-black/60 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10"}
                  `}
                >
                  {size}px
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
            <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Character Information</h4>
            <div className="space-y-2 text-warcrow-text">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-warcrow-text/60">Character:</span>
                <span className="text-warcrow-gold col-span-2">{customChar}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-warcrow-text/60">Unicode:</span>
                <span className="text-warcrow-gold col-span-2">U+{customChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-warcrow-text/60">Decimal:</span>
                <span className="text-warcrow-gold col-span-2">{customChar.charCodeAt(0)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-warcrow-text/60">Hexadecimal:</span>
                <span className="text-warcrow-gold col-span-2">0x{customChar.charCodeAt(0).toString(16).toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
            <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Usage Example</h4>
            <div className="space-y-2">
              <div className="text-warcrow-text">
                <p className="mb-2">HTML Entity:</p>
                <code className="bg-black/60 p-2 rounded text-warcrow-gold block overflow-x-auto">
                  &amp;#x{customChar.charCodeAt(0).toString(16).toUpperCase()};
                </code>
              </div>
              <div className="text-warcrow-text mt-3">
                <p className="mb-2">CSS Content:</p>
                <code className="bg-black/60 p-2 rounded text-warcrow-gold block overflow-x-auto">
                  content: "\{customChar.charCodeAt(0).toString(16).toUpperCase()}";
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
