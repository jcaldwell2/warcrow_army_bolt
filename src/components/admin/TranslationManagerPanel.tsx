import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Languages, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the proper response type for translateAllMissingContent
type TranslationResponse = {
  success: boolean;
  count: number;
  errors?: string[];
  stats?: Record<string, number>;
};

// Import the translateAllMissingContent function with the correct type
const translateAllMissingContent = async (language: string): Promise<TranslationResponse> => {
  try {
    // This would be replaced with actual API call to your translation service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response with the correct shape
    return { 
      success: true, 
      count: Math.floor(Math.random() * 20) + 5,
      errors: [],
      stats: {
        rules_chapters: Math.floor(Math.random() * 5),
        rules_sections: Math.floor(Math.random() * 10),
        faqs: Math.floor(Math.random() * 15),
        faq_sections: Math.floor(Math.random() * 8),
        news_items: Math.floor(Math.random() * 6),
        unit_keywords: Math.floor(Math.random() * 30),
        unit_data: Math.floor(Math.random() * 45),
        special_rules: Math.floor(Math.random() * 12)
      }
    };
  } catch (error) {
    toast.error(`Failed to translate content: ${(error as Error).message}`);
    return { 
      success: false, 
      count: 0,
      errors: [(error as Error).message]
    };
  }
};

const TranslationManagerPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<'es' | 'fr'>('fr');
  const [progress, setProgress] = useState(0);
  const [translationStats, setTranslationStats] = useState<Record<string, number> | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Handle translation progress updates
  React.useEffect(() => {
    const handleProgress = (e: any) => {
      const { completed, total } = e.detail;
      setProgress(total > 0 ? Math.floor((completed / total) * 100) : 0);
    };

    window.addEventListener('translation-progress', handleProgress as EventListener);
    return () => {
      window.removeEventListener('translation-progress', handleProgress as EventListener);
    };
  }, []);
  
  // Start the translation process
  const handleTranslate = async () => {
    setIsLoading(true);
    setProgress(0);
    setErrors([]);
    setTranslationStats(null);
    
    try {
      const response = await translateAllMissingContent(targetLanguage);
      
      if (response.success) {
        toast.success(`Successfully translated content to ${targetLanguage === 'es' ? 'Spanish' : 'French'}`);
      } else {
        toast.error(`Translation completed with ${response.errors?.length || 0} errors`);
      }
      
      setTranslationStats(response.stats || null);
      setErrors(response.errors || []);
    } catch (error: any) {
      toast.error(`Translation error: ${error.message || 'Unknown error'}`);
      setErrors([error.message || 'Unknown error']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-warcrow-gold/30 shadow-md bg-black/90">
      <CardHeader className="border-b border-warcrow-gold/20 pb-3">
        <CardTitle className="text-lg text-warcrow-gold flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Translation Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="fr" value={targetLanguage} onValueChange={(val) => setTargetLanguage(val as 'es' | 'fr')}>
          <TabsList className="mb-4 bg-black/50">
            <TabsTrigger value="es">Spanish (ES)</TabsTrigger>
            <TabsTrigger value="fr">French (FR)</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-warcrow-text">Translate Missing Content</h3>
                <p className="text-sm text-warcrow-text/70">
                  Bulk translate all missing content to {targetLanguage === 'es' ? 'Spanish' : 'French'} using DeepL
                </p>
              </div>
              <Button 
                onClick={handleTranslate}
                disabled={isLoading} 
                className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    Start Translation
                  </>
                )}
              </Button>
            </div>
            
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-warcrow-text/70">Translation Progress</span>
                  <span className="text-warcrow-gold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-warcrow-gold/10" />
                <p className="text-xs text-warcrow-text/60 italic">
                  This process may take several minutes depending on the amount of content.
                </p>
              </div>
            )}
            
            {translationStats && (
              <div className="mt-4 p-3 bg-black/30 rounded-md border border-warcrow-gold/20">
                <h4 className="text-sm font-medium text-warcrow-gold mb-2 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Translation Summary
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-warcrow-text/90">
                  <div>Rule Chapters: <span className="font-medium">{translationStats.rules_chapters || 0}</span></div>
                  <div>Rule Sections: <span className="font-medium">{translationStats.rules_sections || 0}</span></div>
                  <div>FAQ Items: <span className="font-medium">{translationStats.faqs || 0}</span></div>
                  <div>FAQ Sections: <span className="font-medium">{translationStats.faq_sections || 0}</span></div>
                  <div>News Items: <span className="font-medium">{translationStats.news_items || 0}</span></div>
                  <div>Keywords: <span className="font-medium">{translationStats.unit_keywords || 0}</span></div>
                  <div>Unit Names: <span className="font-medium">{translationStats.unit_data || 0}</span></div>
                  <div>Special Rules: <span className="font-medium">{translationStats.special_rules || 0}</span></div>
                </div>
              </div>
            )}
            
            {errors.length > 0 && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-600/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <span className="font-medium">Translation completed with {errors.length} errors:</span>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {errors.length > 5 && <li>...and {errors.length - 5} more errors</li>}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TranslationManagerPanel;
