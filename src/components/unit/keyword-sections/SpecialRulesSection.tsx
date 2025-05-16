
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from '@/utils/translationUtils';
import SpecialRuleTooltip from './SpecialRuleTooltip';

interface SpecialRulesSectionProps {
  specialRules?: string[];
}

const SpecialRulesSection: React.FC<SpecialRulesSectionProps> = ({ specialRules }) => {
  const { language, t } = useLanguage();
  const { translateSpecialRule } = useTranslateKeyword();
  
  if (!specialRules || specialRules.length === 0) return null;

  const getSectionTitle = (lang: string): string => {
    switch(lang) {
      case 'es':
        return 'Reglas Especiales';
      case 'fr':
        return 'Règles Spéciales';
      default:
        return 'Special Rules';
    }
  };

  return (
    <div className="mt-2">
      <span className="text-xs font-semibold text-warcrow-text">
        {getSectionTitle(language)}:
      </span>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {specialRules.map((rule, index) => {
          // Store the original rule name for description lookup
          const originalName = rule;
          // Get the base rule name without parameters
          const baseRuleName = rule.split('(')[0].trim();
          // Get the translated base name 
          const translatedBase = translateSpecialRule(baseRuleName, language);
          
          // Reconstruct the full rule name with parameters if needed
          let translatedRule = translatedBase;
          if (rule.includes('(')) {
            const params = rule.split('(')[1];
            translatedRule = `${translatedBase} (${params}`;
          }
          
          return (
            <SpecialRuleTooltip 
              key={index}
              ruleName={translatedRule}
              originalName={originalName}
              className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/20 border border-warcrow-gold hover:bg-warcrow-gold/30 transition-colors text-warcrow-text"
            />
          );
        })}
      </div>
    </div>
  );
};

export default SpecialRulesSection;
