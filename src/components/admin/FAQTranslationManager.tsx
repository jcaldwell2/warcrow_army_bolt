
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Save, Plus, Languages, Edit, Trash2 } from "lucide-react";
import { translateWithDeepL } from "@/utils/newsUtils";
import { FAQSection } from '@/utils/types/faqTypes';

interface TranslationEditDialogProps {
  isOpen: boolean;
  title: string;
  originalText: string;
  sectionText: string;
  currentTranslation: string;
  currentSectionTranslation: string;
  targetLanguage: string;
  onCancel: () => void;
  onSave: (translation: string, sectionTranslation: string) => void;
}

const TranslationEditDialog: React.FC<TranslationEditDialogProps> = ({
  isOpen,
  title,
  originalText,
  sectionText,
  currentTranslation,
  currentSectionTranslation,
  targetLanguage,
  onCancel,
  onSave,
}) => {
  const [translation, setTranslation] = useState(currentTranslation);
  const [sectionTranslation, setSectionTranslation] = useState(currentSectionTranslation);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setTranslation(currentTranslation);
    setSectionTranslation(currentSectionTranslation);
  }, [currentTranslation, currentSectionTranslation]);

  const handleSave = () => {
    onSave(translation, sectionTranslation);
  };

  const handleAutoTranslate = async () => {
    if (!originalText) return;
    
    setIsTranslating(true);
    try {
      const textsToTranslate = [sectionText, originalText];
      const langCode = targetLanguage === 'es' ? 'ES' : 'FR';
      
      const { data, error } = await supabase.functions.invoke('deepl-translate', {
        body: {
          texts: textsToTranslate,
          targetLanguage: langCode,
          formality: 'more'
        }
      });
      
      if (error) throw error;
      
      if (data && data.translations && data.translations.length > 1) {
        setSectionTranslation(data.translations[0]);
        setTranslation(data.translations[1]);
        toast.success(`Auto-translated to ${targetLanguage === 'es' ? 'Spanish' : 'French'}`);
      }
    } catch (error) {
      toast.error("Translation failed. Please try again.");
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] bg-black border border-warcrow-gold/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">{title}</DialogTitle>
          <DialogDescription className="text-warcrow-text">
            Edit the {targetLanguage === 'es' ? 'Spanish' : 'French'} translation for this FAQ.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="section-title" className="text-warcrow-gold">Section Title:</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                id="section-title-en"
                value={sectionText}
                readOnly
                className="border border-warcrow-gold/30 bg-black/50 text-warcrow-text"
                placeholder="Original section title"
              />
              <Input
                id="section-title-trans"
                value={sectionTranslation || ''}
                onChange={(e) => setSectionTranslation(e.target.value)}
                className="border border-warcrow-gold/30 bg-black text-warcrow-text"
                placeholder={`${targetLanguage === 'es' ? 'Spanish' : 'French'} section title`}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="original" className="text-warcrow-text">
                Content
              </Label>
              <Button 
                type="button" 
                size="sm" 
                onClick={handleAutoTranslate} 
                disabled={isTranslating}
                className="text-xs border-warcrow-gold/40 text-warcrow-gold hover:bg-warcrow-gold/10"
              >
                <Languages className="mr-1 h-3.5 w-3.5" />
                Auto-Translate with DeepL
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Textarea
                id="original"
                value={originalText}
                readOnly
                className="border border-warcrow-gold/30 bg-black/50 text-warcrow-text resize-none h-64"
              />
              <Textarea
                id="translation"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="border border-warcrow-gold/30 bg-black text-warcrow-text resize-none h-64"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onCancel} className="border-warcrow-gold/30 text-warcrow-gold hover:border-warcrow-gold/50">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black">
            Save Translation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FAQTranslationManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'es' | 'fr'>('es');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQSection | null>(null);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const { language } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [newFAQ, setNewFAQ] = useState<Partial<FAQSection>>({ section: '', content: '' });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('faq_sections')
        .select('*')
        .order('order_index');

      if (error) throw error;

      setFaqs(data as FAQSection[]);
    } catch (error: any) {
      console.error("Error fetching FAQs:", error);
      toast.error(`Failed to load FAQs: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTranslation = (faq: FAQSection, tab: 'es' | 'fr') => {
    setSelectedFAQ(faq);
    setActiveTab(tab);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedFAQ(null);
  };

  const handleUpdateTranslation = async (translation: string, sectionTranslation: string) => {
    if (!selectedFAQ) return;

    setIsLoading(true);
    try {
      const updatePayload = activeTab === 'es'
        ? { content_es: translation, section_es: sectionTranslation }
        : { content_fr: translation, section_fr: sectionTranslation };

      const { error } = await supabase
        .from('faq_sections')
        .update(updatePayload)
        .eq('id', selectedFAQ.id);

      if (error) throw error;

      toast.success(`FAQ ${activeTab === 'es' ? 'Spanish' : 'French'} translation updated successfully`);
      fetchFAQs();
    } catch (error: any) {
      console.error("Error updating FAQ translation:", error);
      toast.error(`Failed to update FAQ translation: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setSelectedFAQ(null);
    }
  };

  const handleCreateFAQ = async () => {
    if (!newFAQ.section || !newFAQ.content) {
      toast.error("Section and content are required");
      return;
    }

    setIsLoading(true);
    try {
      // Get the max order index and add 1
      const { data: maxOrderData } = await supabase
        .from('faq_sections')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1);
      
      const nextOrderIndex = maxOrderData && maxOrderData.length > 0 
        ? maxOrderData[0].order_index + 1 
        : 1;
        
      const { error } = await supabase
        .from('faq_sections')
        .insert({
          section: newFAQ.section,
          content: newFAQ.content,
          order_index: nextOrderIndex
        });

      if (error) throw error;

      toast.success("FAQ created successfully");
      setIsCreating(false);
      setNewFAQ({ section: '', content: '' });
      fetchFAQs();
    } catch (error: any) {
      console.error("Error creating FAQ:", error);
      toast.error(`Failed to create FAQ: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('faq_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("FAQ deleted successfully");
      fetchFAQs();
    } catch (error: any) {
      console.error("Error deleting FAQ:", error);
      toast.error(`Failed to delete FAQ: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkTranslate = async (language: 'es' | 'fr') => {
    const untranslatedFAQs = faqs.filter(faq => {
      const contentField = language === 'es' ? 'content_es' : 'content_fr';
      const sectionField = language === 'es' ? 'section_es' : 'section_fr';
      return !faq[contentField as keyof FAQSection] || !faq[sectionField as keyof FAQSection];
    });
    
    if (untranslatedFAQs.length === 0) {
      toast.info(`All FAQs already have ${language === 'es' ? 'Spanish' : 'French'} translations`);
      return;
    }

    setTranslationInProgress(true);
    setTranslationProgress(0);
    
    const langCode = language === 'es' ? 'ES' : 'FR';
    try {
      let completed = 0;
      const total = untranslatedFAQs.length;
      
      for (const faq of untranslatedFAQs) {
        const textsToTranslate = [faq.section, faq.content];
        
        const { data, error } = await supabase.functions.invoke('deepl-translate', {
          body: {
            texts: textsToTranslate,
            targetLanguage: langCode,
            formality: 'more'
          }
        });
        
        if (error) throw error;
        
        if (data && data.translations && data.translations.length > 0) {
          const updatePayload = language === 'es'
            ? { section_es: data.translations[0], content_es: data.translations[1] }
            : { section_fr: data.translations[0], content_fr: data.translations[1] };
            
          const { error: updateError } = await supabase
            .from('faq_sections')
            .update(updatePayload)
            .eq('id', faq.id);
            
          if (updateError) throw updateError;
        }
        
        completed++;
        setTranslationProgress(Math.round((completed / total) * 100));
      }
      
      toast.success(`Translated ${untranslatedFAQs.length} FAQs to ${language === 'es' ? 'Spanish' : 'French'}`);
      fetchFAQs();
    } catch (error: any) {
      console.error("Error translating FAQs:", error);
      toast.error(`Translation error: ${error.message}`);
    } finally {
      setTranslationInProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4 border border-warcrow-gold/30 shadow-sm bg-black">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-warcrow-gold">FAQ Translations</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleBulkTranslate('es')}
              disabled={isLoading || translationInProgress}
              className="border-warcrow-gold/50 text-warcrow-gold"
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate All to Spanish
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleBulkTranslate('fr')}
              disabled={isLoading || translationInProgress}
              className="border-warcrow-gold/50 text-warcrow-gold"
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate All to French
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreating(true)}
              className="border-warcrow-gold/50 text-warcrow-gold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </div>
        </div>

        {translationInProgress && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-warcrow-text/90">Translation progress</span>
              <span className="text-sm font-medium text-warcrow-gold">{translationProgress}%</span>
            </div>
            <Progress value={translationProgress} className="h-1.5 bg-warcrow-gold/20" />
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-black/30">
              <TableHead className="w-[40%] text-warcrow-gold">Section</TableHead>
              <TableHead className="w-[30%] text-warcrow-gold">Content</TableHead>
              <TableHead className="text-warcrow-gold">Translations</TableHead>
              <TableHead className="text-right text-warcrow-gold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
              </TableRow>
            ) : faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-warcrow-text/70">No FAQs found</TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium text-warcrow-text">{faq.section}</TableCell>
                  <TableCell className="text-warcrow-text max-h-20 overflow-hidden text-ellipsis">
                    {faq.content.substring(0, 100)}{faq.content.length > 100 ? '...' : ''}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <div className="flex items-center">
                        <span className="text-xs text-warcrow-text mr-1">ES:</span>
                        {faq.section_es && faq.content_es ? 
                          <span className="text-green-500">✓</span> : 
                          <span className="text-red-500">✗</span>
                        }
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-warcrow-text mr-1">FR:</span>
                        {faq.section_fr && faq.content_fr ? 
                          <span className="text-green-500">✓</span> : 
                          <span className="text-red-500">✗</span>
                        }
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTranslation(faq, 'es')}
                      className="text-warcrow-gold hover:bg-warcrow-accent/10"
                    >
                      <Languages className="h-4 w-4 mr-1" />
                      ES
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTranslation(faq, 'fr')}
                      className="text-warcrow-gold hover:bg-warcrow-accent/10"
                    >
                      <Languages className="h-4 w-4 mr-1" />
                      FR
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="text-red-400 hover:bg-warcrow-accent/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Translation Dialog */}
      {isEditing && selectedFAQ && (
        <TranslationEditDialog
          isOpen={isEditing}
          title={`Edit ${activeTab === 'es' ? 'Spanish' : 'French'} Translation`}
          originalText={selectedFAQ.content}
          sectionText={selectedFAQ.section}
          currentTranslation={
            activeTab === 'es'
              ? selectedFAQ.content_es || ''
              : selectedFAQ.content_fr || ''
          }
          currentSectionTranslation={
            activeTab === 'es'
              ? selectedFAQ.section_es || ''
              : selectedFAQ.section_fr || ''
          }
          targetLanguage={activeTab}
          onCancel={handleCancelEdit}
          onSave={handleUpdateTranslation}
        />
      )}

      {/* Create New FAQ Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[600px] bg-black border border-warcrow-gold/30">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Create New FAQ</DialogTitle>
            <DialogDescription className="text-warcrow-text">
              Add a new question and answer to the FAQ section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="section" className="text-warcrow-text">
                Section Title
              </Label>
              <Input
                id="section"
                value={newFAQ.section || ''}
                onChange={(e) => setNewFAQ({...newFAQ, section: e.target.value})}
                className="border-warcrow-gold/30 bg-black text-warcrow-gold"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="content" className="text-warcrow-text">
                Content
              </Label>
              <Textarea
                id="content"
                value={newFAQ.content || ''}
                onChange={(e) => setNewFAQ({...newFAQ, content: e.target.value})}
                className="border-warcrow-gold/30 bg-black text-warcrow-gold resize-none h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsCreating(false)}
              className="border-warcrow-gold/30 text-warcrow-gold hover:border-warcrow-gold/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleCreateFAQ} 
              disabled={isLoading}
              className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
            >
              Create FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQTranslationManager;
