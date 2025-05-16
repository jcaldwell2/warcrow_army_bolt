
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Languages, Eye } from "lucide-react";
import { EditingItem } from './types';
import { ColorTextEditor } from "../shared/ColorTextEditor";
import { FormattedTextPreview } from "../shared/FormattedTextPreview";
import { supabase } from "@/integrations/supabase/client";

interface TranslationEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: EditingItem | null;
  setEditingItem: (item: EditingItem | null) => void;
  saveInProgress: boolean;
  onSave: () => Promise<void>;
}

export const TranslationEditDialog: React.FC<TranslationEditDialogProps> = ({
  open,
  onOpenChange,
  editingItem,
  setEditingItem,
  saveInProgress,
  onSave
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  if (!editingItem) return null;
  
  const isSection = editingItem.type === 'section';
  
  // Function to handle translation of all fields at once
  const handleTranslateAll = async () => {
    if (!editingItem) return;
    
    try {
      // Prepare the texts to translate
      const textsToTranslate = [];
      const fieldsToTranslate = [];
      
      if (editingItem.title) {
        textsToTranslate.push(editingItem.title);
        fieldsToTranslate.push('title');
      }
      
      if (isSection && editingItem.content) {
        textsToTranslate.push(editingItem.content);
        fieldsToTranslate.push('content');
      }
      
      if (textsToTranslate.length === 0) {
        console.warn('No content to translate');
        return;
      }
      
      // Call the DeepL API via Supabase edge function
      const { data, error } = await supabase.functions.invoke('deepl-translate', {
        body: {
          texts: textsToTranslate,
          targetLanguage: 'ES',
          formality: 'more'
        }
      });
      
      if (error) {
        console.error('Translation error:', error);
        return;
      }
      
      if (data && data.translations && data.translations.length > 0) {
        // Update all the fields with their translations
        const updatedItem = { ...editingItem };
        
        fieldsToTranslate.forEach((field, index) => {
          if (data.translations[index]) {
            if (field === 'title') {
              updatedItem.title_es = data.translations[index];
            } else if (field === 'content') {
              updatedItem.content_es = data.translations[index];
            }
          }
        });
        
        setEditingItem(updatedItem);
      }
    } catch (error) {
      console.error('Error translating content:', error);
    }
  };
  
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl bg-black border border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {isSection ? 'Edit Section Translation' : 'Edit Chapter Translation'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Title section - two columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* English title (original) */}
            <div className="space-y-2">
              <Label htmlFor="title-en" className="text-warcrow-gold">English Title:</Label>
              <Input
                id="title-en"
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="border border-warcrow-gold/30 bg-black text-warcrow-text"
              />
            </div>
            
            {/* Spanish title */}
            <div className="space-y-2">
              <Label htmlFor="title-es" className="text-warcrow-gold">Spanish Title:</Label>
              <Input
                id="title-es"
                value={editingItem.title_es || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title_es: e.target.value })}
                className="border border-warcrow-gold/30 bg-black text-warcrow-text"
              />
            </div>
          </div>
          
          {/* Only show content fields for sections - two columns */}
          {isSection && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {/* English content (original) */}
                <div className="space-y-2">
                  <Label htmlFor="content-en" className="text-warcrow-gold">English Content:</Label>
                  <ColorTextEditor
                    id="content-en"
                    value={editingItem.content || ''}
                    onChange={(value) => setEditingItem({ ...editingItem, content: value })}
                    rows={12}
                    placeholder="Enter content in English"
                  />
                </div>
                
                {/* Spanish content */}
                <div className="space-y-2">
                  <Label htmlFor="content-es" className="text-warcrow-gold">Spanish Content:</Label>
                  <ColorTextEditor
                    id="content-es"
                    value={editingItem.content_es || ''}
                    onChange={(value) => setEditingItem({ ...editingItem, content_es: value })}
                    rows={12}
                    placeholder="Enter content in Spanish"
                  />
                </div>
              </div>
            </>
          )}
          
          {/* Preview toggle and preview content */}
          {isSection && (
            <div className="space-y-2 mt-2">
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={togglePreview}
                  variant="outline"
                  size="sm"
                  className="border-warcrow-gold/30 text-warcrow-gold"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
                
                <Button
                  type="button"
                  onClick={handleTranslateAll}
                  variant="outline"
                  size="sm"
                  className="border-warcrow-gold/30 text-warcrow-gold"
                >
                  <Languages className="h-4 w-4 mr-2" />
                  Translate All
                </Button>
              </div>
              
              {showPreview && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* English preview */}
                  <div className="space-y-2">
                    <Label className="text-warcrow-gold">English Preview:</Label>
                    <div className="p-4 border border-warcrow-gold/30 rounded-md bg-black/50 overflow-auto max-h-[300px]">
                      <FormattedTextPreview content={editingItem.content || ''} />
                    </div>
                  </div>
                  
                  {/* Spanish preview */}
                  <div className="space-y-2">
                    <Label className="text-warcrow-gold">Spanish Preview:</Label>
                    <div className="p-4 border border-warcrow-gold/30 rounded-md bg-black/50 overflow-auto max-h-[300px]">
                      <FormattedTextPreview content={editingItem.content_es || ''} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={() => onSave()} 
            disabled={saveInProgress} 
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
          >
            {saveInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
