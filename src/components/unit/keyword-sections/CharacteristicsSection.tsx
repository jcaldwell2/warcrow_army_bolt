
import { Keyword } from "@/types/army";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translation/useTranslateKeyword";

interface CharacteristicsSectionProps {
  keywords: Keyword[];
  highCommand?: boolean;
}

const CharacteristicsSection = ({ keywords, highCommand }: CharacteristicsSectionProps) => {
  const isMobile = useIsMobile();
  const [openDialogCharacteristic, setOpenDialogCharacteristic] = useState<string | null>(null);
  const { language } = useLanguage();
  const { translateCharacteristic, translateCharacteristicDescription } = useTranslateKeyword();

  const characteristics = keywords.filter(k => 
    ["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
     "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
     "Construct", "Undead", "Mounted", "Cavalry"].includes(k.name)
  );

  if (characteristics.length === 0 && !highCommand) return null;

  // This component now properly displays just the characteristic name
  const CharacteristicContent = ({ text }: { text: string }) => (
    <p className="text-sm leading-relaxed">
      {translateCharacteristic(text, language)}
    </p>
  );

  // This component is used for the dialog which shows the full description
  const CharacteristicDescription = ({ text }: { text: string }) => (
    <p className="text-sm leading-relaxed">
      {translateCharacteristicDescription(text, language)}
    </p>
  );

  return (
    <div className="flex flex-wrap gap-1">
      {highCommand && (
        isMobile ? (
          <button 
            type="button"
            className="px-2 py-0.5 text-xs rounded bg-warcrow-gold text-black"
            onClick={() => setOpenDialogCharacteristic("High Command")}
          >
            {language !== 'en' ? translateCharacteristic("High Command", language) : "High Command"}
          </button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  type="button"
                  className="px-2 py-0.5 text-xs rounded bg-warcrow-gold text-black"
                >
                  {language !== 'en' ? translateCharacteristic("High Command", language) : "High Command"}
                </button>
              </TooltipTrigger>
              <TooltipContent 
                className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-w-[250px] whitespace-normal"
              >
                <CharacteristicContent text="High Command" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      )}
      {characteristics.map((keyword) => {
        const displayName = language !== 'en' 
          ? translateCharacteristic(keyword.name, language) 
          : keyword.name;
          
        return isMobile ? (
          <button 
            key={keyword.name}
            type="button"
            className="px-2 py-0.5 text-xs rounded bg-warcrow-background/50 border border-warcrow-gold/50 text-warcrow-text"
            onClick={() => setOpenDialogCharacteristic(keyword.name)}
          >
            {displayName}
          </button>
        ) : (
          <TooltipProvider key={keyword.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  type="button"
                  className="px-2 py-0.5 text-xs rounded bg-warcrow-background/50 border border-warcrow-gold/50 text-warcrow-text"
                >
                  {displayName}
                </button>
              </TooltipTrigger>
              <TooltipContent 
                className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-w-[250px] whitespace-normal"
              >
                <CharacteristicContent text={keyword.name} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}

      {openDialogCharacteristic && (
        <div 
          role="dialog" 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpenDialogCharacteristic(null)}
        >
          <div 
            className="bg-warcrow-background border border-warcrow-gold text-warcrow-text p-6 rounded-lg max-w-lg w-full mx-4 relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setOpenDialogCharacteristic(null)}
              className="absolute right-4 top-4 text-warcrow-text/70 hover:text-warcrow-text"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">
              {language !== 'en' 
                ? translateCharacteristic(openDialogCharacteristic, language)
                : openDialogCharacteristic}
            </h3>
            <div className="pt-2">
              <CharacteristicDescription text={openDialogCharacteristic} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacteristicsSection;
