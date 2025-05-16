
import { Button } from "./ui/button";
import { Minus, Eye, Check, Diamond } from "lucide-react";
import { SelectedUnit } from "@/types/army";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";

interface SelectedUnitsProps {
  selectedUnits: SelectedUnit[];
  onRemove: (unitId: string) => void;
}

const SelectedUnits = ({ selectedUnits, onRemove }: SelectedUnitsProps) => {
  const { t, language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  
  // Sort units to put High Command first
  const sortedUnits = [...selectedUnits].sort((a, b) => {
    if (a.highCommand && !b.highCommand) return -1;
    if (!a.highCommand && b.highCommand) return 1;
    return 0;
  });

  // Calculate total points
  const totalPoints = selectedUnits.reduce((total, unit) => {
    return total + (unit.pointsCost * unit.quantity);
  }, 0);

  // Calculate total command points
  const totalCommand = selectedUnits.reduce((total, unit) => {
    return total + ((unit.command || 0) * unit.quantity);
  }, 0);

  const formatUnitDisplay = (name: string, quantity: number | undefined) => {
    if (!name || typeof quantity !== 'number') return "";
    // Translate unit name if not in English
    const displayName = language !== 'en' ? translateUnitName(name, language) : name;
    const displayQuantity = Math.min(quantity, 9);
    return `${displayName} x${displayQuantity}`;
  };

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 space-y-2 flex flex-col max-h-[calc(100vh-12rem)]">
      <div className="flex-grow overflow-auto pr-1">
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {sortedUnits.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between bg-warcrow-background p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <div className="text-warcrow-text flex items-center gap-1">
                    <span>{formatUnitDisplay(unit.name, unit.quantity)}</span>
                    {unit.command ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-0.5 text-warcrow-gold">
                              <Diamond className="h-4 w-4" />
                              {unit.command}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('commandPoints')}: {unit.command}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                    {unit.highCommand && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Check className="h-4 w-4 text-warcrow-gold" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('highCommand')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <span className="text-warcrow-muted">
                    ({unit.pointsCost * unit.quantity} {t('pts')})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-warcrow-gold hover:text-warcrow-gold/80"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-warcrow-background border-warcrow-accent max-w-4xl w-[95vw] p-0">
                      <DialogTitle className="sr-only">
                        {language !== 'en' ? translateUnitName(unit.name, language) : unit.name} {t('cardImage')}
                      </DialogTitle>
                      {unit.imageUrl ? (
                        <img 
                          src={unit.imageUrl} 
                          alt={language !== 'en' ? translateUnitName(unit.name, language) : unit.name}
                          className="w-full h-auto rounded-lg object-contain max-h-[90vh]"
                          loading="eager"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-warcrow-background/50 rounded-lg flex items-center justify-center text-warcrow-muted">
                          {t('cardImage')} coming soon
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(unit.id)}
                    className="h-8 w-8 text-warcrow-gold hover:text-warcrow-gold/80"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        {selectedUnits.length === 0 && (
          <p className="text-warcrow-muted text-center py-4">{t('noUnitsSelected')}</p>
        )}
      </div>
      
      {selectedUnits.length > 0 && (
        <div className="flex justify-end pt-2 gap-4 border-t border-warcrow-background mt-2">
          <span className="text-warcrow-gold">
            {t('command')}: {totalCommand}
          </span>
          <span className="text-warcrow-gold">
            {t('totalPoints')}: {totalPoints}
          </span>
        </div>
      )}
    </div>
  );
};

export default SelectedUnits;
