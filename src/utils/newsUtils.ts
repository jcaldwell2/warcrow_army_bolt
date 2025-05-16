
import { supabase } from "@/integrations/supabase/client";
import { NewsItem } from "@/data/newsArchive";
import { translations } from "@/i18n/translations";

interface NewsTranslation {
  en: string;
  es: string;
  fr: string; // French translation included
}

interface NewsItemDB {
  id: string;
  news_id: string;
  date: string;
  translation_key: string;
  content_en: string;
  content_es: string;
  content_fr: string; // French content included
  created_at: string;
  updated_at: string;
}

interface UpdateNewsRequest {
  id: string;
  date: string;
  key: string;
  content: NewsTranslation;
}

// Function to convert database item to app format
const convertToNewsItem = (dbItem: NewsItemDB): NewsItem => {
  return {
    id: dbItem.news_id || dbItem.id, // Ensure we always have an ID
    date: dbItem.date,
    key: dbItem.translation_key
  };
};

// Function to translate text using DeepL
export const translateWithDeepL = async (
  text: string, 
  targetLanguage: string = 'ES'
): Promise<string> => {
  if (!text) return '';
  
  try {
    const { data, error } = await supabase.functions.invoke('deepl-translate', {
      body: {
        texts: [text],
        targetLanguage: targetLanguage.toUpperCase(),
        formality: 'more'
      }
    });

    if (error) {
      console.error('Error using DeepL translation:', error);
      throw error;
    }

    if (data && data.translations && data.translations.length > 0) {
      return data.translations[0];
    }

    throw new Error('No translation returned from DeepL');
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to original text
    return text;
  }
};

// Function to auto-translate English text to Spanish and French
export const translateContent = async (
  englishText: string, 
  targetLanguage: string = 'ES'
): Promise<string> => {
  if (!englishText) return '';
  
  // Use DeepL for proper translation
  try {
    return await translateWithDeepL(englishText, targetLanguage);
  } catch (error) {
    console.error(`Failed to translate to ${targetLanguage}:`, error);
    
    // Fallback to simple mock translation for testing
    if (targetLanguage.toLowerCase() === 'es') {
      const commonTranslations: Record<string, string> = {
        'News': 'Noticias',
        'update': 'actualización',
        'unit': 'unidad',
        'units': 'unidades',
        'added': 'añadido',
        'profiles': 'perfiles',
        'for': 'para',
        'have': 'han',
        'been': 'sido',
        'The': 'El',
        'next': 'próximo',
        'include': 'incluirá',
        'will': 'va a',
        'Play': 'Modo de Juego',
        'Mode': 'Modo',
        'now': 'ahora',
        'includes': 'incluye',
        'tournament': 'torneo',
        'missions': 'misiones',
        'Try': 'Prueba',
        'them': 'las',
        'out': '',
        'and': 'y',
        'share': 'comparte',
        'your': 'tu',
        'feedback': 'opinión'
      };
      
      let translatedText = englishText;
      
      // Replace words based on our simple dictionary
      Object.keys(commonTranslations).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        translatedText = translatedText.replace(regex, commonTranslations[word]);
      });
      
      return translatedText;
    } else if (targetLanguage.toLowerCase() === 'fr') {
      // Simple fallback for French translation
      const commonFrenchTranslations: Record<string, string> = {
        'News': 'Nouvelles',
        'update': 'mise à jour',
        'unit': 'unité',
        'units': 'unités',
        'added': 'ajouté',
        'profiles': 'profils',
        'for': 'pour',
        'have': 'ont',
        'been': 'été',
        'The': 'Le',
        'next': 'prochain',
        'include': 'inclura',
        'will': 'va',
        'Play': 'Mode de Jeu',
        'Mode': 'Mode',
        'now': 'maintenant',
        'includes': 'inclut',
        'tournament': 'tournoi',
        'missions': 'missions',
        'Try': 'Essayez',
        'them': 'les',
        'out': '',
        'and': 'et',
        'share': 'partagez',
        'your': 'votre',
        'feedback': 'avis'
      };
      
      let translatedText = englishText;
      
      // Replace words based on our French dictionary
      Object.keys(commonFrenchTranslations).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        translatedText = translatedText.replace(regex, commonFrenchTranslations[word]);
      });
      
      return translatedText;
    }
    
    // For other languages, return original text
    return englishText;
  }
};

