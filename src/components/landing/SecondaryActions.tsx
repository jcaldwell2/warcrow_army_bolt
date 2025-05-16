
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { HelpCircle, Coffee } from "lucide-react";

interface SecondaryActionsProps {
  isGuest: boolean;
  onSignOut: () => void;
}

export const SecondaryActions = ({ isGuest, onSignOut }: SecondaryActionsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleBuyCoffeeClick = () => {
    navigate('/about');
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center md:mt-2">
      <Button
        onClick={onSignOut}
        variant="outline"
        className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
      >
        {isGuest ? t('signedAsGuest') : t('signOut')}
      </Button>
      <Button
        onClick={handleBuyCoffeeClick}
        variant="outline"
        className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black flex items-center gap-2"
      >
        <Coffee className="h-4 w-4" />
        {t('buyCoffee')}
      </Button>
      <Button
        onClick={() => navigate('/faq')}
        variant="outline"
        className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black flex items-center gap-2"
      >
        <HelpCircle className="h-4 w-4" />
        {t('faqTitle')}
      </Button>
    </div>
  );
};
