
import { NavDropdown } from "@/components/ui/NavDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

export const MissionHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-black/50 p-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4 mx-auto md:mx-0">
            <img 
              src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
              alt="Warcrow Logo" 
              className="h-16"
            />
            <h1 className="text-3xl font-bold text-warcrow-gold text-center">{t('missions')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <NavDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};
