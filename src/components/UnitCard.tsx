
import { Unit } from "@/types/army";
import UnitHeader from "./unit/UnitHeader";
import UnitControls from "./unit/UnitControls";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitCardKeywords from "./unit/card/UnitCardKeywords";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import UnitCardDialog from "./stats/unit-explorer/UnitCardDialog";

interface UnitCardProps {
  unit: Unit;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitCard = ({ unit, quantity, onAdd, onRemove }: UnitCardProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  const [isCardDialogOpen, setIsCardDialogOpen] = useState<boolean>(false);
  const [cardUrl, setCardUrl] = useState<string>("");
  
  // Translate unit name based on the selected language for display only
  const displayName = translateUnitName(unit.name, language);

  // Improved function to generate the correct GitHub card URL based on the unit name 
  // Always using English names for file paths regardless of selected language
  const getCardUrl = () => {
    // Debug the incoming unit name
    console.log(`Getting card URL for: ${unit.name} (${unit.id})`);
  
    // Special cases mapping for tricky unit names - expanded list
    const specialCases: Record<string, string> = {
      // Core cases for specific units
      "Aggressors": "aggressors",
      "Ahlwardt Ice Bear": "ahlwardt_ice_bear",
      "Battle-Scarred": "battle-scarred",
      "Battle Scarred": "battle-scarred", // Alternative spelling
      "BattleScarred": "battle-scarred", // Alternative spelling
      "Dragoslav Bjelogrc": "dragoslav_bjelogrc_drago_the_anvil",
      "Lady Telia": "lady_telia",
      "Nayra Caladren": "nayra_caladren",
      "Naergon Caladren": "naergon_caladren",
      "Eskold The Executioner": "eskold_the_executioner",
      "Mk-Os Automata": "mk-os_automata",
      "Iriavik Restless Pup": "iriavik_restless_pup",
      "Njord The Merciless": "njord_the_merciless",
      "Trabor Slepmund": "trabor_slepmund",
      "Darach Wildling": "darach_wildling",
      "Marhael The Refused": "marhael_the_refused",
      // Add more special cases as needed
    };
    
    // First check if we have a special case mapping for this unit
    let baseNameForUrl = specialCases[unit.name];
    
    // If no special mapping exists, create the URL-friendly name
    if (!baseNameForUrl) {
      // Try to normalize the name first by checking for hyphenated versions
      const normalizedName = unit.name
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert camelCase to space-separated
        .trim();
        
      // Check again with the normalized name
      baseNameForUrl = specialCases[normalizedName];
      
      // If still no match, create a URL-friendly version
      if (!baseNameForUrl) {
        baseNameForUrl = unit.name
          .toLowerCase()
          .replace(/\s+/g, '_')  // Replace spaces with underscores
          .replace(/[-]/g, '_')  // Replace hyphens with underscores for consistency
          .replace(/[']/g, '')   // Remove apostrophes
          .replace(/[^a-z0-9_-]/g, ''); // Remove any other non-alphanumeric characters
      }
    }
    
    // Base URL pointing to the card directory
    const baseUrl = `/art/card/${baseNameForUrl}_card`;
    
    // Add language suffix for display purposes, but always fall back to English if localized version doesn't exist
    let suffix = '';
    if (language === 'es') {
      suffix = '_sp';
    } else if (language === 'fr') {
      suffix = '_fr';
    }
    
    // Generate full URL - note that we'll attempt to load the localized version first
    // but the onError handler will try the English version if needed
    const fullUrl = `${baseUrl}${suffix}.jpg`;
    console.log(`Generated card URL for ${unit.name}: ${fullUrl}`);
    return fullUrl;
  };

  // Preload image when component is mounted or language changes
  useEffect(() => {
    const preloadImage = () => {
      if (unit) {
        const url = getCardUrl();
        setCardUrl(url);
        
        // Create a new Image to preload
        const img = new Image();
        img.src = url;
        
        // If localized version fails, try loading the English version as fallback
        img.onerror = () => {
          // If error and we have a language suffix, try the English version
          if (language !== 'en') {
            const englishUrl = url.replace(/_sp\.jpg$|_fr\.jpg$/, '.jpg');
            console.log(`Localized image failed, trying English version: ${englishUrl}`);
            
            // Set the fallback URL
            setCardUrl(englishUrl);
            
            // Preload the English version too
            const fallbackImg = new Image();
            fallbackImg.src = englishUrl;
          }
        };
        
        console.log(`Preloading image for ${unit.name}: ${url}`);
      }
    };
    
    preloadImage();
  }, [language, unit.name, unit.id]);

  // Function to handle view card button click
  const handleViewCardClick = () => {
    const url = getCardUrl();
    console.log("Opening card dialog with URL:", url);
    setCardUrl(url);
    setIsCardDialogOpen(true);
  };

  return (
    <div className="bg-warcrow-accent rounded-lg p-3 md:p-4 space-y-2 md:space-y-3 relative flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex-1">
          <UnitHeader 
            unit={unit} 
            mainName={displayName}
            portraitUrl={unit.imageUrl}
          />
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
          <span className="text-warcrow-gold font-semibold">
            {unit.pointsCost} {language === 'en' ? "points" : (language === 'es' ? "puntos" : "points")}
          </span>
          <UnitControls 
            quantity={quantity} 
            onAdd={onAdd} 
            onRemove={onRemove}
            availability={unit.availability}
            pointsCost={unit.pointsCost}
          />
        </div>
      </div>

      <UnitCardKeywords 
        unit={unit}
        isMobile={isMobile}
      />
      
      <div className="mt-auto pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewCardClick}
          className="text-xs w-full border-warcrow-gold/30 hover:bg-warcrow-gold/10"
        >
          {language === 'en' ? "Unit Card" : (language === 'es' ? "Tarjeta de Unidad" : "Carte d'Unité")}
        </Button>
      </div>

      <UnitCardDialog 
        isOpen={isCardDialogOpen}
        onClose={() => setIsCardDialogOpen(false)}
        unitName={displayName}
        cardUrl={cardUrl}
      />
    </div>
  );
};

export default UnitCard;
