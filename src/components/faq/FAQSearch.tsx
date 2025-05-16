
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { useUnifiedSearch } from '@/contexts/UnifiedSearchContext';

interface FAQSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultsCount: number;
}

export const FAQSearch: React.FC<FAQSearchProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  resultsCount 
}) => {
  const { t } = useLanguage();
  const [focused, setFocused] = useState(false);
  const { searchResults } = useUnifiedSearch();
  
  // Count only FAQ results
  const faqResultsCount = searchResults.filter(result => result.source === "faq").length;
  
  return (
    <div className="mb-6 space-y-2">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warcrow-text/50" 
            size={18} 
          />
          <Input
            className={`pl-10 pr-8 py-5 bg-black/20 border-warcrow-gold/30 text-warcrow-text placeholder:text-warcrow-text/50 focus:border-warcrow-gold focus:ring-1 focus:ring-warcrow-gold/50 ${
              focused ? "ring-1 ring-warcrow-gold/50" : ""
            }`}
            placeholder={t("searchRulesAndFAQ")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warcrow-text/50 hover:text-warcrow-gold"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {searchQuery && (
        <div className="text-sm text-warcrow-text/80">
          {faqResultsCount === 0 
            ? t("noSearchResults")
            : t("searchResultsCount").replace('{count}', faqResultsCount.toString())}
        </div>
      )}
    </div>
  );
};
