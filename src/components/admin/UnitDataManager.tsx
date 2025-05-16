
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/LanguageContext';
import UnitDataUploader from "./units/UnitDataUploader";
import UnitKeywordSpecialRulesManager from "./units/UnitKeywordSpecialRulesManager";
import UnitCharacteristicsManager from "./units/UnitCharacteristicsManager";
import FactionManager from "./units/FactionManager";
import DeepLUsageStats from "./units/DeepLUsageStats";
import PopulateDataButton from "./units/PopulateDataButton";
import UnitDataTable from "./units/UnitDataTable";
import DataSyncManager from "./units/DataSyncManager";

const UnitDataManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("units");
  const [isLoading, setIsLoading] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const { t } = useLanguage();

  // Track progress through custom event - with dupe protection
  useEffect(() => {
    const handleProgress = (e: any) => {
      setTranslationProgress(e.detail.progress || 0);
      setTranslationInProgress(e.detail.progress < 100);
    };

    // Remove any existing listener before adding a new one to prevent duplication
    window.removeEventListener('translation-progress', handleProgress as EventListener);
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
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger 
            value="units" 
            className="text-xs sm:text-sm data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold text-warcrow-text"
          >
            Units
          </TabsTrigger>
          <TabsTrigger 
            value="unittable" 
            className="text-xs sm:text-sm data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold text-warcrow-text"
          >
            Unit Table
          </TabsTrigger>
          <TabsTrigger 
            value="keywords-specialrules" 
            className="text-xs sm:text-sm data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold text-warcrow-text"
          >
            Keywords/Special Rules
          </TabsTrigger>
          <TabsTrigger 
            value="factions-characteristics" 
            className="text-xs sm:text-sm data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold text-warcrow-text"
          >
            Factions/Characteristics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4">
          <UnitDataUploader />
        </TabsContent>

        <TabsContent value="unittable" className="space-y-4">
          <UnitDataTable />
          <DataSyncManager />
        </TabsContent>

        <TabsContent value="keywords-specialrules" className="space-y-4">
          <UnitKeywordSpecialRulesManager />
        </TabsContent>

        <TabsContent value="factions-characteristics" className="space-y-4">
          <Tabs defaultValue="factions" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="factions">Factions</TabsTrigger>
              <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
            </TabsList>
            <TabsContent value="factions">
              <FactionManager />
            </TabsContent>
            <TabsContent value="characteristics">
              <UnitCharacteristicsManager unitId={null} />
            </TabsContent>
          </Tabs>
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
