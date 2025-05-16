
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-warcrow-gold/50 text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black flex items-center gap-1"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black border border-warcrow-gold/30">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`flex items-center gap-2 ${
              language === lang.code 
                ? 'text-warcrow-gold' 
                : 'text-white hover:text-warcrow-gold'
            } cursor-pointer`}
            onClick={() => setLanguage(lang.code as 'en' | 'es' | 'fr')}
          >
            {language === lang.code && <Check className="h-3 w-3" />}
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
