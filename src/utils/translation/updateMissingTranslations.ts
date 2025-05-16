
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/translation';

/**
 * Updates missing translations for specified characteristics in the database
 */
export const updateMissingCharacteristicTranslations = async () => {
  try {
    // Define the characteristics that need translation fixes
    const translationUpdates = [
      // Spanish translations
      { id: null, name: 'Aestari', language: 'es', value: 'Aestari' },
      { id: null, name: 'Varank', language: 'es', value: 'Varank' },
      
      // French translations
      { id: null, name: 'Aestari', language: 'fr', value: 'Aestari' },
      { id: null, name: 'Nemorous', language: 'fr', value: 'Nemorous' },
      { id: null, name: 'Varank', language: 'fr', value: 'Varank' }
    ];
    
    // First, fetch the IDs of these characteristics
    for (const update of translationUpdates) {
      const { data, error } = await supabase
        .from('unit_characteristics')
        .select('id')
        .eq('name', update.name)
        .single();
        
      if (error) {
        console.error(`Error finding characteristic ${update.name}:`, error);
        continue;
      }
      
      update.id = data.id;
    }
    
    // Now update each characteristic with proper translations
    let updatedCount = 0;
    
    for (const update of translationUpdates) {
      if (!update.id) continue;
      
      const columnName = `name_${update.language}`;
      
      const { error } = await supabase
        .from('unit_characteristics')
        .update({ [columnName]: update.value })
        .eq('id', update.id);
        
      if (error) {
        console.error(`Error updating ${update.name} (${update.language}):`, error);
      } else {
        updatedCount++;
      }
    }
    
    return { success: true, count: updatedCount };
  } catch (error) {
    console.error('Error updating missing translations:', error);
    return { success: false, error };
  }
};

/**
 * Function to trigger an update of all missing translations
 * and provide feedback to the user
 */
export const fixMissingTranslations = async () => {
  toast({
    title: 'Updating missing translations...',
    description: 'Please wait while we update the database.',
  });
  
  const result = await updateMissingCharacteristicTranslations();
  
  if (result.success) {
    toast({
      title: 'Translations updated',
      description: `Successfully updated ${result.count} missing translations.`,
    });
    
    // Force a reload of the admin page to show the updated data
    window.location.reload();
  } else {
    toast({
      title: 'Error updating translations',
      description: 'Something went wrong. Please check the console for details.',
      variant: 'destructive'
    });
  }
};
