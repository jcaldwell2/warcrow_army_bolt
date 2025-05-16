
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Languages, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { batchTranslateAndUpdate } from '@/utils/translation/deepLBatchTranslator';
import { supabase } from '@/integrations/supabase/client';
import { BatchItem, BatchItemTable } from '@/types/batchItem';

interface UnitTranslationStatusProps {
  stats: {
    total: number;
    spanishTranslated: number;
    frenchTranslated: number;
  };
  onTranslate: () => void;
}

const UnitTranslationStatus: React.FC<UnitTranslationStatusProps> = ({ stats, onTranslate }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [targetLanguage, setTargetLanguage] = useState<'es' | 'fr'>('es');

  // Calculate percentages
  const spanishPercentage = stats.total ? Math.round((stats.spanishTranslated / stats.total) * 100) : 0;
  const frenchPercentage = stats.total ? Math.round((stats.frenchTranslated / stats.total) * 100) : 0;
  
  // Calculate missing translations
  const spanishMissing = stats.total - stats.spanishTranslated;
  const frenchMissing = stats.total - stats.frenchTranslated;
  
  const handleBatchTranslate = async (language: 'es' | 'fr') => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    setTargetLanguage(language);
    setTranslationProgress(0);
    
    try {
      // Fetch units that need translation
      const { data: unitsData, error } = await supabase
        .from('unit_data')
        .select('id, name')
        .is(`name_${language}`, null);
        
      if (error) throw error;
      
      if (!unitsData || unitsData.length === 0) {
        toast.success(`All unit names are already translated to ${language === 'es' ? 'Spanish' : 'French'}`);
        setIsTranslating(false);
        return;
      }
      
      // Create translation batches
      const batches: BatchItem[] = unitsData.map(unit => ({
        id: unit.id,
        text: unit.name,
        targetField: `name_${language}`,
        table: 'unit_data' as BatchItemTable
      }));
      
      // Track progress
      const updateProgress = (completed: number, total: number) => {
        const progress = Math.round((completed / total) * 100);
        setTranslationProgress(progress);
        
        // Create a custom event to inform other components about translation progress
        const event = new CustomEvent('translation-progress', { 
          detail: { 
            progress, 
            completed, 
            total,
            type: 'unit-names' 
          } 
        });
        window.dispatchEvent(event);
      };
      
      // Start batch translation
      const { success, errors } = await batchTranslateAndUpdate(
        batches,
        language,
        updateProgress
      );
      
      if (success) {
        toast.success(`Successfully translated ${batches.length} unit names to ${language === 'es' ? 'Spanish' : 'French'}`);
        // Refresh unit data
        onTranslate();
      } else {
        toast.error(`Some translations failed: ${errors.length} errors`);
        console.error('Translation errors:', errors);
      }
    } catch (err: any) {
      toast.error(`Translation error: ${err.message}`);
      console.error('Error translating units:', err);
    } finally {
      setIsTranslating(false);
    }
  };
  
  return (
    <div className="mb-4 p-3 bg-black/30 border border-warcrow-gold/20 rounded">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <h3 className="text-sm font-medium text-warcrow-gold flex items-center mb-2 sm:mb-0">
          <Languages className="h-4 w-4 mr-1" /> 
          Translation Status
        </h3>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className={`border-warcrow-gold/50 ${isTranslating && targetLanguage === 'es' ? 'bg-warcrow-gold/20' : ''}`}
            disabled={isTranslating || spanishMissing === 0}
            onClick={() => handleBatchTranslate('es')}
          >
            <Languages className="h-3.5 w-3.5 mr-1" />
            Translate to Spanish {spanishMissing > 0 && `(${spanishMissing})`}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className={`border-warcrow-gold/50 ${isTranslating && targetLanguage === 'fr' ? 'bg-warcrow-gold/20' : ''}`}
            disabled={isTranslating || frenchMissing === 0}
            onClick={() => handleBatchTranslate('fr')}
          >
            <Languages className="h-3.5 w-3.5 mr-1" />
            Translate to French {frenchMissing > 0 && `(${frenchMissing})`}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-warcrow-text/80">Spanish</span>
            <span className="text-xs font-medium text-warcrow-gold">
              {stats.spanishTranslated}/{stats.total} ({spanishPercentage}%)
            </span>
          </div>
          <Progress value={spanishPercentage} className="h-1.5 bg-warcrow-gold/20" />
          {spanishMissing > 0 && (
            <div className="mt-1 flex items-center">
              <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
              <span className="text-xs text-amber-500">{spanishMissing} unit names missing Spanish translation</span>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-warcrow-text/80">French</span>
            <span className="text-xs font-medium text-warcrow-gold">
              {stats.frenchTranslated}/{stats.total} ({frenchPercentage}%)
            </span>
          </div>
          <Progress value={frenchPercentage} className="h-1.5 bg-warcrow-gold/20" />
          {frenchMissing > 0 && (
            <div className="mt-1 flex items-center">
              <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
              <span className="text-xs text-amber-500">{frenchMissing} unit names missing French translation</span>
            </div>
          )}
        </div>
      </div>
      
      {isTranslating && (
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-warcrow-text/80">
              Translating to {targetLanguage === 'es' ? 'Spanish' : 'French'}...
            </span>
            <span className="text-xs font-medium text-warcrow-gold">{translationProgress}%</span>
          </div>
          <Progress value={translationProgress} className="h-1.5 bg-warcrow-gold/20" />
        </div>
      )}
    </div>
  );
};

export default UnitTranslationStatus;
