
import { useState } from "react";
import { Search, X, BookOpenCheck } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUnifiedSearch } from "@/contexts/UnifiedSearchContext";
import { Button } from "@/components/ui/button";

export const RulesSearch = () => {
  const { searchTerm, setSearchTerm, caseSensitive, setCaseSensitive, searchResults } = useSearch();
  const { searchInFAQ, searchResults: unifiedResults } = useUnifiedSearch();
  const [focused, setFocused] = useState(false);
  const { t } = useLanguage();

  // Count only rules results
  const rulesResultsCount = unifiedResults.filter(result => result.source === "rules").length;

  // Update the unified search context when rules search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warcrow-text/50 hover:text-warcrow-gold"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Toggle
          pressed={caseSensitive}
          onPressedChange={setCaseSensitive}
          className="px-3 py-2 h-full bg-black/20 border-warcrow-gold/30 text-warcrow-text data-[state=on]:bg-warcrow-gold/20 data-[state=on]:text-warcrow-gold"
          aria-label={t("caseSensitive")}
        >
          Aa
        </Toggle>
      </div>
      
      <div className="flex justify-between items-center">
        {searchTerm && (
          <div className="text-sm text-warcrow-text/80">
            {rulesResultsCount === 0 
              ? t("noSearchResults")
              : t("searchResultsCount").replace('{count}', rulesResultsCount.toString())}
          </div>
        )}

        {searchTerm && (
          <Button
            variant="outline"
            size="sm"
            onClick={searchInFAQ}
            className="text-xs border-warcrow-gold/40 text-warcrow-gold hover:bg-warcrow-gold/10"
          >
            <BookOpenCheck className="mr-1 h-3 w-3" />
            {t("searchInFAQ")}
          </Button>
        )}
      </div>
    </div>
  );
};