// Function to fetch all news items from the database
export const fetchNewsItems = async (): Promise<NewsItem[]> => {
  try {
    // Log the start of the fetch process for debugging
    console.log('Fetching news items from Supabase...');
    
    const startTime = performance.now();
    
    // Set a timeout for the database query - reduce from 2s to 800ms for faster fallback
    const timeoutPromise = new Promise<NewsItem[]>((resolve) => {
      setTimeout(() => {
        console.log('Database fetch timeout after 800ms');
        resolve([]);
      }, 800); // 800ms timeout for much faster response
    });
    
    // The actual fetch promise
    const fetchPromise = (async (): Promise<NewsItem[]> => {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching news items:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        console.log('No news items found in database');
        return [];
      }
      
      const fetchTime = performance.now() - startTime;
      console.log(`Found ${data.length} news items in database (fetch took ${fetchTime.toFixed(2)}ms)`);
      
      // Check if content_fr exists in the database schema
      const hasFrenchContent = data.some(item => 'content_fr' in item);
      console.log('Database has content_fr field:', hasFrenchContent);
      
      // Handle existing data that might not have content_fr yet
      const processedData = data.map(item => {
        // Ensure we have news_id - crucial fix for ID handling
        const newsId = item.news_id || item.id;
        
        // Ensure content_fr exists (using an empty string if it doesn't)
        const processedItem = {
          ...item,
          content_fr: 'content_fr' in item ? item.content_fr : '',
          news_id: newsId
        } as NewsItemDB;
        
        return processedItem;
      });
      
      // Update the in-memory translations for each news item
      processedData.forEach(item => {
        translations[item.translation_key] = {
          en: item.content_en || '',
          es: item.content_es || '',
          fr: item.content_fr || '' // Use the processed content_fr
        };
      });
      
      // Convert to app format
      const newsItems = processedData.map(convertToNewsItem);
      console.log(`Processed ${newsItems.length} news items successfully`);
      return newsItems;
    })();
    
    // Race between the timeout and the fetch
    return Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error in fetchNewsItems:', error);
    return [];
  }
};

// Function to update a news item
export const updateNewsItem = async (newsData: UpdateNewsRequest): Promise<boolean> => {
  try {
    console.log('Updating news with content:', newsData.content);
    
    // Update the database
    const { error } = await supabase
      .from('news_items')
      .update({
        date: newsData.date,
        translation_key: newsData.key,
        content_en: newsData.content.en,
        content_es: newsData.content.es,
        content_fr: newsData.content.fr,  // Include French content
      })
      .eq('news_id', newsData.id);
    
    if (error) {
      console.error('Error updating news item in database:', error);
      return false;
    }
    
    // Also update local translations cache
    translations[newsData.key] = {
      en: newsData.content.en,
      es: newsData.content.es,
      fr: newsData.content.fr,  // Include French content
    };
    
    console.log('Updated news item successfully:', newsData);
    return true;
  } catch (error) {
    console.error('Error updating news item:', error);
    return false;
  }
};

// Function to create a new news item
export const createNewsItem = async (newsData: UpdateNewsRequest): Promise<boolean> => {
  try {
    console.log('Creating news with content:', newsData.content);
    
    // Add to the database
    const { error } = await supabase
      .from('news_items')
      .insert({
        news_id: newsData.id,
        date: newsData.date,
        translation_key: newsData.key,
        content_en: newsData.content.en,
        content_es: newsData.content.es,
        content_fr: newsData.content.fr,  // Include French content
      });
    
    if (error) {
      console.error('Error creating news item in database:', error);
      return false;
    }
    
    // Also update local translations cache
    translations[newsData.key] = {
      en: newsData.content.en,
      es: newsData.content.es,
      fr: newsData.content.fr,  // Include French content
    };
    
    console.log('Created new news item successfully:', newsData);
    return true;
  } catch (error) {
    console.error('Error creating news item:', error);
    return false;
  }
};

// Function to delete a news item
export const deleteNewsItem = async (id: string): Promise<boolean> => {
  try {
    // Delete from the database
    const { error } = await supabase
      .from('news_items')
      .delete()
      .eq('news_id', id);
    
    if (error) {
      console.error('Error deleting news item from database:', error);
      return false;
    }
    
    console.log('Deleted news item successfully:', id);
    return true;
  } catch (error) {
    console.error('Error deleting news item:', error);
    return false;
  }
};

// Function to get a single news item
export const getNewsItem = async (id: string): Promise<NewsItem | null> => {
  try {
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .eq('news_id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching news item:', error);
      return null;
    }

    // Handle data that might not have content_fr yet
    const processedItem = {
      ...data,
      content_fr: 'content_fr' in data ? data.content_fr : ''
    } as NewsItemDB;
    
    return convertToNewsItem(processedItem);
  } catch (error) {
    console.error('Error in getNewsItem:', error);
    return null;
  }
};
