
import React, { useEffect, useState } from "react";
import { GameSymbol } from "../GameSymbol";

interface SelectedSymbolProps {
  customChar: string;
  fontSize: number;
}

export const SelectedSymbol: React.FC<SelectedSymbolProps> = ({ customChar, fontSize }) => {
  const [fontLoaded, setFontLoaded] = useState<boolean | null>(null);
  const [isNumeric, setIsNumeric] = useState<boolean>(false);
  const [isSpecialSymbol, setIsSpecialSymbol] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the current character is a numeric character
    const code = customChar.charCodeAt(0);
    setIsNumeric(code >= 48 && code <= 57); // ASCII 48-57 are digits 0-9
    
    // Check if this is specifically the number 4 (special hollow shield symbol)
    setIsSpecialSymbol(customChar === "4");
    
    // Simple font loading check
    const checkFontLoading = async () => {
      // Set initial state to checking
      setFontLoaded(null);
      
      try {
        // Use document.fonts API if available (modern browsers)
        if ('fonts' in document) {
          const font = new FontFace('GameSymbols', 'url(/fonts/Warcrow.woff2), url(/fonts/Warcrow.ttf)');
          try {
            await font.load();
            setFontLoaded(true);
          } catch (e) {
            console.error("Error loading font:", e);
            setFontLoaded(false);
          }
        } else {
          // Fallback for browsers without document.fonts
          // Wait a short time and assume it's loaded
          setTimeout(() => setFontLoaded(true), 500);
        }
      } catch (e) {
        console.error("Font loading check failed:", e);
        setFontLoaded(false);
      }
    };

    checkFontLoading();
  }, [customChar]);

  if (!customChar) {
    return (
      <div className="p-4 bg-black/60 rounded-lg border border-warcrow-gold/40 text-center">
        <p className="text-warcrow-text/80">
          Enter a number or select a symbol from the grid to display it here.
        </p>
      </div>
    );
  }

  const charCode = customChar.charCodeAt(0);

  return (
    <div className="p-4 bg-black/60 rounded-lg border border-warcrow-gold/40">
      <h3 className="text-warcrow-gold text-sm mb-3 font-medium">Selected Symbol</h3>
      
      {fontLoaded === false && (
        <div className="mb-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-sm">
          Warning: The GameSymbols font may not have loaded correctly. Symbols might not display properly.
        </div>
      )}
      
      {isSpecialSymbol && (
        <div className="mb-3 p-2 bg-green-900/30 border border-green-500/50 rounded text-sm">
          This is character "4" which should display as a hollow shield when using the Warcrow font classes.
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="space-y-4">
          <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
            <h4 className="text-warcrow-gold/90 text-xs mb-2">Original implementation:</h4>
            <div 
              className="game-symbol bg-black/40 p-4 rounded-md border border-warcrow-gold/20 min-w-16 min-h-16 flex items-center justify-center"
              style={{ fontSize: `${fontSize}px` }}
            >
              {customChar}
            </div>
            <div className="mt-2 text-xs text-warcrow-text/80 text-center">Using class="game-symbol"</div>
          </div>
          
          <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
            <h4 className="text-warcrow-gold/90 text-xs mb-2">Warcrow implementation:</h4>
            <div 
              className="Warcrow-Family bg-black/40 p-4 rounded-md border border-warcrow-gold/20 min-w-16 min-h-16 flex items-center justify-center"
              style={{ fontSize: `${fontSize}px` }}
            >
              {customChar}
            </div>
            <div className="mt-2 text-xs text-warcrow-text/80 text-center">Using class="Warcrow-Family"</div>
          </div>
          
          {isNumeric && (
            <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
              <h4 className="text-warcrow-gold/90 text-xs mb-2">With specific numeric class:</h4>
              <div 
                className={`Warcrow-Family WC_${customChar} bg-black/40 p-4 rounded-md border border-warcrow-gold/20 min-w-16 min-h-16 flex items-center justify-center`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {customChar}
              </div>
              <div className="mt-2 text-xs text-warcrow-text/80 text-center">Using class="Warcrow-Family WC_{customChar}"</div>
            </div>
          )}
        </div>
        
        <div className="text-warcrow-text space-y-1 flex-1">
          <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
            <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Character Information</h4>
            <div>
              Character: <span className="text-warcrow-gold ml-1">{customChar}</span>
            </div>
            <div>
              Code: <span className="text-warcrow-gold ml-1">{charCode || 'N/A'}</span>
            </div>
            <div>
              Hex: <span className="text-warcrow-gold ml-1">{charCode ? '0x' + charCode.toString(16).toUpperCase() : 'N/A'}</span>
            </div>
            {isNumeric && (
              <div>
                Type: <span className="text-green-500 ml-1">Numeric Character ({customChar})</span>
              </div>
            )}
            {isSpecialSymbol && (
              <div>
                Special: <span className="text-green-500 ml-1">Hollow Shield Symbol</span>
              </div>
            )}
            <div>
              Font: <span className={`ml-1 ${fontLoaded === true ? 'text-green-500' : fontLoaded === false ? 'text-red-500' : 'text-yellow-500'}`}>
                {fontLoaded === true ? 'Loaded' : fontLoaded === false ? 'Failed to load' : 'Checking...'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-black/40 rounded border border-warcrow-gold/20">
        <h4 className="text-warcrow-gold/90 text-xs mb-2">Usage Examples:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-warcrow-text/90">Standard implementation:</p>
            <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
              &lt;span class="game-symbol"&gt;{customChar}&lt;/span&gt;
            </code>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-warcrow-text/90">Warcrow implementation:</p>
            <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
              &lt;span class="Warcrow-Family"&gt;{customChar}&lt;/span&gt;
            </code>
          </div>
          {isNumeric && (
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs text-warcrow-text/90">With specific numeric class (recommended):</p>
              <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
                &lt;span class="Warcrow-Family WC_{customChar}"&gt;{customChar}&lt;/span&gt;
              </code>
            </div>
          )}
          {isSpecialSymbol && (
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs text-warcrow-text/90">Using GameSymbol component:</p>
              <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto whitespace-pre">
{`<GameSymbol 
  code={${charCode}} 
  size="lg" 
  useWarcrowClass={true} 
/>`}
              </code>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-black/40 rounded border border-warcrow-gold/20">
        <h4 className="text-warcrow-gold/90 text-xs mb-2">Add to fonts.css:</h4>
        <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto whitespace-pre">
{`.Warcrow-Family {
  font-family: 'GameSymbols', sans-serif;
  font-feature-settings: "liga", "calt", "dlig";
  font-variant-ligatures: common-ligatures discretionary-ligatures;
}

/* Specific numeric character classes */
.WC_1, .WC_2, .WC_3, .WC_4, .WC_5, 
.WC_6, .WC_7, .WC_8, .WC_9, .WC_0 {
  /* These classes can have specific styling if needed */
}`}
        </code>
      </div>
    </div>
  );
};
