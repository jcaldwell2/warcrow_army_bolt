
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUnitNameTranslations } from './hooks/useUnitNameTranslations';
import { useKeywordTranslations } from './hooks/useKeywordTranslations';
import { useSpecialRuleTranslations } from './hooks/useSpecialRuleTranslations';
import { useCharacteristicTranslations } from './hooks/useCharacteristicTranslations';

export const useTranslateKeyword = () => {
  const { language } = useLanguage();
  const [keywordsMap, setKeywordsMap] = useState<Record<string, { es?: string, fr?: string }>>({});
  
  // Import all the translation hooks
  const { translateUnitName } = useUnitNameTranslations();
  const { translateKeyword, translateKeywordDescription } = useKeywordTranslations();
  const { translateSpecialRule, translateSpecialRuleDescription } = useSpecialRuleTranslations();
  const { translateCharacteristic, translateCharacteristicDescription } = useCharacteristicTranslations();
  
  useEffect(() => {
    const fetchKeywords = async () => {
      const { data, error } = await supabase
        .from('unit_keywords')
        .select('id, name, name_es, name_fr');
        
      if (error) {
        console.error('Error fetching unit keywords:', error);
        return;
      }
      
      if (data) {
        const map: Record<string, { es?: string, fr?: string }> = {};
        data.forEach(kw => {
          map[kw.name.toLowerCase()] = {
            es: kw.name_es || undefined,
            fr: kw.name_fr || undefined
          };
        });
        setKeywordsMap(map);
      }
    };
    
    fetchKeywords();
  }, []);
  
  return { 
    translateKeyword,
    translateKeywordDescription,
    translateUnitName,
    translateSpecialRule,
    translateSpecialRuleDescription,
    translateCharacteristic,
    translateCharacteristicDescription,
    keywordsMap 
  };
};
