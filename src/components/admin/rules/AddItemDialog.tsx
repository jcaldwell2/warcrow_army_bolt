
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Languages } from "lucide-react";
import { ColorTextEditor } from "../shared/ColorTextEditor";
import { FormattedTextPreview } from "../shared/FormattedTextPreview";
import { supabase } from "@/integrations/supabase/client";

interface Chapter {
  id: string;
  title: string;
}

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'chapter' | 'section';
  chapters: Chapter[];
  onSave: (data: NewItemData) => Promise<void>;
  saveInProgress: boolean;
}

export interface NewItemData {
  type: 'chapter' | 'section';
  title: string;
  title_es: string;
  content?: string;
  content_es?: string;
  chapter_id?: string;
  order_index?: number;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  onOpenChange,
  type,
  chapters,
  onSave,
  saveInProgress
}) => {
  const [newItem, setNewItem] = useState<NewItemData>({
    type,
    title: '',
    title_es: '',
    content: type === 'section' ? '' : undefined,
    content_es: type === 'section' ? '' : undefined,
    chapter_id: type === 'section' ? (chapters[0]?.id || '') : undefined,
    order_index: 1
  });

  const handleChange = (field: keyof NewItemData, value: string | number) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContentChange = (field: 'content' | 'content_es', value: string) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Function to handle translation of individual fields
  const handleTranslate = async (field: 'title' | 'content') => {
    try {
      // Prepare the source text to translate
      const textToTranslate = field === 'title' ? newItem.title : newItem.content;
      
      if (!textToTranslate) {
        console.warn(`No ${field} to translate`);
        return;
      }
      
      // Call the DeepL API via Supabase edge function
      const { data, error } = await supabase.functions.invoke('deepl-translate', {
        body: {
          texts: [textToTranslate],
          targetLanguage: 'ES',
          formality: 'more'
        }
      });
      
      if (error) {
        console.error('Translation error:', error);
        return;
      }
      
      if (data && data.translations && data.translations.length > 0) {
        // Update the appropriate field with the translation
        if (field === 'title') {
          handleChange('title_es', data.translations[0]);
        } else {
          handleContentChange('content_es', data.translations[0]);
        }
      }
    } catch (error) {
      console.error(`Error translating ${field}:`, error);
    }
  };

  const handleSave = async () => {
    await onSave(newItem);
    setNewItem({
      type,
      title: '',
      title_es: '',
      content: type === 'section' ? '' : undefined,
      content_es: type === 'section' ? '' : undefined,
      chapter_id: type === 'section' ? (chapters[0]?.id || '') : undefined,
      order_index: 1
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl bg-black border border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {type === 'chapter' ? 'Add New Chapter' : 'Add New Section'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Order Index */}
          <div className="space-y-2">
            <Label htmlFor="order-index" className="text-warcrow-gold">Order Index:</Label>
            <Input
              id="order-index"
              type="number"
              value={newItem.order_index || 1}
              onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 1)}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text"
            />
          </div>
          
          {/* Parent Chapter (for sections only) */}
          {type === 'section' && (
            <div className="space-y-2">
              <Label htmlFor="chapter-id" className="text-warcrow-gold">Parent Chapter:</Label>
              <Select 
                value={newItem.chapter_id} 
                onValueChange={(value) => handleChange('chapter_id', value)}
              >
                <SelectTrigger id="chapter-id" className="border border-warcrow-gold/30 bg-black text-warcrow-text">
                  <SelectValue placeholder="Select a chapter" />
                </SelectTrigger>
                <SelectContent className="border border-warcrow-gold/30 bg-black text-warcrow-text">
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Titles section - two columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* English title */}
            <div className="space-y-2">
              <Label htmlFor="title-en" className="text-warcrow-gold">English Title:</Label>
              <Input
                id="title-en"
                value={newItem.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="border border-warcrow-gold/30 bg-black text-warcrow-text"
              />
            </div>
            
            {/* Spanish title with translate button */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="title-es" className="text-warcrow-gold">Spanish Title:</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleTranslate('title')}
                  className="h-6 px-2 text-xs border-warcrow-gold/30 text-warcrow-gold"
                >
                  <Languages className="h-3 w-3 mr-1" />
                  Translate
                </Button>
              </div>
              <Input
                id="title-es"
                value={newItem.title_es}
                onChange={(e) => handleChange('title_es', e.target.value)}
                className="border border-warcrow-gold/30 bg-black text-warcrow-text"
              />
            </div>
          </div>
          
          {/* Content fields (for sections only) - two columns */}
          {type === 'section' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {/* English content */}
                <div className="space-y-2">
                  <Label htmlFor="content-en" className="text-warcrow-gold">English Content:</Label>
                  <ColorTextEditor
                    id="content-en"
                    value={newItem.content || ''}
                    onChange={(value) => handleContentChange('content', value)}
                    rows={12}
                    placeholder="Enter content in English"
                  />
                  
                  {/* Preview of the formatted content */}
                  <Label className="text-warcrow-gold mt-2">Preview:</Label>
                  <FormattedTextPreview content={newItem.content || ''} />
                </div>
                
                {/* Spanish content with translate button */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="content-es" className="text-warcrow-gold">Spanish Content:</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleTranslate('content')}
                      className="h-6 px-2 text-xs border-warcrow-gold/30 text-warcrow-gold"
                    >
                      <Languages className="h-3 w-3 mr-1" />
                      Translate
                    </Button>
                  </div>
                  <ColorTextEditor
                    id="content-es"
                    value={newItem.content_es || ''}
                    onChange={(value) => handleContentChange('content_es', value)}
                    rows={12}
                    placeholder="Enter content in Spanish"
                  />
                  
                  {/* Preview of the formatted content */}
                  <Label className="text-warcrow-gold mt-2">Preview:</Label>
                  <FormattedTextPreview content={newItem.content_es || ''} />
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={saveInProgress} 
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
          >
            {saveInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {type === 'chapter' ? 'Add Chapter' : 'Add Section'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
