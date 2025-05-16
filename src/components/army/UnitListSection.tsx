
import { useState } from "react";
import { Unit, SortOption } from "@/types/army";
import UnitCard from "../UnitCard";
import SortControls from "./SortControls";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { characteristicDefinitions } from "@/data/characteristicDefinitions";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";

interface UnitListSectionProps {
  factionUnits: Unit[];
  quantities: Record<string, number>;
  onAdd: (unitId: string) => void;
  onRemove: (unitId: string) => void;
}

const UnitListSection = ({ 
  factionUnits,
  quantities,
  onAdd,
  onRemove 
}: UnitListSectionProps) => {
  const { t } = useLanguage();
  const { translateKeyword } = useTranslateKeyword();
  const { language } = useLanguage();
  
  const [sortBy, setSortBy] = useState<SortOption>("points-asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showKeywords, setShowKeywords] = useState(false);

  // Get all unique characteristics across all units
  const allCharacteristics = Array.from(
    new Set(
      factionUnits.flatMap(unit => 
        unit.keywords
          .filter(k => 
            ["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
             "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
             "Construct", "Undead", "Mounted", "High Command", "Cavalry"].includes(
               typeof k === 'string' ? k : k.name
             )
          )
          .map(k => typeof k === 'string' ? k : k.name)
      )
    )
  ).sort();

  // Get all unique keywords (excluding characteristics)
  const allKeywords = Array.from(
    new Set(
      factionUnits.flatMap(unit => 
        unit.keywords
          .filter(k => 
            !["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
              "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
              "Construct", "Undead", "Mounted", "High Command", "Cavalry"].includes(
                typeof k === 'string' ? k : k.name
              )
          )
          .map(k => typeof k === 'string' ? k : k.name)
      )
    )
  ).sort();

  const handleCharacteristicToggle = (characteristic: string) => {
    setSelectedCharacteristics(prev => {
      if (prev.includes(characteristic)) {
        return prev.filter(c => c !== characteristic);
      } else {
        return [...prev, characteristic];
      }
    });
  };

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev => {
      if (prev.includes(keyword)) {
        return prev.filter(k => k !== keyword);
      } else {
        return [...prev, keyword];
      }
    });
  };

  // Filter units based on search query, selected characteristics, and selected keywords
  const filteredUnits = factionUnits.filter(unit => {
    // Text search filter
    const matchesSearch = searchQuery === "" || 
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.keywords && unit.keywords.some(keyword => {
        const keywordName = typeof keyword === 'string' ? keyword : keyword.name;
        return keywordName.toLowerCase().includes(searchQuery.toLowerCase());
      })) ||
      (unit.specialRules && unit.specialRules.some(rule => 
        rule.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    // Characteristic filter
    const matchesCharacteristics = selectedCharacteristics.length === 0 || 
      selectedCharacteristics.every(characteristic => {
        const hasCharacteristic = unit.keywords.some(keyword => {
          const keywordName = typeof keyword === 'string' ? keyword : keyword.name;
          return keywordName === characteristic;
        });
        const isHighCommand = characteristic === "High Command" && unit.highCommand;
        
        return hasCharacteristic || isHighCommand;
      });

    // Keyword filter
    const matchesKeywords = selectedKeywords.length === 0 || 
      selectedKeywords.every(keyword => {
        return unit.keywords.some(unitKeyword => {
          const keywordName = typeof unitKeyword === 'string' ? unitKeyword : unitKeyword.name;
          return keywordName === keyword;
        });
      });

    return matchesSearch && matchesCharacteristics && matchesKeywords;
  });

  // Sort filtered units
  const sortedUnits = [...filteredUnits].sort((a, b) => {
    switch (sortBy) {
      case "points-asc":
        return a.pointsCost - b.pointsCost;
      case "points-desc":
        return b.pointsCost - a.pointsCost;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const clearAllFilters = () => {
    setSelectedCharacteristics([]);
    setSelectedKeywords([]);
    setSearchQuery("");
  };

  // Function to translate and display characteristics/keywords
  const displayKeyword = (keywordText: string): string => {
    if (language !== 'en') {
      return translateKeyword(keywordText, language);
    }
    return keywordText;
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchUnits')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-warcrow-accent/50 border-warcrow-gold/70 text-warcrow-text placeholder:text-warcrow-muted"
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warcrow-gold hover:text-warcrow-gold/80 focus:outline-none"
            aria-label="Toggle filters"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
        
        {showFilters && (
          <div className="p-3 bg-warcrow-background/80 border border-warcrow-gold/30 rounded-md space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-warcrow-gold">{t('filterByCharacteristics')}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allCharacteristics.map(characteristic => (
                  <div key={characteristic} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`characteristic-${characteristic}`}
                      checked={selectedCharacteristics.includes(characteristic)}
                      onCheckedChange={() => handleCharacteristicToggle(characteristic)}
                      className="data-[state=checked]:bg-warcrow-gold data-[state=checked]:text-black border-warcrow-gold/70"
                    />
                    <label 
                      htmlFor={`characteristic-${characteristic}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-warcrow-text"
                    >
                      {displayKeyword(characteristic)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between text-sm font-semibold text-warcrow-gold py-1 hover:text-warcrow-gold/80"
                onClick={() => setShowKeywords(!showKeywords)}
              >
                <span>{t('filterByKeywords')}</span>
                {showKeywords ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {showKeywords && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1 border-t border-warcrow-gold/20 pt-2">
                  {allKeywords.map(keyword => (
                    <div key={keyword} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`keyword-${keyword}`}
                        checked={selectedKeywords.includes(keyword)}
                        onCheckedChange={() => handleKeywordToggle(keyword)}
                        className="data-[state=checked]:bg-warcrow-gold data-[state=checked]:text-black border-warcrow-gold/70"
                      />
                      <label 
                        htmlFor={`keyword-${keyword}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-warcrow-text"
                      >
                        {displayKeyword(keyword)}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {(selectedCharacteristics.length > 0 || selectedKeywords.length > 0 || searchQuery) && (
              <div className="flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-warcrow-gold hover:underline"
                >
                  {t('clearAllFilters')}
                </button>
              </div>
            )}
          </div>
        )}
        
        <SortControls sortBy={sortBy} onSortChange={(value) => setSortBy(value)} />
      </div>
      
      {sortedUnits.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {sortedUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              quantity={quantities[unit.id] || 0}
              onAdd={() => onAdd(unit.id)}
              onRemove={() => onRemove(unit.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-warcrow-muted">{t('noUnitsMatch')}</p>
          <button 
            onClick={clearAllFilters}
            className="mt-2 text-warcrow-gold hover:underline"
          >
            {t('clearAllFilters')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UnitListSection;
