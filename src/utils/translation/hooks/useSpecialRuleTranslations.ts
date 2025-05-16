import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";

export const useSpecialRuleTranslations = () => {
  const [specialRuleTranslations, setSpecialRuleTranslations] = useState<Record<string, Record<string, string>>>({});
  const [specialRuleDescriptions, setSpecialRuleDescriptions] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const fetchSpecialRules = async () => {
      const { data: rulesData, error: rulesError } = await supabase
        .from('special_rules')
        .select('*');
      
      if (!rulesError && rulesData) {
        const translations: Record<string, Record<string, string>> = {};
        const descriptions: Record<string, Record<string, string>> = {};
        
        rulesData.forEach(item => {
          if (!translations[item.name]) {
            translations[item.name] = { 'en': item.name };
          }
          
          // Store translations for non-English languages if available
          // Note: name_es and name_fr don't exist in the current schema,
          // so we use the English name as default for all languages
          translations[item.name]['es'] = item.name;
          translations[item.name]['fr'] = item.name;
          
          // Store descriptions separately
          if (!descriptions[item.name]) {
            descriptions[item.name] = { 'en': item.description || '' };
          }
          
          if (item.description_es) descriptions[item.name]['es'] = item.description_es;
          if (item.description_fr) descriptions[item.name]['fr'] = item.description_fr;
        });

        // Add special rules from static definitions that might not be in the database
        Object.keys(specialRuleDefinitions).forEach(ruleName => {
          if (!translations[ruleName]) {
            translations[ruleName] = { 
              'en': ruleName,
              'es': ruleName, // Default to English if no translation exists
              'fr': ruleName  // Default to English if no translation exists
            };
          }
          
          if (!descriptions[ruleName]) {
            descriptions[ruleName] = { 'en': specialRuleDefinitions[ruleName] || '' };
          }
        });
        
        setSpecialRuleTranslations(translations);
        setSpecialRuleDescriptions(descriptions);
      }
    };

    fetchSpecialRules();
  }, []);

  const translateSpecialRule = (rule: string, language: string): string => {
    if (!rule || language === 'en') return rule;
    
    // For special rules, handle parameter sections separately
    const basePart = rule.split('(')[0].trim();
    const params = rule.includes('(') ? rule.substring(rule.indexOf('(')) : '';
    
    // Get the translated base part
    const translatedBase = specialRuleTranslations[basePart]?.[language] || basePart;
    
    // Return the translated base with parameters if they exist
    return translatedBase + (params ? ' ' + params : '');
  };

  const translateSpecialRuleDescription = (rule: string, language: string): string => {
    if (!rule) return '';
    
    // Extract base rule name without parameters
    const baseRule = rule.split('(')[0].trim();
    
    // First try to get the English description as the base
    const englishDescription = specialRuleDescriptions[baseRule]?.['en'] || 
                               specialRuleDefinitions[baseRule] || '';
    
    // If language is English or no translation exists, return the English description
    if (language === 'en') {
      return englishDescription;
    }
    
    // Otherwise, return the requested language if available or default to English
    return specialRuleDescriptions[baseRule]?.[language] || englishDescription || '';
  };

  return {
    translateSpecialRule,
    translateSpecialRuleDescription
  };
};
