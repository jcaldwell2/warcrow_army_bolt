
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Check, X, BarChart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

export const DeepLTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; translation?: string } | null>(null);
  const [usageStats, setUsageStats] = useState<{ character_count: number; character_limit: number; usage_percentage: string } | null>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);

  const testDeepLIntegration = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const testText = "This is a test of the DeepL translation API.";
      
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("deepl-translate", {
        body: {
          texts: [testText],
          targetLanguage: "ES",
          formality: "default"
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Check the response
      if (data && data.translations && data.translations.length > 0) {
        const translation = data.translations[0];
        setTestResult({
          success: true,
          message: "DeepL API connection successful!",
          translation
        });
        toast.success("DeepL API key is working correctly");
      } else {
        setTestResult({
          success: false,
          message: "API responded but no translations were returned"
        });
        toast.error("Test failed - check console for details");
      }
      
      console.log("DeepL API test response:", data);
      
    } catch (error: any) {
      console.error("DeepL API test failed:", error);
      setTestResult({
        success: false,
        message: `Error: ${error.message || "Unknown error occurred"}`
      });
      toast.error("DeepL API test failed - check console for details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsageStatistics = async () => {
    setIsLoadingUsage(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("deepl-usage-stats", {});
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUsageStats(data);
        toast.success("DeepL usage statistics retrieved");
      }
      
      console.log("DeepL API usage stats:", data);
      
    } catch (error: any) {
      console.error("Failed to fetch DeepL usage stats:", error);
      toast.error("Failed to get DeepL usage statistics");
    } finally {
      setIsLoadingUsage(false);
    }
  };
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };
  
  return (
    <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-warcrow-gold">DeepL API Integration Test</h3>
        
        <p className="text-warcrow-text/80">
          This will test if your DeepL API key is correctly configured and the translation function is working.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={testDeepLIntegration} 
            disabled={isLoading}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : "Test DeepL API"}
          </Button>
          
          <Button
            onClick={fetchUsageStatistics}
            disabled={isLoadingUsage}
            variant="outline"
            className="border-warcrow-gold/30 text-warcrow-gold"
          >
            {isLoadingUsage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <BarChart className="mr-2 h-4 w-4" />
                Check Character Usage
              </>
            )}
          </Button>
        </div>
        
        {usageStats && (
          <div className="mt-4 p-4 rounded border border-warcrow-gold/30 bg-black/70">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-warcrow-text">DeepL API Character Usage:</span>
              <span className="text-sm font-medium text-warcrow-gold">
                {formatNumber(usageStats.character_count)} / {formatNumber(usageStats.character_limit)}
              </span>
            </div>
            
            <Progress 
              value={parseFloat(usageStats.usage_percentage)} 
              className="h-2 bg-warcrow-gold/20" 
            />
            
            <p className="mt-2 text-xs text-warcrow-text/70">
              You have used {parseFloat(usageStats.usage_percentage).toFixed(1)}% of your DeepL free tier monthly limit.
              {usageStats.character_limit - usageStats.character_count < 100000 && 
                " You're getting close to your limit. Consider upgrading or limiting translations until next month."}
            </p>
          </div>
        )}
        
        {testResult && (
          <div className={`mt-4 p-4 rounded border ${testResult.success ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
            <div className="flex items-center">
              {testResult.success ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <X className="h-5 w-5 text-red-500 mr-2" />
              )}
              <p className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                {testResult.message}
              </p>
            </div>
            
            {testResult.translation && (
              <div className="mt-2 pt-2 border-t border-green-500/30">
                <p className="text-sm text-warcrow-text/80">English: "This is a test of the DeepL translation API."</p>
                <p className="text-sm font-medium text-warcrow-gold">Spanish: "{testResult.translation}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
