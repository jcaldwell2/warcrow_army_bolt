
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UnitCharacteristic {
  id: string;
  name: string;
  name_es?: string | null;
  name_fr?: string | null;
  description: string;
  description_es?: string | null;
  description_fr?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useCharacteristics = () => {
  const [characteristics, setCharacteristics] = useState<UnitCharacteristic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch all characteristics
  const fetchCharacteristics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('unit_characteristics')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setCharacteristics(data || []);
    } catch (error) {
      console.error('Error fetching characteristics:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCharacteristics();
  }, []);
  
  // Calculate missing translations
  const getMissingTranslationsCount = (language: 'es' | 'fr') => {
    if (!characteristics || characteristics.length === 0) {
      return { namesMissing: 0, descriptionsMissing: 0 };
    }
    
    const nameField = `name_${language}`;
    const descriptionField = `description_${language}`;
    
    const namesMissing = characteristics.filter(
      (c) => !c[nameField as keyof UnitCharacteristic]
    ).length;
    
    const descriptionsMissing = characteristics.filter(
      (c) => !c[descriptionField as keyof UnitCharacteristic]
    ).length;
    
    return { namesMissing, descriptionsMissing };
  };
  
  // Handle translation progress updates
  useEffect(() => {
    const handleProgress = (e: any) => {
      setTranslationProgress(e.detail.progress || 0);
    };

    window.addEventListener('characteristic-translation-progress', handleProgress as EventListener);
    
    return () => {
      window.removeEventListener('characteristic-translation-progress', handleProgress as EventListener);
    };
  }, []);
  
  return {
    characteristics,
    isLoading,
    isUpdating,
    translationInProgress,
    translationProgress,
    error,
    fetchCharacteristics,
    getMissingTranslationsCount,
    setTranslationInProgress
  };
};
