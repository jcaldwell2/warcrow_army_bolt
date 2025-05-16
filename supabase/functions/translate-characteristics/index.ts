
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle DeepL translation
async function translateWithDeepL(
  texts: string[],
  targetLanguage: string = 'ES',
  formality: 'default' | 'more' | 'less' = 'default'
) {
  try {
    if (!DEEPL_API_KEY) {
      throw new Error('DeepL API key is not configured');
    }
    
    // Filter out any empty texts or undefined values
    const filteredTexts = texts.filter(text => text && text.trim() !== '');
    
    if (filteredTexts.length === 0) {
      return [];
    }
    
    // Ensure proper language formatting (DeepL uses ES not es)
    const formattedLang = targetLanguage.toUpperCase();
    
    console.log(`Translating ${filteredTexts.length} items to ${formattedLang}`);
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: filteredTexts,
        target_lang: formattedLang,
        formality: formality
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.translations.map((t: any) => t.text);
  } catch (error) {
    console.error('Error in DeepL translation:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { characteristics, targetLanguage } = await req.json();
    
    if (!characteristics || !Array.isArray(characteristics) || characteristics.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: characteristics array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${characteristics.length} characteristics for translation to ${targetLanguage}`);

    // Determine which field needs translation based on targetLanguage
    const translationField = targetLanguage === 'es' ? 'name_es' : 'name_fr';
    
    // Filter characteristics that need translation:
    // - If translation field is missing or empty
    // - OR if translation is identical to English name (could be default value or untranslated)
    const needsTranslation = characteristics.filter(char => {
      const currentTranslation = char[translationField];
      return !currentTranslation || 
             currentTranslation.trim() === '' || 
             currentTranslation === char.name;
    });
    
    console.log(`Found ${needsTranslation.length} characteristics needing translation to ${targetLanguage}`);
    
    if (needsTranslation.length === 0) {
      return new Response(
        JSON.stringify({ 
          translations: [],
          count: 0,
          message: 'All characteristics already have translations'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract name strings for translation
    const textsToTranslate = needsTranslation.map(char => char.name);
    
    // Translate names
    const translatedNames = await translateWithDeepL(
      textsToTranslate,
      targetLanguage || 'ES',
      'more'
    );
    
    // Map translations back to characteristics with IDs
    const translatedCharacteristics = needsTranslation.map((char, index) => ({
      id: char.id,
      name: char.name,
      translation: translatedNames[index]
    }));

    return new Response(
      JSON.stringify({ 
        translations: translatedCharacteristics,
        count: translatedCharacteristics.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in translate-characteristics function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during translation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
