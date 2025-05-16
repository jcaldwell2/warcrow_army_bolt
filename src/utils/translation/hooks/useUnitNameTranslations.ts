
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnitNameTranslations = () => {
  const [unitNameTranslations, setUnitNameTranslations] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const fetchUnitNames = async () => {
      const { data: unitsData, error: unitsError } = await supabase
        .from('unit_data')
        .select('*');
      
      if (!unitsError && unitsData) {
        const translations: Record<string, Record<string, string>> = {};
        
        unitsData.forEach(item => {
          if (!translations[item.name]) {
            translations[item.name] = { 'en': item.name };
          }
          
          if (item.name_es) translations[item.name]['es'] = item.name_es;
          if (item.name_fr) translations[item.name]['fr'] = item.name_fr;
        });
        
        setUnitNameTranslations(translations);
      }
    };

    fetchUnitNames();
  }, []);

  const translateUnitName = (name: string, language: string = 'en'): string => {
    if (!name || language === 'en') return name;
    return unitNameTranslations[name]?.[language] || name;
  };

  return {
    translateUnitName
  };
};
