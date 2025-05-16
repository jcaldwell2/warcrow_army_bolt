
import React from 'react';
import { FAQItem } from './FAQItem';
import { FAQSection } from '@/services/faqService';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQListProps {
  items: FAQSection[];
}

export const FAQList: React.FC<FAQListProps> = ({ items }) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="mt-6 space-y-6 w-full mx-auto">
      {items.length === 0 ? (
        <div className="text-center py-8 text-warcrow-gold/60">
          {t('noResults')}
        </div>
      ) : (
        items.map((item) => {
          // Select the appropriate language content
          let sectionText = item.section;
          let contentText = item.content;
          
          if (language === 'es' && item.section_es && item.content_es) {
            sectionText = item.section_es;
            contentText = item.content_es;
          }
          else if (language === 'fr' && item.section_fr && item.content_fr) {
            sectionText = item.section_fr;
            contentText = item.content_fr;
          }
          
          return (
            <FAQItem 
              key={item.id} 
              section={sectionText} 
              content={contentText} 
            />
          );
        })
      )}
    </div>
  );
};
