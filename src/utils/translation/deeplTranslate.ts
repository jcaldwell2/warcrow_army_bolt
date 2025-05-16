
/**
 * DeepL API wrapper for translating text
 * This function handles translation using the DeepL API
 */
export const translateWithDeepL = async (
  text: string,
  targetLanguage: string = 'ES',
  formality: 'default' | 'more' | 'less' = 'default'
): Promise<string> => {
  try {
    const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';
    
    if (!DEEPL_API_KEY) {
      console.error('DeepL API key is not configured');
      return text;
    }
    
    // Ensure proper language formatting (DeepL uses ES not es)
    const formattedLang = targetLanguage.toUpperCase();
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: formattedLang,
        formality: formality
      })
    });

    if (!response.ok) {
      throw new Error(`DeepL API returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Error in DeepL translation:', error);
    return text; // Return original text as fallback
  }
};
