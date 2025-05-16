
import { supabase } from "@/integrations/supabase/client";

// Default translations for backward compatibility
export const factionTranslations = {
  'hegemony-of-embersig': {
    en: 'Hegemony',
    es: 'Hegemonía',
    fr: 'Hégémonie'
  },
  'northern-tribes': {
    en: 'Northern Tribes',
    es: 'Tribus del Norte',
    fr: 'Tribus du Nord'
  },
  'scions-of-yaldabaoth': {
    en: 'Scions',
    es: 'Vástagos',
    fr: 'Rejetons'
  },
  'syenann': {
    en: 'Syenann',
    es: 'Syenann',
    fr: 'Syenann'
  },
  // Add backward compatibility for old keys
  hegemony: {
    en: 'Hegemony',
    es: 'Hegemonía',
    fr: 'Hégémonie'
  },
  tribes: {
    en: 'Northern Tribes',
    es: 'Tribus del Norte',
    fr: 'Tribus du Nord'
  },
  scions: {
    en: 'Scions',
    es: 'Vástagos',
    fr: 'Rejetons'
  }
};

// Enhanced function to get faction translations from Supabase
export const getFactionTranslationsFromDb = async () => {
  try {
    console.log("[getFactionTranslationsFromDb] Fetching faction translations from Supabase");
    const { data, error } = await supabase
      .from('factions')
      .select('*');
      
    if (error) {
      console.error('[getFactionTranslationsFromDb] Error fetching faction translations:', error);
      return factionTranslations; // Return default translations if there's an error
    }
    
    if (data && data.length > 0) {
      console.log(`[getFactionTranslationsFromDb] Successfully fetched ${data.length} faction translations`);
      
      // Create a new translations object
      const dbTranslations: Record<string, Record<string, string>> = {};
      
      // Populate translations from database, ensuring kebab-case IDs
      data.forEach(faction => {
        // Normalize faction ID to kebab-case if needed
        const factionId = faction.id.includes('-') ? faction.id : faction.id.toLowerCase().replace(/\s+/g, '-');
        
        dbTranslations[factionId] = {
          en: faction.name,
          es: faction.name_es || faction.name,
          fr: faction.name_fr || faction.name
        };
        
        // Log for debugging
        console.log(`[getFactionTranslationsFromDb] Added faction: ${factionId} => ${faction.name} (ES: ${faction.name_es || 'N/A'}, FR: ${faction.name_fr || 'N/A'})`);
      });
      
      // Merge with backwards compatibility entries
      const mergedTranslations = { ...dbTranslations, ...factionTranslations };
      console.log('[getFactionTranslationsFromDb] Merged translations:', Object.keys(mergedTranslations).length);
      
      return mergedTranslations;
    }
    
    console.log('[getFactionTranslationsFromDb] No faction data found, using default translations');
    return factionTranslations;
  } catch (error) {
    console.error('[getFactionTranslationsFromDb] Failed to fetch faction translations:', error);
    return factionTranslations;
  }
};
