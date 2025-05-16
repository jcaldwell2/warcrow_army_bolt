
/**
 * Utility functions for the Unit Explorer component
 */

export const formatFactionName = (faction: string): string => {
  if (!faction) return 'Unknown';
  
  // Convert dashes to spaces and capitalize each word
  return faction
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const normalizeFactionName = (faction: string): string => {
  if (!faction) return '';
  
  // Convert to lowercase and replace spaces with dashes
  return faction.toLowerCase().replace(/\s+/g, '-');
};

export const getUnitType = (unit: any): string => {
  return unit.type || 'Unknown';
};

export const formatKeywords = (unit: any, translateFn?: (keyword: string) => string): string => {
  const keywords = unit.keywords || [];
  
  if (keywords.length === 0) return '-';
  
  // If a translation function is provided, use it
  if (translateFn) {
    return keywords
      .map(keyword => translateFn(keyword))
      .join(', ');
  }
  
  return keywords.join(', ');
};
