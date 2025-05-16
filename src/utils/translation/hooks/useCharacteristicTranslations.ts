
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CharacteristicTranslation {
  name: string;
  [key: string]: any;
}

export const useCharacteristicTranslations = () => {
  const [characteristicTranslations, setCharacteristicTranslations] = useState<Record<string, Record<string, string>>>({});
  const [characteristicDescriptions, setCharacteristicDescriptions] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const fetchCharacteristics = async () => {
      const { data: characteristicsData, error: characteristicsError } = await supabase
        .from('unit_characteristics')
        .select('*');
      
      if (!characteristicsError && characteristicsData) {
        const translations: Record<string, Record<string, string>> = {};
        const descriptions: Record<string, Record<string, string>> = {};
        
        characteristicsData.forEach(item => {
          if (!translations[item.name]) {
            translations[item.name] = { 'en': item.name };
          }
          
          // Add name translations if available
          if (item.name_es) translations[item.name]['es'] = item.name_es;
          if (item.name_fr) translations[item.name]['fr'] = item.name_fr;
          
          // Store descriptions separately
          if (!descriptions[item.name]) {
            descriptions[item.name] = { 'en': item.description || '' };
          }
          
          if (item.description_es) descriptions[item.name]['es'] = item.description_es;
          if (item.description_fr) descriptions[item.name]['fr'] = item.description_fr;
        });
        
        setCharacteristicTranslations(translations);
        setCharacteristicDescriptions(descriptions);
      }
    };

    fetchCharacteristics();
  }, []);

  const translateCharacteristic = (characteristic: string, language: string): string => {
    if (!characteristic || language === 'en') return characteristic;
    return characteristicTranslations[characteristic]?.[language] || characteristic;
  };

  const translateCharacteristicDescription = (characteristic: string, language: string): string => {
    // First try to get the description in the requested language
    const descriptionInRequestedLanguage = characteristicDescriptions[characteristic]?.[language];
    
    // If not found, fall back to English
    const descriptionInEnglish = characteristicDescriptions[characteristic]?.['en'];
    
    // Return whichever is available, or empty string if neither
    return descriptionInRequestedLanguage || descriptionInEnglish || '';
  };

  return {
    translateCharacteristic,
    translateCharacteristicDescription
  };
};
