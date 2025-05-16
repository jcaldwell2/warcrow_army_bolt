
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from "@/integrations/supabase/client";
import UnitDataUploader from "../units/UnitDataUploader";
import UnitKeywordsManager from "../units/UnitKeywordsManager";
import UnitCharacteristicsManager from "../units/UnitCharacteristicsManager";
import FactionManager from "./FactionManager";
import DeepLUsageStats from "../units/DeepLUsageStats";
import PopulateDataButton from "../units/PopulateDataButton";
import UnitDataTable from "../units/UnitDataTable";
import DataSyncManager from "../units/DataSyncManager";

const UnitDataManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("units");
  const [isLoading, setIsLoading] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const { language } = useLanguage();

  // Track progress through custom event
  useEffect(() => {
    const handleProgress = (e: any) => {
      setTranslationProgress(e.detail.progress || 0);
    };

    window.addEventListener('translation-progress', handleProgress as EventListener);
    
    return () => {
      window.removeEventListener('translation-progress', handleProgress as EventListener);
    };
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-warcrow-gold">Unit Data Management</h1>
        <div className="flex gap-3">
          <PopulateDataButton />
          <DeepLUsageStats />
        </div>
      </div>

      <Tabs
        defaultValue="units"
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-6 mb-4 bg-black/80 border border-warcrow-gold/30">
          <TabsTrigger 
            value="units" 
            className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
          >
            Units
          </TabsTrigger>
          <TabsTrigger 
            value="unittable" 
            className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
          >
            Unit Table
          </TabsTrigger>
          <TabsTrigger 
            value="keywords" 
            className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
          >
            Keywords
          </TabsTrigger>
          <TabsTrigger 
            value="factions" 
            className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
          >
            Factions
          </TabsTrigger>
          <TabsTrigger 
            value="characteristics" 
            className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
          >
            Characteristics
          </TabsTrigger>
          <TabsTrigger 
            value="sync" 
            className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
          >
            Data Sync
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4">
          <UnitDataUploader />
        </TabsContent>

        <TabsContent value="unittable" className="space-y-4">
          <UnitDataTable />
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <UnitKeywordsManager />
        </TabsContent>

        <TabsContent value="factions" className="space-y-4">
          <FactionManager />
        </TabsContent>

        <TabsContent value="characteristics" className="space-y-4">
          <UnitCharacteristicsManager />
        </TabsContent>
        
        <TabsContent value="sync" className="space-y-4">
          <DataSyncManager />
        </TabsContent>
      </Tabs>

      {translationInProgress && (
        <Card className="p-4 bg-black/50 border-warcrow-gold/30">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-warcrow-text/90">Translating unit data...</span>
              <span className="text-sm font-medium text-warcrow-gold">{translationProgress.toFixed(0)}%</span>
            </div>
            <Progress value={translationProgress} className="h-1.5 bg-warcrow-gold/20" />
          </div>
        </Card>
      )}
    </div>
  );
};

export default UnitDataManager;
