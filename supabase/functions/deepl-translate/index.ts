
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
    
    // Ensure proper language formatting (DeepL uses ES not es)
    const formattedLang = targetLanguage.toUpperCase();
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
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
    const { texts, targetLanguage, formality } = await req.json();
    
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: texts array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process in batches if there are many texts (DeepL has limits)
    const batchSize = 25; // DeepL limits the number of texts per request
    let allTranslations = [];
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchTranslations = await translateWithDeepL(
        batch,
        targetLanguage || 'ES',
        formality || 'default'
      );
      allTranslations = [...allTranslations, ...batchTranslations];
    }

    return new Response(
      JSON.stringify({ translations: allTranslations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in deepl-translate function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during translation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
