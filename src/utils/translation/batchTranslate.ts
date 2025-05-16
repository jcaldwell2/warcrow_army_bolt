
import { toast } from "sonner";

// Constants
const DEEPL_API_ENDPOINT = "https://api.deepl.com/v2/translate";
const NETLIFY_FUNCTION_ENDPOINT = "/.netlify/functions/deepl-translate";

// Create a single toast ID for translation status
let translationToastId: string | number | undefined;

/**
 * Batch translate an array of texts
 * @param texts Array of texts to translate
 * @param targetLang Target language code (es, fr, etc)
 * @param sourceLang Source language code (default: en)
 * @returns Promise with translated texts
 */
export const batchTranslate = async (
  texts: string[],
  targetLang: string,
  sourceLang: string = "en"
): Promise<string[]> => {
  try {
    // Filter out empty strings to save API calls
    const validTexts = texts.filter(text => text && text.trim() !== '');
    
    if (validTexts.length === 0) {
      return [];
    }

    // Display a single toast for translation process
    if (translationToastId) {
      toast.dismiss(translationToastId);
    }
    
    translationToastId = toast.loading(`Translating to ${targetLang.toUpperCase()}...`, {
      id: "translation-progress"
    });

    // Use edge function for translation
    const response = await fetch(NETLIFY_FUNCTION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: validTexts,
        target_lang: targetLang.toUpperCase(),
        source_lang: sourceLang.toUpperCase(),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Translation failed: ${error}`);
    }

    const result = await response.json();
    
    // Update progress event with custom event
    window.dispatchEvent(new CustomEvent('translation-progress', { 
      detail: { progress: 100 } 
    }));
    
    // Update toast
    toast.success(`Translation complete!`, {
      id: translationToastId
    });
    
    // Clear the toast ID
    translationToastId = undefined;
    
    // Return translated texts
    return result.translations.map((t: any) => t.text);
  } catch (error: any) {
    console.error("Translation error:", error);

    // Show error toast
    toast.error(`Translation failed: ${error.message}`, {
      id: translationToastId
    });
    
    // Clear the toast ID
    translationToastId = undefined;
    
    // Update progress event with custom event to complete
    window.dispatchEvent(new CustomEvent('translation-progress', { 
      detail: { progress: 0 } 
    }));
    
    throw error;
  }
};

/**
 * Translate a single text string
 * @param text Text to translate
 * @param targetLang Target language code (es, fr, etc)
 * @param sourceLang Source language code (default: en)
 * @returns Promise with translated text
 */
export const translateText = async (
  text: string,
  targetLang: string,
  sourceLang: string = "en"
): Promise<string> => {
  if (!text || text.trim() === '') {
    return '';
  }
  
  const results = await batchTranslate([text], targetLang, sourceLang);
  return results[0] || '';
};

/**
 * Helper function to translate text specifically to French
 * @param text Text to translate
 * @param sourceLang Source language code (default: en)
 * @returns Promise with French translated text
 */
export const translateToFrench = async (
  text: string,
  sourceLang: string = "en"
): Promise<string> => {
  return translateText(text, 'fr', sourceLang);
};
