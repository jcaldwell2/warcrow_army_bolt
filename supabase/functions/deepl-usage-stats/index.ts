
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle DeepL usage statistics
async function getDeepLUsage() {
  try {
    if (!DEEPL_API_KEY) {
      throw new Error('DeepL API key is not configured');
    }
    
    const response = await fetch('https://api-free.deepl.com/v2/usage', {
      method: 'GET',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Log for monitoring
    console.log(`DeepL usage stats: ${data.character_count}/${data.character_limit} characters used`);
    
    // Calculate the usage percentage and return as a string
    const usagePercentage = (data.character_count / data.character_limit * 100).toFixed(2);
    
    return {
      character_count: data.character_count,
      character_limit: data.character_limit,
      usage_percentage: usagePercentage // Return as string
    };
  } catch (error) {
    console.error('Error fetching DeepL usage stats:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const usageData = await getDeepLUsage();
    
    return new Response(
      JSON.stringify(usageData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in deepl-usage-stats function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while fetching usage statistics',
        character_count: 0,
        character_limit: 0,
        usage_percentage: "0" // Return as string for error case too
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
