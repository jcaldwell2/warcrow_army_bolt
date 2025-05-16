import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ChapterData, SectionData, TranslationStatus, EditingItem } from './types';
import { Language } from './LanguageVerificationPanel';

export const useRulesVerifier = () => {
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus[]>([]);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [translationEditDialogOpen, setTranslationEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveInProgress, setSaveInProgress] = useState(false);
  // Update to use only 'es' | 'fr' as the default
  const [verificationLanguage, setVerificationLanguage] = useState<Language>('es');
  
  // Dialog states for add/delete functionality
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{id: string, type: 'chapter' | 'section', title: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [addItemType, setAddItemType] = useState<'chapter' | 'section'>('chapter');
  
  const fetchRulesData = async () => {
    setIsLoading(true);
    try {
      // Fetch chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("rules_chapters")
        .select("*")
        .order("order_index");
        
      if (chaptersError) throw chaptersError;
      
      console.log("Fetched chapters data:", chaptersData);
      
      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("rules_sections")
        .select("*")
        .order("order_index");
        
      if (sectionsError) throw sectionsError;
      
      // Check translation status
      const { data: translationData, error: translationError } = await supabase
        .rpc("check_rules_translations_completeness");
        
      if (translationError) throw translationError;
      
      // Fix: Count sections for each chapter and check if all translations are complete
      const chaptersWithCount = chaptersData.map(chapter => {
        const chapterSections = sectionsData.filter(
          section => section.chapter_id === chapter.id
        );
        
        const sectionCount = chapterSections.length;
        
        // Check if chapter title is translated
        const chapterTitleTranslated = Boolean(chapter.title_es && chapter.title_es.trim() !== '');
        
        // Chapter is complete if its title is translated and it has no sections,
        // or if it has sections, then all sections must have their titles and content translated
        const allSectionsTranslated = chapterSections.length === 0 || 
          chapterSections.every(section => 
            Boolean(section.title_es && section.title_es.trim() !== '') && 
            Boolean(section.content_es && section.content_es.trim() !== '')
          );
        
        return {
          ...chapter,
          sectionCount,
          translationComplete: chapterTitleTranslated && allSectionsTranslated
        };
      });
      
      // Fix: Add proper translation status to sections
      const sectionsWithTranslation = sectionsData.map(section => {
        return {
          ...section,
          translationComplete: Boolean(section.title_es && section.title_es.trim() !== '') && 
                              Boolean(section.content_es && section.content_es.trim() !== '')
        };
      });
      
      setTranslationStatus(translationData || []);
      setChapters(chaptersWithCount);
      setSections(sectionsWithTranslation);
      toast.success("Rules data loaded successfully");
      
    } catch (error: any) {
      console.error("Error fetching rules data:", error);
      toast.error(`Failed to load rules data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRulesData();
  }, []);
  
  const getTranslationStatusSummary = () => {
    const chapterStatus = translationStatus.filter(item => item.content_type === 'chapter');
    const sectionStatus = translationStatus.filter(item => item.content_type === 'section');
    
    const chaptersWithTitle = chapterStatus.filter(c => c.has_spanish_title).length;
    const sectionsWithTitle = sectionStatus.filter(s => s.has_spanish_title).length;
    const sectionsWithContent = sectionStatus.filter(s => s.has_spanish_content).length;
    
    return {
      totalChapters: chapterStatus.length,
      chaptersWithTitle,
      totalSections: sectionStatus.length,
      sectionsWithTitle,
      sectionsWithContent,
      chapterCompletionRate: Math.round((chaptersWithTitle / (chapterStatus.length || 1)) * 100),
      sectionTitleCompletionRate: Math.round((sectionsWithTitle / (sectionStatus.length || 1)) * 100),
      sectionContentCompletionRate: Math.round((sectionsWithContent / (sectionStatus.length || 1)) * 100)
    };
  };

  const handleEditTranslation = (item: ChapterData | SectionData, type: 'chapter' | 'section') => {
    setEditingItem({
      id: item.id,
      type,
      title: item.title,
      title_es: item.title_es || '',
      content: type === 'section' ? (item as SectionData).content : undefined,
      content_es: type === 'section' ? (item as SectionData).content_es || '' : undefined
    });
    setTranslationEditDialogOpen(true);
  };

  const saveTranslation = async () => {
    if (!editingItem) return;

    setSaveInProgress(true);
    try {
      console.log("Saving translation:", editingItem);
      
      if (editingItem.type === 'chapter') {
        console.log("Sending update to database for chapter:", {
          id: editingItem.id,
          title: editingItem.title, // Update English title
          title_es: editingItem.title_es
        });
        
        // Fetch the current chapter data to get all required fields
        const { data: currentChapter, error: fetchError } = await supabase
          .from('rules_chapters')
          .select('*')
          .eq('id', editingItem.id)
          .single();
          
        if (fetchError) {
          console.error("Error fetching current chapter data:", fetchError);
          throw fetchError;
        }
        
        // Combine the current data with our updates
        const updateData = {
          id: editingItem.id,
          title: editingItem.title, // Update English title
          order_index: currentChapter.order_index,
          title_es: editingItem.title_es,
          updated_at: new Date().toISOString()
        };
        
        console.log("Full update data for chapter:", updateData);
        
        // Now perform the upsert with all required fields
        const { data, error } = await supabase
          .from('rules_chapters')
          .upsert(updateData)
          .select();
          
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        console.log("Update response data:", data);
        
        // Double-check the update with a separate query
        const { data: verifyData, error: verifyError } = await supabase
          .from('rules_chapters')
          .select('*')
          .eq('id', editingItem.id)
          .single();
          
        if (verifyError) {
          console.error("Verification error:", verifyError);
        } else {
          console.log("Verified database state after update:", verifyData);
          // Update local state with the verified data
          setChapters(prevChapters => 
            prevChapters.map(chapter => 
              chapter.id === editingItem.id ? 
                {
                  ...chapter, 
                  title: verifyData.title, // Update English title in state
                  title_es: verifyData.title_es,
                  translationComplete: Boolean(verifyData.title_es && verifyData.title_es.trim() !== '') && chapter.translationComplete
                } : 
                chapter
            )
          );
          
          if (!verifyData.title_es) {
            console.warn("WARNING: title_es is still null after update!");
            toast.error("Database update failed - please try again");
          } else {
            console.log("SUCCESS: title_es was updated to:", verifyData.title_es);
            toast.success('Chapter updated successfully');
          }
        }
      } else {
        // Section updates
        console.log("Sending update to database for section:", {
          id: editingItem.id,
          title: editingItem.title, 
          title_es: editingItem.title_es,
          content: editingItem.content?.substring(0, 50) + "...", // Log preview of content
          content_es: editingItem.content_es?.substring(0, 50) + "..." // Log preview of content
        });
        
        // Fetch the current section data to get all required fields
        const { data: currentSection, error: fetchError } = await supabase
          .from('rules_sections')
          .select('*')
          .eq('id', editingItem.id)
          .single();
          
        if (fetchError) {
          console.error("Error fetching current section data:", fetchError);
          throw fetchError;
        }
        
        // Combine the current data with our updates
        const updateData = {
          id: editingItem.id,
          chapter_id: currentSection.chapter_id,
          title: editingItem.title, // Update English title
          content: editingItem.content, // Update English content
          order_index: currentSection.order_index,
          title_es: editingItem.title_es,
          content_es: editingItem.content_es,
          updated_at: new Date().toISOString()
        };
        
        console.log("Full update data for section:", updateData);
        
        // Now perform the upsert with all required fields
        const { data, error } = await supabase
          .from('rules_sections')
          .upsert(updateData)
          .select();
          
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        console.log("Update response data:", data);
        
        // Double-check the update with a separate query
        const { data: verifyData, error: verifyError } = await supabase
          .from('rules_sections')
          .select('*')
          .eq('id', editingItem.id)
          .single();
          
        if (verifyError) {
          console.error("Verification error:", verifyError);
        } else {
          console.log("Verified database state after update:", verifyData);
          // Update local state with the verified data
          setSections(prevSections => 
            prevSections.map(section => 
              section.id === editingItem.id ? 
                {
                  ...section, 
                  title: verifyData.title, // Update English title in state
                  content: verifyData.content, // Update English content in state
                  title_es: verifyData.title_es, 
                  content_es: verifyData.content_es,
                  translationComplete: Boolean(verifyData.title_es && verifyData.title_es.trim() !== '') && 
                                     Boolean(verifyData.content_es && verifyData.content_es.trim() !== '')
                } : 
                section
            )
          );
          
          if (!verifyData.title_es) {
            console.warn("WARNING: title_es is still null after update!");
            toast.error("Database update failed - please try again");
          } else {
            console.log("SUCCESS: title_es was updated to:", verifyData.title_es);
            toast.success('Section updated successfully');
          }
        }
      }
      
      // Close the dialog after successful save
      setTranslationEditDialogOpen(false);
      
      // Force a full refetch to ensure all data is synchronized
      setTimeout(() => {
        console.log("Performing full data refetch after save");
        fetchRulesData();
      }, 500);
    } catch (error: any) {
      console.error('Error updating translation:', error);
      toast.error(`Failed to update translation: ${error.message}`);
    } finally {
      setSaveInProgress(false);
    }
  };

  const runVerification = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('check_rules_translations_completeness');
      if (error) throw error;
      setTranslationStatus(data || []);
      toast.success('Translation verification completed');
    } catch (error: any) {
      console.error('Error running verification:', error);
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Add translation functionality to the hook
  const translateItem = async (item, targetLanguage = 'es') => {
    const textsToTranslate = [];
    
    if (item.title) {
      textsToTranslate.push(item.title);
    }
    
    if (item.content) {
      textsToTranslate.push(item.content);
    }
    
    if (textsToTranslate.length === 0) {
      toast.error("No content to translate");
      return item;
    }
    
    try {
      // Call the DeepL API via Supabase edge function
      const { data, error } = await supabase.functions.invoke('deepl-translate', {
        body: {
          texts: textsToTranslate,
          targetLanguage: targetLanguage.toUpperCase(),
          formality: 'more'
        }
      });
      
      if (error) {
        console.error('Translation error:', error);
        toast.error(`Translation failed: ${error.message}`);
        return item;
      }
      
      if (data && data.translations && data.translations.length > 0) {
        // Create updated item with translations
        const updatedItem = { ...item };
        
        // Set title translation
        if (targetLanguage === 'es') {
          updatedItem.title_es = data.translations[0];
        } else if (targetLanguage === 'fr') {
          updatedItem.title_fr = data.translations[0];
        }
        
        // Set content translation if it exists
        if (data.translations.length > 1 && item.content) {
          if (targetLanguage === 'es') {
            updatedItem.content_es = data.translations[1];
          } else if (targetLanguage === 'fr') {
            updatedItem.content_fr = data.translations[1];
          }
        }
        
        toast.success(`Translation to ${targetLanguage === 'es' ? 'Spanish' : 'French'} completed`);
        return updatedItem;
      } else {
        toast.error("No translation returned");
        return item;
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error("Translation failed");
      return item;
    }
  };

  // New function to handle deletion of chapters and sections
  const handleDeleteItem = (item: ChapterData | SectionData, type: 'chapter' | 'section') => {
    setDeleteItem({
      id: item.id,
      type,
      title: item.title
    });
    setDeleteConfirmDialogOpen(true);
  };

  // Execute the deletion after confirmation
  const confirmDelete = async () => {
    if (!deleteItem) return;
    
    setIsDeleting(true);
    try {
      const { type, id } = deleteItem;
      
      if (type === 'chapter') {
        // First check if this chapter has sections
        const chapterSections = sections.filter(section => section.chapter_id === id);
        
        if (chapterSections.length > 0) {
          toast.error(`Cannot delete chapter "${deleteItem.title}" because it contains ${chapterSections.length} section(s). Delete the sections first.`);
          setDeleteConfirmDialogOpen(false);
          setIsDeleting(false);
          return;
        }
        
        // If no sections, proceed with deletion
        const { error } = await supabase
          .from('rules_chapters')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Update local state
        setChapters(chapters.filter(chapter => chapter.id !== id));
        toast.success(`Chapter "${deleteItem.title}" deleted successfully`);
      } else {
        const { error } = await supabase
          .from('rules_sections')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Update local state
        setSections(sections.filter(section => section.id !== id));
        toast.success(`Section "${deleteItem.title}" deleted successfully`);
      }
      
      // Close dialog
      setDeleteConfirmDialogOpen(false);
      // Refresh data
      fetchRulesData();
      
    } catch (error: any) {
      console.error(`Error deleting ${deleteItem.type}:`, error);
      toast.error(`Failed to delete ${deleteItem.type}: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Show add dialog for chapters or sections
  const showAddDialog = (type: 'chapter' | 'section') => {
    setAddItemType(type);
    setAddItemDialogOpen(true);
  };

  // Save new chapter or section
  const saveNewItem = async (data: any) => {
    setSaveInProgress(true);
    try {
      const timestamp = new Date().toISOString();
      
      if (addItemType === 'chapter') {
        const newChapter = {
          title: data.title,
          order_index: data.order_index,
          created_at: timestamp,
          updated_at: timestamp
        };
        
        const { data: savedChapter, error } = await supabase
          .from('rules_chapters')
          .insert(newChapter)
          .select();
          
        if (error) throw error;
        
        toast.success(`Chapter "${data.title}" created successfully`);
      } else {
        const newSection = {
          title: data.title,
          content: data.content || '',
          chapter_id: data.chapter_id,
          order_index: data.order_index,
          created_at: timestamp,
          updated_at: timestamp
        };
        
        const { data: savedSection, error } = await supabase
          .from('rules_sections')
          .insert(newSection)
          .select();
          
        if (error) throw error;
        
        toast.success(`Section "${data.title}" created successfully`);
      }
      
      // Close dialog
      setAddItemDialogOpen(false);
      // Refresh data
      fetchRulesData();
      
    } catch (error: any) {
      console.error(`Error creating ${addItemType}:`, error);
      toast.error(`Failed to create ${addItemType}: ${error.message}`);
    } finally {
      setSaveInProgress(false);
    }
  };

  // Computed values based on state
  const missingTranslations = sections.filter(section => 
    !section.translationComplete && (
      !section.title_es || section.title_es.trim() === '' || 
      !section.content_es || section.content_es.trim() === ''
    )
  );
  
  const filteredSections = searchQuery ? 
    sections.filter(section => 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (section.title_es && section.title_es.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : sections;
    
  const filteredChapters = searchQuery ?
    chapters.filter(chapter => 
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chapter.title_es && chapter.title_es.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : chapters;

  const stats = getTranslationStatusSummary();

  const getLocalizedContent = (item: any) => {
    if (verificationLanguage === 'es') {
      return {
        title: item.title_es || item.title,
        content: item.content_es || item.content,
      };
    } else if (verificationLanguage === 'fr') {
      return {
        title: item.title_fr || item.title,
        content: item.content_fr || item.content,
      };
    }
    // Fallback to English (this case shouldn't happen now)
    return {
      title: item.title,
      content: item.content,
    };
  };

  // Add batch translation function
  const batchTranslateRules = async () => {
    setIsLoading(true);
    
    try {
      // First, get all missing translations
      const missingChapterTranslations = chapters.filter(chapter => 
        verificationLanguage === 'es' ? !chapter.title_es || chapter.title_es.trim() === '' :
        verificationLanguage === 'fr' ? !chapter.title_fr || chapter.title_fr.trim() === '' : false
      );

      const missingSectionTranslations = sections.filter(section => 
        verificationLanguage === 'es' ? 
          !section.title_es || section.title_es.trim() === '' || !section.content_es || section.content_es.trim() === '' :
        verificationLanguage === 'fr' ? 
          !section.title_fr || section.title_fr.trim() === '' || !section.content_fr || section.content_fr.trim() === '' : 
        false
      );

      // Set up total number of items to translate
      const totalItems = missingChapterTranslations.length + missingSectionTranslations.length;
      let completedItems = 0;
      
      // Custom event to report progress
      const reportProgress = () => {
        completedItems++;
        const event = new CustomEvent('translation-progress', { 
          detail: { completed: completedItems, total: totalItems } 
        });
        window.dispatchEvent(event);
      };

      console.log(`Starting batch translation of ${totalItems} items to ${verificationLanguage}`);
      console.log(`- ${missingChapterTranslations.length} chapter titles`);
      console.log(`- ${missingSectionTranslations.length} section content items`);
      
      // Translate chapter titles first - they're shorter
      for (const chapter of missingChapterTranslations) {
        try {
          // Use DeepL to translate the chapter title
          const { data, error } = await supabase.functions.invoke('deepl-translate', {
            body: {
              texts: [chapter.title],
              targetLanguage: verificationLanguage.toUpperCase(),
              formality: 'more'
            }
          });
          
          if (error) {
            throw error;
          }

          if (data && data.translations && data.translations.length > 0) {
            // Update the chapter title in the database
            const translatedTitle = data.translations[0];
            const updateField = verificationLanguage === 'es' ? 'title_es' : 'title_fr';
            
            const { error: updateError } = await supabase
              .from('rules_chapters')
              .update({ [updateField]: translatedTitle })
              .eq('id', chapter.id);
              
            if (updateError) {
              console.error(`Error updating chapter ${chapter.id}:`, updateError);
            } else {
              // Update local state
              if (verificationLanguage === 'es') {
                chapter.title_es = translatedTitle;
              } else if (verificationLanguage === 'fr') {
                chapter.title_fr = translatedTitle;
              }
            }
          }
          
          // Report progress
          reportProgress();
          
        } catch (error) {
          console.error(`Error translating chapter ${chapter.id}:`, error);
          reportProgress(); // still report progress even on error
        }
        
        // Add a small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Now translate sections - these are more complex with title and content
      for (const section of missingSectionTranslations) {
        try {
          const textsToTranslate = [];
          
          // Check if we need to translate the title
          const needsTitle = verificationLanguage === 'es' ? 
            !section.title_es || section.title_es.trim() === '' : 
            !section.content_fr || section.content_fr.trim() === '';
            
          // Check if we need to translate the content
          const needsContent = verificationLanguage === 'es' ? 
            !section.content_es || section.content_es.trim() === '' : 
            !section.content_fr || section.content_fr.trim() === '';
            
          // Add the texts we need to translate
          if (needsTitle) {
            textsToTranslate.push(section.title);
          }
          
          if (needsContent) {
            textsToTranslate.push(section.content || "");
          }
          
          // If we have nothing to translate, skip this section
          if (textsToTranslate.length === 0) {
            reportProgress();
            continue;
          }
          
          // Use DeepL to translate the section title and content
          const { data, error } = await supabase.functions.invoke('deepl-translate', {
            body: {
              texts: textsToTranslate,
              targetLanguage: verificationLanguage.toUpperCase(),
              formality: 'more'
            }
          });
          
          if (error) {
            throw error;
          }

          if (data && data.translations && data.translations.length > 0) {
            // Prepare the update object
            const updateData: Record<string, any> = {};
            let index = 0;
            
            if (needsTitle) {
              const titleField = verificationLanguage === 'es' ? 'title_es' : 'title_fr';
              updateData[titleField] = data.translations[index++];
            }
            
            if (needsContent) {
              const contentField = verificationLanguage === 'es' ? 'content_es' : 'content_fr';
              updateData[contentField] = data.translations[index++];
            }
            
            // Update the section in the database
            const { error: updateError } = await supabase
              .from('rules_sections')
              .update(updateData)
              .eq('id', section.id);
              
            if (updateError) {
              console.error(`Error updating section ${section.id}:`, updateError);
            } else {
              // Update local state
              if (needsTitle) {
                if (verificationLanguage === 'es') {
                  section.title_es = updateData['title_es'];
                } else if (verificationLanguage === 'fr') {
                  section.title_fr = updateData['title_fr'];
                }
              }
              
              if (needsContent) {
                if (verificationLanguage === 'es') {
                  section.content_es = updateData['content_es'];
                } else if (verificationLanguage === 'fr') {
                  section.content_fr = updateData['content_fr'];
                }
              }
            }
          }
          
          // Report progress
          reportProgress();
          
        } catch (error) {
          console.error(`Error translating section ${section.id}:`, error);
          reportProgress(); // still report progress even on error
        }
        
        // Add a small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // After all translations, refresh the data to ensure we're in sync
      await fetchRulesData();
      
      toast.success(`Successfully translated ${totalItems} items to ${verificationLanguage === 'es' ? 'Spanish' : 'French'}`);
      
    } catch (error: any) {
      console.error('Error during batch translation:', error);
      toast.error(`Batch translation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    chapters,
    sections,
    isLoading,
    translationStatus,
    editingItem,
    setEditingItem,
    translationEditDialogOpen,
    setTranslationEditDialogOpen,
    searchQuery,
    setSearchQuery,
    saveInProgress,
    missingTranslations,
    filteredSections,
    filteredChapters,
    stats,
    fetchRulesData,
    handleEditTranslation,
    saveTranslation,
    runVerification,
    translateItem,
    verificationLanguage,
    setVerificationLanguage,
    getLocalizedContent,
    // New management functions
    handleDeleteItem,
    confirmDelete,
    deleteConfirmDialogOpen,
    setDeleteConfirmDialogOpen,
    deleteItem,
    isDeleting,
    showAddDialog,
    addItemDialogOpen,
    setAddItemDialogOpen,
    addItemType,
    saveNewItem,
    batchTranslateRules // Add the new batch translation function
  };
};
