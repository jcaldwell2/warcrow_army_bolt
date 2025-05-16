
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { keywordDefinitions } from '@/data/keywordDefinitions';

export const useKeywordTranslations = () => {
  const [keywordTranslations, setKeywordTranslations] = useState<Record<string, Record<string, string>>>({});
  const [keywordDescriptions, setKeywordDescriptions] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const fetchKeywords = async () => {
      const { data: keywordData, error: keywordError } = await supabase
        .from('unit_keywords')
        .select('*');
      
      if (!keywordError && keywordData) {
        const translations: Record<string, Record<string, string>> = {};
        const descriptions: Record<string, Record<string, string>> = {};
        
        keywordData.forEach(item => {
          if (!translations[item.name]) {
            translations[item.name] = { 'en': item.name };
          }
          
          // Store translations if available
          if (item.name_es) translations[item.name]['es'] = item.name_es;
          if (item.name_fr) translations[item.name]['fr'] = item.name_fr;
          
          // If no translations, use English as fallback
          if (!translations[item.name]['es']) translations[item.name]['es'] = item.name;
          if (!translations[item.name]['fr']) translations[item.name]['fr'] = item.name;
          
          // Store descriptions separately
          if (!descriptions[item.name]) {
            descriptions[item.name] = { 'en': item.description || '' };
          }
          
          if (item.description_es) descriptions[item.name]['es'] = item.description_es;
          if (item.description_fr) descriptions[item.name]['fr'] = item.description_fr;
        });
        
        // Add keywords from static definitions that might not be in the database
        Object.keys(keywordDefinitions).forEach(keyword => {
          if (!translations[keyword]) {
            translations[keyword] = { 
              'en': keyword,
              'es': keyword, // Default to English if no translation exists
              'fr': keyword  // Default to English if no translation exists
            };
          }
          
          if (!descriptions[keyword]) {
            descriptions[keyword] = { 'en': keywordDefinitions[keyword] || '' };
          }
        });
        
        setKeywordTranslations(translations);
        setKeywordDescriptions(descriptions);
      }
    };

    fetchKeywords();
  }, []);

  const translateKeyword = (keyword: string, language: string): string => {
    if (!keyword || language === 'en') return keyword;
    
    // For keywords, handle parameter sections separately
    const basePart = keyword.split('(')[0].trim();
    const params = keyword.includes('(') ? keyword.substring(keyword.indexOf('(')) : '';
    
    // Get the translated base part
    const translatedBase = keywordTranslations[basePart]?.[language] || basePart;
    
    // Return the translated base with parameters if they exist
    return translatedBase + (params ? ' ' + params : '');
  };

  const translateKeywordDescription = (keyword: string, language: string): string => {
    if (!keyword) return '';
    
    // Extract base keyword name without parameters
    const baseKeyword = keyword.split('(')[0].trim();
    
    // First try to get the description in the requested language
    const descriptionInRequestedLanguage = keywordDescriptions[baseKeyword]?.[language];
    
    // If not found, fall back to English
    const descriptionInEnglish = keywordDescriptions[baseKeyword]?.['en'] || 
                                keywordDefinitions[baseKeyword] || '';
    
    // Return whichever is available, or empty string if neither
    return descriptionInRequestedLanguage || descriptionInEnglish || '';
  };

  return {
    translateKeyword,
    translateKeywordDescription
  };
};
