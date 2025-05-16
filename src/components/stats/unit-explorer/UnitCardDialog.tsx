
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UnitCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  unitName: string;
  cardUrl: string;
}

const UnitCardDialog: React.FC<UnitCardDialogProps> = ({
  isOpen,
  onClose,
  unitName,
  cardUrl,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  
  // Reset state when dialog opens or URL changes
  useEffect(() => {
    if (isOpen) {
      setImageError(false);
      setIsLoading(true);
      console.log(`Dialog opened with card URL: ${cardUrl}, language: ${language}`);
    }
  }, [isOpen, cardUrl, language]);
  
  const getCardText = () => {
    if (language === 'en') return 'Unit Card';
    if (language === 'es') return 'Tarjeta de Unidad';
    return 'Carte d\'Unité';
  };

  const getNotAvailableText = () => {
    if (language === 'en') return 'Image not available';
    if (language === 'es') return 'Imagen no disponible';
    return 'Image non disponible';
  };

  const getTryAgainText = () => {
    if (language === 'en') return 'Please try again later';
    if (language === 'es') return 'Por favor, inténtelo más tarde';
    return 'Veuillez réessayer plus tard';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="p-0 border-warcrow-gold/30 bg-black/95 overflow-hidden max-w-[90vw] md:max-w-[600px] max-h-[90vh]"
      >
        <DialogTitle className="sr-only">{unitName} {getCardText()}</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed card for {unitName} unit
        </DialogDescription>
        
        <DialogClose className="absolute right-2 top-2 z-50 rounded-full bg-black/70 p-1 text-warcrow-gold hover:bg-black/90">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
              <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold/70" />
            </div>
          )}
          
          {!imageError && (
            <img
              src={cardUrl}
              alt={`${unitName} ${getCardText()}`}
              className={`w-auto max-h-[80vh] transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => {
                console.log(`Image loaded successfully: ${cardUrl}`);
                setIsLoading(false);
              }}
              onError={(e) => {
                console.error(`Image load error: ${cardUrl}`);
                setImageError(true);
                setIsLoading(false);
              }}
            />
          )}
          
          {imageError && !isLoading && (
            <div className="p-8 flex flex-col items-center justify-center gap-2 text-warcrow-gold/70 text-center">
              <div className="text-sm">{getNotAvailableText()}</div>
              <div className="text-xs opacity-70">{getTryAgainText()}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardDialog;
