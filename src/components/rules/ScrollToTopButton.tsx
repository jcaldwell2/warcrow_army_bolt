
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ScrollToTopButton = () => {
  const { t } = useLanguage();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      onClick={scrollToTop}
      variant="outline"
      className="fixed bottom-4 right-4 z-50 rounded-full p-2 bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
      aria-label={t('scrollToTop')}
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
};
