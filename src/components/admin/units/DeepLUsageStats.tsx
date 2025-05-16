
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Database } from "lucide-react";

interface DeepLUsage {
  character_count: number;
  character_limit: number;
  usage_percentage: string;
}

const DeepLUsageStats: React.FC = () => {
  const [usage, setUsage] = useState<DeepLUsage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsageStats = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('deepl-usage-stats');
      
      if (error) throw error;
      
      setUsage(data as DeepLUsage);
    } catch (error: any) {
      console.error("Error fetching DeepL usage stats:", error);
      toast.error("Failed to fetch DeepL usage statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageStats();
  }, []);

  if (!usage && !isLoading) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 border-warcrow-gold/30 text-warcrow-gold hover:border-warcrow-gold/50"
          onClick={fetchUsageStats}
          disabled={isLoading}
        >
          <Database className="h-4 w-4 mr-2" />
          DeepL API:
          {isLoading ? (
            <span className="ml-1">Loading...</span>
          ) : usage ? (
            <span className="ml-1">{usage.usage_percentage}%</span>
          ) : (
            <span className="ml-1">?</span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="p-3 space-y-2 max-w-xs">
        <div className="text-sm font-medium">DeepL API Usage</div>
        {isLoading ? (
          <p className="text-xs">Loading usage statistics...</p>
        ) : usage ? (
          <>
            <Progress 
              value={parseFloat(usage.usage_percentage)} 
              className="h-1.5"
              indicatorClassName={parseFloat(usage.usage_percentage) > 80 ? "bg-red-500" : "bg-green-500"}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{usage.character_count.toLocaleString()} characters used</span>
              <span>{usage.character_limit.toLocaleString()} limit</span>
            </div>
          </>
        ) : (
          <p className="text-xs">Unable to load usage statistics</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default DeepLUsageStats;
