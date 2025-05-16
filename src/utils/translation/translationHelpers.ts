
/**
 * Utility to find missing translations in the translations object
 */
export const findMissingTranslations = (translations: any, targetLanguage: string = 'es'): string[] => {
  const missingKeys: string[] = [];
  
  Object.entries(translations).forEach(([key, value]: [string, any]) => {
    // If the value doesn't have the target language or it's empty
    if (!value[targetLanguage] || value[targetLanguage].trim() === '') {
      missingKeys.push(key);
    }
  });
  
  return missingKeys;
};

/**
 * Creates a custom event to report translation progress
 */
export const reportTranslationProgress = (completed: number, total: number): void => {
  if (typeof window === 'undefined') return;
  
  const progress = Math.round((completed / total) * 100);
  const event = new CustomEvent('translation-progress', {
    detail: { completed, total, progress }
  });
  
  window.dispatchEvent(event);
};

/**
 * Helper to determine the appropriate column name for a translation
 */
export const getTranslationColumnName = (
  itemKey: string, 
  tableType: string, 
  language: string
): string => {
  const columnPrefix = language.toLowerCase();
  
  switch (tableType) {
    case 'rules_chapters':
      return `title_${columnPrefix}`;
      
    case 'rules_sections':
      return itemKey === 'title' ? `title_${columnPrefix}` : `content_${columnPrefix}`;
      
    case 'faq_sections':
      return itemKey === 'section' ? `section_${columnPrefix}` : `content_${columnPrefix}`;
      
    case 'unit_keywords':
    case 'special_rules':
    case 'unit_characteristics':
      return `description_${columnPrefix}`;
      
    case 'unit_data':
      return itemKey === 'name' ? `name_${columnPrefix}` : `description_${columnPrefix}`;
      
    default:
      return '';
  }
};
