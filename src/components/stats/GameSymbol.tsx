
import React from "react";

interface GameSymbolProps {
  symbol?: any; // Added symbol prop
  code?: number; // Made code optional since we're now using symbol too
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  style?: React.CSSProperties;
  useWarcrowClass?: boolean;
  showBackground?: boolean; // Added this prop
  backgroundColor?: string;
}

export const GameSymbol: React.FC<GameSymbolProps> = ({ 
  symbol, 
  code, 
  size = "md", 
  className = "",
  style = {},
  useWarcrowClass = false,
  showBackground = false,
  backgroundColor
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };
  
  // Use either the provided symbol or convert the code to a character
  const displayChar = symbol || (code ? String.fromCharCode(code) : "");
  
  // Check if this is specifically a number character
  const isNumber = /^\d$/.test(displayChar);
  
  // Choose the appropriate class based on the character and useWarcrowClass prop
  const symbolClass = useWarcrowClass 
    ? `Warcrow-Family ${isNumber ? `WC_${displayChar}` : ''}`
    : "font-warcrow game-symbol";

  return (
    <span 
      className={`${symbolClass} ${sizeClasses[size]} ${className} ${showBackground || backgroundColor ? 'inline-flex items-center justify-center rounded px-1' : ''}`}
      style={{
        fontFeatureSettings: '"liga", "calt", "dlig"',
        backgroundColor: backgroundColor || (showBackground ? 'rgba(40, 40, 40, 0.7)' : 'transparent'),
        filter: 'saturate(1.2)', // Apply the same filter to all symbols for consistency
        ...style
      }}
    >
      {displayChar}
    </span>
  );
};
