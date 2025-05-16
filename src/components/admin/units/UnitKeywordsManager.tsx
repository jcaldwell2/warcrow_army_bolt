
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, RefreshCw, Edit, Trash2, Save, X, Plus, Languages } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { batchTranslate } from '@/utils/translation/batchTranslate';
import { TranslatedText } from '@/utils/types/translationTypes';

interface KeywordItem {
  id: string;
  name: string;
  name_es?: string;
  name_fr?: string;
  description: string;
  description_es?: string;
  description_fr?: string;
  created_at?: string;
  updated_at?: string;
}

const UnitKeywordsManager: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState<KeywordItem | null>(null);
  const [newKeyword, setNewKeyword] = useState<Partial<KeywordItem>>({
    name: '',
    description: '',
  });
  const [activeTranslationTab, setActiveTranslationTab] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isBatchTranslating, setIsBatchTranslating] = useState(false);
  const [batchLanguage, setBatchLanguage] = useState<'es' | 'fr'>('es');
  const [batchProgress, setBatchProgress] = useState(0);

  // Fetch keywords from Supabase
  const fetchKeywords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('unit_keywords')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setKeywords(data || []);
    } catch (error: any) {
      console.error("Error fetching keywords:", error);
      toast.error(`Failed to load keywords: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchKeywords();
  }, []);

  // Filter keywords based on search
  const filteredKeywords = keywords.filter(keyword => 
    keyword.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    keyword.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit keyword
  const handleEditKeyword = (keyword: KeywordItem) => {
    setCurrentKeyword({...keyword});
    setIsEditDialogOpen(true);
    setActiveTranslationTab('en'); // Reset to English tab when opening dialog
  };

  // Update keyword in database
  const updateKeyword = async () => {
    if (!currentKeyword) return;
    
    try {
      const { error } = await supabase
        .from('unit_keywords')
        .update({
          name: currentKeyword.name,
          name_es: currentKeyword.name_es,
          name_fr: currentKeyword.name_fr,
          description: currentKeyword.description,
          description_es: currentKeyword.description_es,
          description_fr: currentKeyword.description_fr,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentKeyword.id);

      if (error) throw error;
      
      toast.success('Keyword updated successfully');
      setIsEditDialogOpen(false);
      fetchKeywords();
    } catch (error: any) {
      console.error("Error updating keyword:", error);
      toast.error(`Failed to update keyword: ${error.message}`);
    }
  };

  // Translate keyword name and description
  const translateKeywordData = async () => {
    if (!currentKeyword) return;
    
    setIsTranslating(true);
    try {
      const targetLanguage = activeTranslationTab;
      
      if (targetLanguage === 'es' || targetLanguage === 'fr') {
        // Translate both name and description
        const dataToTranslate = [currentKeyword.name, currentKeyword.description];
        const translations = await batchTranslate(dataToTranslate, targetLanguage) as string[];
        
        const translatedName = translations[0] || '';
        const translatedDescription = translations[1] || '';
        
        if (targetLanguage === 'es') {
          setCurrentKeyword({
            ...currentKeyword,
            name_es: translatedName,
            description_es: translatedDescription
          });
        } else if (targetLanguage === 'fr') {
          setCurrentKeyword({
            ...currentKeyword,
            name_fr: translatedName,
            description_fr: translatedDescription
          });
        }
        
        toast.success(`Translation to ${targetLanguage === 'es' ? 'Spanish' : 'French'} completed`);
      }
    } catch (error: any) {
      console.error("Translation error:", error);
      toast.error(`Failed to translate: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Batch translate all keywords
  const handleBatchTranslate = async (language: 'es' | 'fr') => {
    if (isBatchTranslating) return;
    if (!confirm(`Are you sure you want to batch translate all missing ${language === 'es' ? 'Spanish' : 'French'} keywords? This will only translate keywords that don't have translations yet.`)) {
      return;
    }
    
    setBatchLanguage(language);
    setIsBatchTranslating(true);
    setBatchProgress(0);
    
    try {
      // Find keywords without translations
      const keywordsToTranslate = keywords.filter(keyword => {
        if (language === 'es') {
          return !keyword.name_es || !keyword.description_es;
        } else {
          return !keyword.name_fr || !keyword.description_fr;
        }
      });
      
      if (keywordsToTranslate.length === 0) {
        toast.info(`All ${language === 'es' ? 'Spanish' : 'French'} translations are already complete`);
        setIsBatchTranslating(false);
        return;
      }
      
      // Split into batches to show progress
      const batchSize = 10;
      const totalKeywords = keywordsToTranslate.length;
      
      for (let i = 0; i < totalKeywords; i += batchSize) {
        const batch = keywordsToTranslate.slice(i, i + batchSize);
        const updatePromises = batch.map(async (keyword) => {
          try {
            // Prepare data to translate
            const dataToTranslate = [];
            
            // Check if name translation is missing
            if (language === 'es' && !keyword.name_es) {
              dataToTranslate.push(keyword.name);
            } else if (language === 'fr' && !keyword.name_fr) {
              dataToTranslate.push(keyword.name);
            }
            
            // Check if description translation is missing
            if (language === 'es' && !keyword.description_es) {
              dataToTranslate.push(keyword.description);
            } else if (language === 'fr' && !keyword.description_fr) {
              dataToTranslate.push(keyword.description);
            }
            
            // Skip if nothing to translate
            if (dataToTranslate.length === 0) return;
            
            // Translate data
            const translations = await batchTranslate(dataToTranslate, language) as string[];
            
            // Prepare update object
            const updateData: any = {};
            let translationIndex = 0;
            
            if (language === 'es' && !keyword.name_es) {
              updateData.name_es = translations[translationIndex++];
            } else if (language === 'fr' && !keyword.name_fr) {
              updateData.name_fr = translations[translationIndex++];
            }
            
            if (language === 'es' && !keyword.description_es) {
              updateData.description_es = translations[translationIndex++];
            } else if (language === 'fr' && !keyword.description_fr) {
              updateData.description_fr = translations[translationIndex++];
            }
            
            // Update in database
            const { error } = await supabase
              .from('unit_keywords')
              .update(updateData)
              .eq('id', keyword.id);
              
            if (error) throw error;
          } catch (error: any) {
            console.error(`Error translating keyword ${keyword.name}:`, error);
            return { keyword, error };
          }
        });
        
        // Wait for batch to complete
        await Promise.all(updatePromises);
        
        // Update progress
        const progress = Math.min(100, Math.round(((i + batch.length) / totalKeywords) * 100));
        setBatchProgress(progress);
      }
      
      // Refresh the keyword list
      await fetchKeywords();
      toast.success(`Batch translation to ${language === 'es' ? 'Spanish' : 'French'} completed`);
    } catch (error: any) {
      console.error("Batch translation error:", error);
      toast.error(`Failed to batch translate: ${error.message}`);
    } finally {
      setIsBatchTranslating(false);
      setBatchProgress(0);
    }
  };

  // Delete keyword
  const handleDeleteKeyword = async (id: string) => {
    if (!confirm("Are you sure you want to delete this keyword? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('unit_keywords')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Keyword deleted successfully');
      fetchKeywords();
    } catch (error: any) {
      console.error("Error deleting keyword:", error);
      toast.error(`Failed to delete keyword: ${error.message}`);
    }
  };

  // Add new keyword
  const addKeyword = async () => {
    if (!newKeyword.name || !newKeyword.description) {
      toast.error('Name and description are required');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('unit_keywords')
        .insert([
          {
            name: newKeyword.name,
            name_es: newKeyword.name_es || null,
            name_fr: newKeyword.name_fr || null,
            description: newKeyword.description,
            description_es: newKeyword.description_es || null,
            description_fr: newKeyword.description_fr || null
          }
        ]);

      if (error) throw error;
      
      toast.success('Keyword added successfully');
      setIsAddDialogOpen(false);
      setNewKeyword({ name: '', description: '' });
      fetchKeywords();
    } catch (error: any) {
      console.error("Error adding keyword:", error);
      toast.error(`Failed to add keyword: ${error.message}`);
    }
  };

  const [translation, setTranslation] = useState('');

  return (
    <Card className="p-4 space-y-4 bg-black border-warcrow-gold/30">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-warcrow-gold">Unit Keywords</h2>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-warcrow-text/50" />
            <Input
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-black border-warcrow-gold/30 text-warcrow-text"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={fetchKeywords}
            className="border-warcrow-gold/30 text-warcrow-gold"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Keyword
          </Button>
        </div>
      </div>

      {/* Batch Translation Controls */}
      <div className="flex items-center justify-between p-3 bg-black/50 border border-warcrow-gold/30 rounded-md">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-warcrow-gold mb-1">Batch Translation</h3>
          <p className="text-xs text-warcrow-text/80">Translate all missing keywords at once for each language</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            disabled={isBatchTranslating}
            onClick={() => handleBatchTranslate('es')}
            className="border-warcrow-gold/30 text-warcrow-gold"
          >
            <Languages className="h-4 w-4 mr-2" />
            {isBatchTranslating && batchLanguage === 'es' ? `Translating... ${batchProgress}%` : 'Batch Translate to Spanish'}
          </Button>
          <Button
            variant="outline"
            disabled={isBatchTranslating}
            onClick={() => handleBatchTranslate('fr')}
            className="border-warcrow-gold/30 text-warcrow-gold"
          >
            <Languages className="h-4 w-4 mr-2" />
            {isBatchTranslating && batchLanguage === 'fr' ? `Translating... ${batchProgress}%` : 'Batch Translate to French'}
          </Button>
        </div>
      </div>

      <div className="rounded border border-warcrow-gold/30 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
              <TableHead className="text-warcrow-gold">Keyword</TableHead>
              <TableHead className="text-warcrow-gold">Description</TableHead>
              <TableHead className="text-warcrow-gold">Spanish Name</TableHead>
              <TableHead className="text-warcrow-gold">Spanish Description</TableHead>
              <TableHead className="text-warcrow-gold">French Name</TableHead>
              <TableHead className="text-warcrow-gold">French Description</TableHead>
              <TableHead className="text-warcrow-gold w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
              </TableRow>
            ) : filteredKeywords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-warcrow-text/70">No keywords found</TableCell>
              </TableRow>
            ) : (
              filteredKeywords.map((keyword) => (
                <TableRow key={keyword.id} className="hover:bg-warcrow-accent/5">
                  <TableCell className="font-medium">{keyword.name}</TableCell>
                  <TableCell className="max-w-lg">
                    <div className="line-clamp-2 text-sm text-warcrow-text/80">
                      {keyword.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {keyword.name_es ? (
                      <div className="h-2 w-2 rounded-full bg-green-500 mx-auto" title={keyword.name_es}></div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-red-500/60 mx-auto" title="Missing Spanish translation"></div>
                    )}
                  </TableCell>
                  <TableCell>
                    {keyword.description_es ? (
                      <div className="h-2 w-2 rounded-full bg-green-500 mx-auto" title="Has Spanish translation"></div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-red-500/60 mx-auto" title="Missing Spanish translation"></div>
                    )}
                  </TableCell>
                  <TableCell>
                    {keyword.name_fr ? (
                      <div className="h-2 w-2 rounded-full bg-green-500 mx-auto" title={keyword.name_fr}></div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-red-500/60 mx-auto" title="Missing French translation"></div>
                    )}
                  </TableCell>
                  <TableCell>
                    {keyword.description_fr ? (
                      <div className="h-2 w-2 rounded-full bg-green-500 mx-auto" title="Has French translation"></div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-red-500/60 mx-auto" title="Missing French translation"></div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditKeyword(keyword)}
                        className="h-8 w-8 p-0 text-warcrow-gold hover:text-warcrow-gold/80"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteKeyword(keyword.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredKeywords.length > 0 && (
        <div className="text-sm text-warcrow-text/70">
          Showing {filteredKeywords.length} of {keywords.length} keywords
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-warcrow-accent border-warcrow-gold/30 text-warcrow-text max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Edit Keyword</DialogTitle>
          </DialogHeader>
          
          {currentKeyword && (
            <div>
              <Tabs value={activeTranslationTab} onValueChange={setActiveTranslationTab} className="w-full mt-2">
                <TabsList className="grid grid-cols-3 mb-4 bg-black/60">
                  <TabsTrigger value="en" className="text-sm data-[state=active]:bg-warcrow-gold data-[state=active]:text-black">English</TabsTrigger>
                  <TabsTrigger value="es" className="text-sm data-[state=active]:bg-warcrow-gold data-[state=active]:text-black">Español</TabsTrigger>
                  <TabsTrigger value="fr" className="text-sm data-[state=active]:bg-warcrow-gold data-[state=active]:text-black">Français</TabsTrigger>
                </TabsList>
                
                {/* English Content */}
                <TabsContent value="en" className="pt-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Keyword Name</label>
                      <Input
                        value={currentKeyword.name}
                        onChange={(e) => setCurrentKeyword({...currentKeyword, name: e.target.value})}
                        className="bg-black/60 border-warcrow-gold/30"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Description (English)</label>
                      <Textarea
                        value={currentKeyword.description}
                        onChange={(e) => setCurrentKeyword({...currentKeyword, description: e.target.value})}
                        className="bg-black/60 border-warcrow-gold/30 min-h-[200px]"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Spanish Content */}
                <TabsContent value="es" className="pt-2">
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={translateKeywordData}
                      disabled={isTranslating}
                      className="border-warcrow-gold/30 text-warcrow-gold"
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      {isTranslating ? 'Translating...' : 'Translate to Spanish'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Keyword Name (Spanish)</label>
                      <Input
                        value={currentKeyword.name_es || ''}
                        onChange={(e) => setCurrentKeyword({...currentKeyword, name_es: e.target.value})}
                        className="bg-black/60 border-warcrow-gold/30"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Description (Spanish)</label>
                      <Textarea
                        value={currentKeyword.description_es || ''}
                        onChange={(e) => setCurrentKeyword({...currentKeyword, description_es: e.target.value})}
                        className="bg-black/60 border-warcrow-gold/30 min-h-[200px]"
                      />
                    </div>
                  </div>
                  
                  {/* Show original English for reference */}
                  <div className="mt-4 p-3 bg-black/30 border border-warcrow-gold/20 rounded-md">
                    <h4 className="text-sm font-medium text-warcrow-gold mb-2">English Reference</h4>
                    <div className="space-y-1 text-sm text-warcrow-text/80">
                      <p><span className="font-medium">Name:</span> {currentKeyword.name}</p>
                      <p><span className="font-medium">Description:</span></p>
                      <p className="whitespace-pre-wrap text-xs">{currentKeyword.description}</p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* French Content */}
                <TabsContent value="fr" className="pt-2">
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={translateKeywordData}
                      disabled={isTranslating}
                      className="border-warcrow-gold/30 text-warcrow-gold"
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      {isTranslating ? 'Translating...' : 'Translate to French'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Keyword Name (French)</label>
                      <Input
                        value={currentKeyword.name_fr || ''}
                        onChange={(e) => setCurrentKeyword({...currentKeyword, name_fr: e.target.value})}
                        className="bg-black/60 border-warcrow-gold/30"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Description (French)</label>
                      <Textarea
                        value={currentKeyword.description_fr || ''}
                        onChange={(e) => setCurrentKeyword({...currentKeyword, description_fr: e.target.value})}
                        className="bg-black/60 border-warcrow-gold/30 min-h-[200px]"
                      />
                    </div>
                  </div>
                  
                  {/* Show original English for reference */}
                  <div className="mt-4 p-3 bg-black/30 border border-warcrow-gold/20 rounded-md">
                    <h4 className="text-sm font-medium text-warcrow-gold mb-2">English Reference</h4>
                    <div className="space-y-1 text-sm text-warcrow-text/80">
                      <p><span className="font-medium">Name:</span> {currentKeyword.name}</p>
                      <p><span className="font-medium">Description:</span></p>
                      <p className="whitespace-pre-wrap text-xs">{currentKeyword.description}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-warcrow-gold/30 text-warcrow-text"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={updateKeyword}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-warcrow-accent border-warcrow-gold/30 text-warcrow-text">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Add New Keyword</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Keyword Name</label>
              <Input
                value={newKeyword.name}
                onChange={(e) => setNewKeyword({...newKeyword, name: e.target.value})}
                className="bg-black/60 border-warcrow-gold/30"
              />
            </div>
            
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Description (English)</label>
              <Textarea
                value={newKeyword.description}
                onChange={(e) => setNewKeyword({...newKeyword, description: e.target.value})}
                className="bg-black/60 border-warcrow-gold/30 min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Name (Spanish) - Optional</label>
              <Input
                value={newKeyword.name_es || ''}
                onChange={(e) => setNewKeyword({...newKeyword, name_es: e.target.value})}
                className="bg-black/60 border-warcrow-gold/30"
              />
            </div>
            
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Description (Spanish) - Optional</label>
              <Textarea
                value={newKeyword.description_es || ''}
                onChange={(e) => setNewKeyword({...newKeyword, description_es: e.target.value})}
                className="bg-black/60 border-warcrow-gold/30 min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Name (French) - Optional</label>
              <Input
                value={newKeyword.name_fr || ''}
                onChange={(e) => setNewKeyword({...newKeyword, name_fr: e.target.value})}
                className="bg-black/60 border-warcrow-gold/30"
              />
            </div>
            
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Description (French) - Optional</label>
              <Textarea
                value={newKeyword.description_fr || ''}
                onChange={(e) => setNewKeyword({...newKeyword, description_fr: e.target.value})}
                className="bg-black/60 border-warcrow-gold/30 min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="border-warcrow-gold/30 text-warcrow-text"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={addKeyword}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Add Keyword
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UnitKeywordsManager;
