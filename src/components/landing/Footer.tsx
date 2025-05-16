
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-warcrow-background/95 text-center text-xs md:text-sm text-warcrow-text/60 p-2 md:p-4 z-10">
      <div className="max-w-md md:max-w-2xl mx-auto px-2 space-y-1">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-1">
          <Link to="/about" className="text-warcrow-gold/80 hover:text-warcrow-gold">
            {t('about')}
          </Link>
          <Link to="/privacy-policy" className="text-warcrow-gold/80 hover:text-warcrow-gold">
            {t('privacyPolicy')}
          </Link>
          <Link to="/terms-of-service" className="text-warcrow-gold/80 hover:text-warcrow-gold">
            {t('termsOfService')}
          </Link>
        </div>
        <p>
          {t('footerText')}
        </p>
        <p className="text-xs text-warcrow-text/40">
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
};
