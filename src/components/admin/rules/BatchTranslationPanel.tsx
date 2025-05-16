
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoaderIcon, Languages, CheckIcon, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Language } from "./LanguageVerificationPanel";
import { ChapterData, SectionData } from './types';

interface BatchTranslationPanelProps {
  chapters: ChapterData[];
  sections: SectionData[];
  targetLanguage: Language;
  isLoading: boolean;
  onTranslate: () => Promise<void>;
}

const BatchTranslationPanel: React.FC<BatchTranslationPanelProps> = ({
  chapters,
  sections,
  targetLanguage,
  isLoading,
  onTranslate
}) => {
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [translatedItems, setTranslatedItems] = useState(0);

  // Calculate missing translations
  const missingChapterTranslations = chapters.filter(chapter => 
    targetLanguage === 'es' ? !chapter.title_es || chapter.title_es.trim() === '' :
    targetLanguage === 'fr' ? !chapter.title_fr || chapter.title_fr.trim() === '' : false
  );

  const missingSectionTranslations = sections.filter(section => 
    targetLanguage === 'es' ? 
      !section.title_es || section.title_es.trim() === '' || !section.content_es || section.content_es.trim() === '' :
    targetLanguage === 'fr' ? 
      !section.title_fr || section.title_fr.trim() === '' || !section.content_fr || section.content_fr.trim() === '' : 
    false
  );

  const handleBatchTranslate = async () => {
    setTranslationInProgress(true);
    setProgress(0);
    setTotalItems(missingChapterTranslations.length + missingSectionTranslations.length);
    setTranslatedItems(0);

    try {
      // We'll report progress through our custom event handler
      window.addEventListener('translation-progress', ((e: CustomEvent) => {
        setTranslatedItems(e.detail.completed);
        setProgress(Math.round((e.detail.completed / totalItems) * 100));
      }) as EventListener);

      await onTranslate();
      
      toast.success(`Successfully completed batch translation to ${targetLanguage === 'es' ? 'Spanish' : 'French'}`);
    } catch (error) {
      console.error('Batch translation error:', error);
      toast.error('An error occurred during batch translation');
    } finally {
      window.removeEventListener('translation-progress', (() => {}) as EventListener);
      setTranslationInProgress(false);
    }
  };

  const totalMissing = missingChapterTranslations.length + missingSectionTranslations.length;

  return (
    <Card className="p-4 mt-4 border border-warcrow-gold/30 shadow-sm bg-black">
      <h3 className="text-md font-semibold mb-2 text-warcrow-gold flex items-center">
        <Languages className="h-4 w-4 mr-2" />
        Batch Translation
      </h3>
      
      <div className="mb-3 text-sm text-warcrow-text/80">
        {totalMissing > 0 ? (
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
            <span>
              Found <span className="text-amber-500 font-bold">{totalMissing}</span> items missing translation 
              to {targetLanguage === 'es' ? 'Spanish' : 'French'}:
              <ul className="list-disc list-inside mt-1 pl-2 space-y-0.5">
                <li>{missingChapterTranslations.length} chapter titles</li>
                <li>{missingSectionTranslations.length} section content items</li>
              </ul>
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
            <span>All rules content is translated to {targetLanguage === 'es' ? 'Spanish' : 'French'}</span>
          </div>
        )}
      </div>

      {translationInProgress && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-warcrow-text/70">Translation progress</span>
            <span className="text-xs font-medium text-warcrow-gold">
              {translatedItems} / {totalItems} items
            </span>
          </div>
          <Progress value={progress} className="h-1.5 bg-warcrow-gold/20" />
          <p className="text-xs text-warcrow-text/60 mt-1">
            Using DeepL API to translate - this may take a few minutes...
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs text-warcrow-text/70">
          Target: {targetLanguage === 'es' ? 'Spanish' : targetLanguage === 'fr' ? 'French' : 'Unknown language'}
        </span>
        
        <Button
          onClick={handleBatchTranslate}
          disabled={isLoading || translationInProgress || totalMissing === 0}
          variant="default"
          size="sm"
          className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
        >
          {(isLoading || translationInProgress) ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              Translate All Missing Items
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default BatchTranslationPanel;
