
import React from "react";
import { useSearch } from "@/contexts/SearchContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface TextHighlighterProps {
  text: string;
}

export const TextHighlighter = ({ text }: TextHighlighterProps) => {
  // Get search context values or provide defaults if context isn't available
  let searchTermValue = '';
  let caseSensitiveValue = false;
  
  try {
    // Try to use the search context, but don't throw if unavailable
    const { searchTerm, caseSensitive } = useSearch();
    searchTermValue = searchTerm;
    caseSensitiveValue = caseSensitive;
  } catch (error) {
    // Context not available, use defaults (empty search)
    console.log("Search context not available, using defaults");
  }
  
  const { language } = useLanguage();
  
  // Convert [[red]] syntax to HTML for rendering
  const processRedSyntax = (input: string): string => {
    return input.replace(/\[\[red\]\](.*?)\[\[\/red\]\]/g, '<span style="color: #ea384c">$1</span>');
  };

  // If there's no search term and the text contains HTML, render it directly
  if (!searchTermValue && (text.includes("<") || text.includes("[[red]]"))) {
    // Process the [[red]] syntax before rendering HTML
    const processedText = processRedSyntax(text);
    return <div className="text-warcrow-text" dangerouslySetInnerHTML={{ __html: processedText }} />;
  }
  
  // Handle custom formatting first for the [[red]] syntax
  const processFormattedText = (inputText: string): React.ReactNode[] => {
    // Look for special formatting markers
    const parts = inputText.split(/(\[\[red\]\]|\[\[\/red\]\])/);
    const result: React.ReactNode[] = [];
    
    let isRed = false;
    let key = 0;
    
    for (const part of parts) {
      if (part === "[[red]]") {
        isRed = true;
      } else if (part === "[[/red]]") {
        isRed = false;
      } else if (part) {
        // If we're in search mode, highlight search terms
        if (searchTermValue) {
          const searchRegex = new RegExp(`(${searchTermValue})`, caseSensitiveValue ? "g" : "gi");
          const searchParts = part.split(searchRegex);
          
          const formattedPart = (
            <span 
              key={key++} 
              style={isRed ? { color: '#ea384c' } : undefined}
            >
              {searchParts.map((searchPart, i) => 
                searchPart.toLowerCase() === searchTermValue.toLowerCase() ? (
                  <span key={i} className="bg-yellow-500/30">
                    {searchPart}
                  </span>
                ) : (
                  searchPart
                )
              )}
            </span>
          );
          
          result.push(formattedPart);
        } else {
          // No search term, just handle the red formatting
          result.push(
            <span 
              key={key++} 
              style={isRed ? { color: '#ea384c' } : undefined}
            >
              {part}
            </span>
          );
        }
      }
    }
    
    return result;
  };

  // If there's no special formatting and no search term, just return the plain text
  if (!text.includes("[[red]]") && !searchTermValue) {
    return <>{text}</>;
  }

  // If there's no special formatting but there is a search term, use the previous search highlighting
  if (!text.includes("[[red]]")) {
    const searchRegex = new RegExp(`(${searchTermValue})`, caseSensitiveValue ? "g" : "gi");
    const parts = text.split(searchRegex);
    
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTermValue.toLowerCase() ? (
            <span key={i} className="bg-yellow-500/30">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  }

  // Handle both special formatting and possibly search term
  return <>{processFormattedText(text)}</>;
};
