import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast-core';
import { AlertCircle, CheckCircle, Database, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import CharacteristicsTable from './characteristics/CharacteristicsTable';
import { useCharacteristics } from './characteristics/useCharacteristics';
import TranslationButtons from './characteristics/TranslationButtons';
import TranslationProgress from './characteristics/TranslationProgress';
import TranslationWarning from './characteristics/TranslationWarning';

interface UnitCharacteristicsManagerProps {
  unitId?: string;
}

const UnitCharacteristicsManager: React.FC<UnitCharacteristicsManagerProps> = ({ unitId }) => {
  const [characteristics, setCharacteristics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useLanguage();
  const {
    characteristics: availableCharacteristics,
    isLoading: isCharacteristicsLoading,
    translationInProgress,
    translationProgress,
    getMissingTranslationsCount
  } = useCharacteristics();
  const [selectedTab, setSelectedTab] = useState('view');

  // Calculate missing translations
  const spanishNamesMissing = getMissingTranslationsCount('es').namesMissing;
  const frenchNamesMissing = getMissingTranslationsCount('fr').namesMissing;
  const spanishDescMissing = getMissingTranslationsCount('es').descriptionsMissing;
  const frenchDescMissing = getMissingTranslationsCount('fr').descriptionsMissing;

  useEffect(() => {
    if (unitId) {
      const fetchCharacteristics = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('unit_data')
            .select('characteristics')
            .eq('id', unitId)
            .single();

          if (error) {
            console.error('Error fetching characteristics:', error);
            toast({
              title: t('errorFetchingCharacteristics'),
              description: error.message,
              variant: 'destructive',
            });
          }

          setCharacteristics(data?.characteristics || {});
        } catch (error: any) {
          console.error('Unexpected error fetching characteristics:', error);
          toast({
            title: t('errorFetchingCharacteristics'),
            description: error.message,
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchCharacteristics();
    } else {
      setIsLoading(false);
    }
  }, [unitId, t]);

  const handleCharacteristicChange = (name: string, value: boolean | string | number) => {
    setCharacteristics(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!unitId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('unit_data')
        .update({ characteristics })
        .eq('id', unitId);

      if (error) {
        console.error('Error saving characteristics:', error);
        toast({
          title: t('errorSavingCharacteristics'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('characteristicsSaved'),
          description: t('characteristicsSavedSuccessfully'),
        });
      }
    } catch (error: any) {
      console.error('Unexpected error saving characteristics:', error);
      toast({
        title: t('errorSavingCharacteristics'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTranslateNames = async (language: string) => {
    // Placeholder for translation functionality
    console.log(`Translating names to ${language}`);
  };

  const handleTranslateDescriptions = async (language: string) => {
    // Placeholder for translation functionality
    console.log(`Translating descriptions to ${language}`);
  };

  if (isLoading || isCharacteristicsLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-warcrow-gold"></div>
      </div>
    );
  }

  // For a global characteristics manager without unitId, display all characteristics
  if (!unitId) {
    return (
      <div className="space-y-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="view" className="data-[state=active]:bg-warcrow-gold data-[state=active]:text-black">
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('view')}
            </TabsTrigger>
            <TabsTrigger value="translate" className="data-[state=active]:bg-warcrow-gold data-[state=active]:text-black">
              <Database className="h-4 w-4 mr-2" />
              {t('translate')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="view" className="space-y-2">
            <h3 className="text-lg font-semibold text-warcrow-gold">{t('currentCharacteristics')}</h3>
            <CharacteristicsTable 
              characteristics={null}
            />
          </TabsContent>
          <TabsContent value="translate" className="space-y-2">
            <h3 className="text-lg font-semibold text-warcrow-gold">{t('translationProgress')}</h3>
            <TranslationProgress 
              translationInProgress={translationInProgress}
              translationProgress={translationProgress}
            />
            <TranslationWarning 
              spanishNamesMissing={spanishNamesMissing}
              frenchNamesMissing={frenchNamesMissing}
              spanishDescMissing={spanishDescMissing}
              frenchDescMissing={frenchDescMissing}
            />
            <TranslationButtons 
              isLoading={isLoading}
              translationInProgress={translationInProgress}
              spanishNamesMissing={spanishNamesMissing}
              frenchNamesMissing={frenchNamesMissing}
              spanishDescMissing={spanishDescMissing}
              frenchDescMissing={frenchDescMissing}
              onTranslateNames={handleTranslateNames}
              onTranslateDescriptions={handleTranslateDescriptions}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="view" className="data-[state=active]:bg-warcrow-gold data-[state=active]:text-black">
            <CheckCircle className="h-4 w-4 mr-2" />
            {t('view')}
          </TabsTrigger>
          <TabsTrigger value="edit" className="data-[state=active]:bg-warcrow-gold data-[state=active]:text-black">
            <Wrench className="h-4 w-4 mr-2" />
            {t('edit')}
          </TabsTrigger>
          <TabsTrigger value="translate" className="data-[state=active]:bg-warcrow-gold data-[state=active]:text-black">
            <Database className="h-4 w-4 mr-2" />
            {t('translate')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="view" className="space-y-2">
          <h3 className="text-lg font-semibold text-warcrow-gold">{t('currentCharacteristics')}</h3>
            <CharacteristicsTable 
              characteristics={characteristics}
            />
        </TabsContent>
        <TabsContent value="edit" className="space-y-2">
          <h3 className="text-lg font-semibold text-warcrow-gold">{t('editCharacteristics')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCharacteristics && availableCharacteristics.map((char: any) => (
              <div key={char.name} className="flex items-center space-x-2">
                <label htmlFor={char.name} className="text-warcrow-text capitalize">{t(char.name)}:</label>
                {typeof characteristics[char.name] === 'boolean' ? (
                  <input
                    type="checkbox"
                    id={char.name}
                    checked={characteristics[char.name] || false}
                    onChange={(e) => handleCharacteristicChange(char.name, e.target.checked)}
                    className="w-4 h-4 text-warcrow-gold bg-gray-100 border-gray-300 rounded focus:ring-warcrow-gold"
                  />
                ) : (
                  <input
                    type="text"
                    id={char.name}
                    value={characteristics[char.name] || ''}
                    onChange={(e) => handleCharacteristicChange(char.name, e.target.value)}
                    className="w-full p-2 text-black bg-white border border-gray-300 rounded"
                  />
                )}
              </div>
            ))}
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-warcrow-gold hover:bg-warcrow-gold/90 text-black">
            {isSaving ? `${t('saving')}...` : t('save')}
          </Button>
        </TabsContent>
        <TabsContent value="translate" className="space-y-2">
          <h3 className="text-lg font-semibold text-warcrow-gold">{t('translationProgress')}</h3>
          <TranslationProgress 
            translationInProgress={translationInProgress}
            translationProgress={translationProgress}
          />
          <TranslationWarning 
            spanishNamesMissing={spanishNamesMissing}
            frenchNamesMissing={frenchNamesMissing}
            spanishDescMissing={spanishDescMissing}
            frenchDescMissing={frenchDescMissing}
          />
          <TranslationButtons 
            isLoading={isLoading}
            translationInProgress={translationInProgress}
            spanishNamesMissing={spanishNamesMissing}
            frenchNamesMissing={frenchNamesMissing}
            spanishDescMissing={spanishDescMissing}
            frenchDescMissing={frenchDescMissing}
            onTranslateNames={handleTranslateNames}
            onTranslateDescriptions={handleTranslateDescriptions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnitCharacteristicsManager;
