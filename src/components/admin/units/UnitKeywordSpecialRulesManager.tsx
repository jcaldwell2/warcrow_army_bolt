import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, Save, Pencil, RefreshCw, Edit, Trash2, X, Plus, FileText, Tag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { translateText } from "@/utils/translation";
import { Search } from "lucide-react";

interface KeywordItem {
  id: string;
  name: string;
  description: string;
  description_es?: string;
  description_fr?: string;
  created_at?: string;
  updated_at?: string;
}

interface SpecialRuleItem {
  id?: string;
  name: string;
  description: string;
  description_es?: string;
  description_fr?: string;
}

type ItemType = 'keyword' | 'specialrule';

const UnitKeywordSpecialRulesManager: React.FC = () => {
  const [items, setItems] = useState<(KeywordItem | SpecialRuleItem)[]>([]);
  const [itemType, setItemType] = useState<ItemType>('keyword');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<KeywordItem | SpecialRuleItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<KeywordItem>>({
    name: '',
    description: '',
  });
  const [activeTranslationTab, setActiveTranslationTab] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);

  // Fetch items from Supabase
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      let data;
      let error;

      if (itemType === 'keyword') {
        const response = await supabase
          .from('unit_keywords')
          .select('*')
          .order('name');
        data = response.data;
        error = response.error;
      } else {
        const response = await supabase
          .from('special_rules')
          .select('*')
          .order('name');
        data = response.data;
        error = response.error;
      }

      if (error) throw error;
      
      setItems(data || []);
    } catch (error: any) {
      console.error(`Error fetching ${itemType}s:`, error);
      toast.error(`Failed to load ${itemType}s: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch based on selected item type
  useEffect(() => {
    fetchItems();
  }, [itemType]);

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit item
  const handleEditItem = (item: KeywordItem | SpecialRuleItem) => {
    setCurrentItem({...item});
    setIsEditDialogOpen(true);
    setActiveTranslationTab('en'); // Reset to English tab when opening dialog
  };

  // Update item in database
  const updateItem = async () => {
    if (!currentItem) return;
    
    try {
      let error;
      
      if (itemType === 'keyword') {
        const { error: updateError } = await supabase
          .from('unit_keywords')
          .update({
            name: currentItem.name,
            description: currentItem.description,
            description_es: currentItem.description_es,
            description_fr: currentItem.description_fr,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentItem.id);
          
        error = updateError;
      } else {
        const { error: updateError } = await supabase
          .from('special_rules')
          .update({
            name: currentItem.name,
            description: currentItem.description,
            description_es: currentItem.description_es,
            description_fr: currentItem.description_fr
          })
          .eq('id', currentItem.id);
          
        error = updateError;
      }

      if (error) throw error;
      
      toast.success(`${itemType === 'keyword' ? 'Keyword' : 'Special rule'} updated successfully`);
      setIsEditDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      console.error(`Error updating ${itemType}:`, error);
      toast.error(`Failed to update ${itemType}: ${error.message}`);
    }
  };

  // Translate item description
  const translateItemDescription = async () => {
    if (!currentItem) return;
    
    setIsTranslating(true);
    try {
      const targetLanguage = activeTranslationTab;
      
      if (targetLanguage === 'es' || targetLanguage === 'fr') {
        const translatedText = await translateText(currentItem.description, targetLanguage);
        
        if (targetLanguage === 'es') {
          setCurrentItem({
            ...currentItem,
            description_es: translatedText
          });
        } else if (targetLanguage === 'fr') {
          setCurrentItem({
            ...currentItem,
            description_fr: translatedText
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

  // Delete item
  const handleDeleteItem = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      let error;
      
      if (itemType === 'keyword') {
        const { error: deleteError } = await supabase
          .from('unit_keywords')
          .delete()
          .eq('id', id);
          
        error = deleteError;
      } else {
        const { error: deleteError } = await supabase
          .from('special_rules')
          .delete()
          .eq('id', id);
          
        error = deleteError;
      }

      if (error) throw error;
      
      toast.success(`${itemType === 'keyword' ? 'Keyword' : 'Special rule'} deleted successfully`);
      fetchItems();
    } catch (error: any) {
      console.error(`Error deleting ${itemType}:`, error);
      toast.error(`Failed to delete ${itemType}: ${error.message}`);
    }
  };

  // Add new item
  const addItem = async () => {
    if (!newItem.name || !newItem.description) {
      toast.error('Name and description are required');
      return;
    }
    
    try {
      let error;
      
      if (itemType === 'keyword') {
        const { error: insertError } = await supabase
          .from('unit_keywords')
          .insert([
            {
              name: newItem.name,
              description: newItem.description,
              description_es: newItem.description_es || null,
              description_fr: newItem.description_fr || null
            }
          ]);
          
        error = insertError;
      } else {
        const { error: insertError } = await supabase
          .from('special_rules')
          .insert([
            {
              name: newItem.name,
              description: newItem.description,
              description_es: newItem.description_es || null,
              description_fr: newItem.description_fr || null
            }
          ]);
          
        error = insertError;
      }

      if (error) throw error;
      
      toast.success(`${itemType === 'keyword' ? 'Keyword' : 'Special rule'} added successfully`);
      setIsAddDialogOpen(false);
      setNewItem({ name: '', description: '' });
      fetchItems();
    } catch (error: any) {
      console.error(`Error adding ${itemType}:`, error);
      toast.error(`Failed to add ${itemType}: ${error.message}`);
    }
  };

  // Batch translate all items
  const translateAllItems = async (targetLanguage: string) => {
    if (items.length === 0) {
      toast.error(`No ${itemType}s to translate`);
      return;
    }

    setIsTranslating(true);
    setTranslationProgress(0);
    
    try {
      // Items that need translation (don't have target language yet)
      const needTranslationItems = itemType === 'keyword'
        ? items.filter(i => i.description && (!i.description_es || targetLanguage === 'fr' && !i.description_fr))
        : items.filter(i => i.description && (!i.description_es || targetLanguage === 'fr' && !i.description_fr));
      
      if (needTranslationItems.length === 0) {
        toast.info(`All ${itemType}s already have translations`);
        setIsTranslating(false);
        return;
      }

      // Track progress
      const total = needTranslationItems.length;
      let completed = 0;
      const batchSize = 5;
      
      // Process in batches
      for (let i = 0; i < needTranslationItems.length; i += batchSize) {
        const batch = needTranslationItems.slice(i, i + batchSize);
        
        for (const item of batch) {
          // Translate the description
          const translatedText = await translateText(item.description, targetLanguage);
          
          // Update the item in the database
          if (itemType === 'keyword') {
            await supabase
              .from('unit_keywords')
              .update({
                [targetLanguage === 'es' ? 'description_es' : 'description_fr']: translatedText
              })
              .eq('id', item.id);
          } else {
            await supabase
              .from('special_rules')
              .update({
                [targetLanguage === 'es' ? 'description_es' : 'description_fr']: translatedText
              })
              .eq('id', item.id);
          }
          
          completed++;
          setTranslationProgress(Math.round((completed / total) * 100));
        }
        
        // Small delay between batches
        if (i + batchSize < needTranslationItems.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      await fetchItems(); // Refresh item list
      toast.success(`Successfully translated ${needTranslationItems.length} ${itemType}s`);
    } catch (error: any) {
      console.error(`Error translating ${itemType}s:`, error);
      toast.error(`Translation error: ${error.message}`);
    } finally {
      setIsTranslating(false);
      setTranslationProgress(0);
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-black border-warcrow-gold/30">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Tabs 
            value={itemType} 
            onValueChange={(value) => setItemType(value as ItemType)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger 
                value="keyword" 
                className="text-warcrow-text hover:text-warcrow-gold"
              >
                <Tag className="h-4 w-4 mr-2" />
                Keywords
              </TabsTrigger>
              <TabsTrigger 
                value="specialrule" 
                className="text-warcrow-text hover:text-warcrow-gold"
              >
                <FileText className="h-4 w-4 mr-2" />
                Special Rules
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-warcrow-text/50" />
              <Input
                placeholder={`Search ${itemType === 'keyword' ? 'keywords' : 'special rules'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-black border-warcrow-gold/30 text-warcrow-text"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={fetchItems}
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
                Add {itemType === 'keyword' ? 'Keyword' : 'Special Rule'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            className="border-warcrow-gold/50 text-warcrow-gold"
            onClick={() => translateAllItems('es')}
            disabled={isLoading || isTranslating}
          >
            <Languages className="h-4 w-4 mr-2" />
            Translate to Spanish
          </Button>
          <Button 
            variant="outline" 
            className="border-warcrow-gold/50 text-warcrow-gold"
            onClick={() => translateAllItems('fr')}
            disabled={isLoading || isTranslating}
          >
            <Languages className="h-4 w-4 mr-2" />
            Translate to French
          </Button>
        </div>

        {isTranslating && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-warcrow-text/90">Translation progress</span>
              <span className="text-sm font-medium text-warcrow-gold">{translationProgress}%</span>
            </div>
            <Progress value={translationProgress} className="h-1.5 bg-warcrow-gold/20" />
          </div>
        )}

        <div className="rounded border border-warcrow-gold/30 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
                <TableHead className="text-warcrow-gold">Name</TableHead>
                <TableHead className="text-warcrow-gold">Description</TableHead>
                <TableHead className="text-warcrow-gold">Spanish</TableHead>
                <TableHead className="text-warcrow-gold">French</TableHead>
                <TableHead className="text-warcrow-gold w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-warcrow-text/70">
                    No {itemType === 'keyword' ? 'keywords' : 'special rules'} found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-warcrow-accent/5">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-lg">
                      <div className="line-clamp-2 text-sm text-warcrow-text/80">
                        {item.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.description_es ? (
                        <div className="h-2 w-2 rounded-full bg-green-500 mx-auto" title="Has Spanish translation"></div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-red-500/60 mx-auto" title="Missing Spanish translation"></div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.description_fr ? (
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
                          onClick={() => handleEditItem(item)}
                          className="h-8 w-8 p-0 text-warcrow-gold hover:text-warcrow-gold/80"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteItem(item.id)}
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

        {filteredItems.length > 0 && (
          <div className="text-sm text-warcrow-text/70">
            Showing {filteredItems.length} of {items.length} {itemType === 'keyword' ? 'keywords' : 'special rules'}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-warcrow-accent border-warcrow-gold/30 text-warcrow-text max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">
              Edit {itemType === 'keyword' ? 'Keyword' : 'Special Rule'}
            </DialogTitle>
          </DialogHeader>
          
          {currentItem && (
            <div>
              <Tabs value={activeTranslationTab} onValueChange={setActiveTranslationTab} className="w-full mt-2">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="en" className="text-sm">English</TabsTrigger>
                  <TabsTrigger value="es" className="text-sm">Español</TabsTrigger>
                  <TabsTrigger value="fr" className="text-sm">Français</TabsTrigger>
                </TabsList>
                
                {/* English Content */}
                <TabsContent value="en" className="pt-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Name</label>
                      <Input
                        value={currentItem.name}
                        onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                        className="bg-black/60 border-warcrow-gold/30"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Description (English)</label>
                      <Textarea
                        value={currentItem.description}
                        onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
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
                      onClick={translateItemDescription}
                      disabled={isTranslating}
                      className="border-warcrow-gold/30 text-warcrow-gold"
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      {isTranslating ? 'Translating...' : 'Translate to Spanish'}
                    </Button>
                  </div>
                
                  <div>
                    <label className="text-sm text-warcrow-text/80 mb-1 block">Description (Spanish)</label>
                    <Textarea
                      value={currentItem.description_es || ''}
                      onChange={(e) => setCurrentItem({...currentItem, description_es: e.target.value})}
                      className="bg-black/60 border-warcrow-gold/30 min-h-[200px]"
                    />
                  </div>
                  
                  {/* Show original English for reference */}
                  <div className="mt-4 p-3 bg-black/30 border border-warcrow-gold/20 rounded-md">
                    <h4 className="text-sm font-medium text-warcrow-gold mb-2">English Reference</h4>
                    <div className="space-y-1 text-sm text-warcrow-text/80">
                      <p><span className="font-medium">Name:</span> {currentItem.name}</p>
                      <p><span className="font-medium">Description:</span></p>
                      <p className="whitespace-pre-wrap text-xs">{currentItem.description}</p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* French Content */}
                <TabsContent value="fr" className="pt-2">
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={translateItemDescription}
                      disabled={isTranslating}
                      className="border-warcrow-gold/30 text-warcrow-gold"
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      {isTranslating ? 'Translating...' : 'Translate to French'}
                    </Button>
                  </div>
                
                  <div>
                    <label className="text-sm text-warcrow-text/80 mb-1 block">Description (French)</label>
                    <Textarea
                      value={currentItem.description_fr || ''}
                      onChange={(e) => setCurrentItem({...currentItem, description_fr: e.target.value})}
                      className="bg-black/60 border-warcrow-gold/30 min-h-[200px]"
                    />
                  </div>
                  
                  {/* Show original English for reference */}
                  <div className="mt-4 p-3 bg-black/30 border border-warcrow-gold/20 rounded-md">
                    <h4 className="text-sm font-medium text-warcrow-gold mb-2">English Reference</h4>
                    <div className="space-y-1 text-sm text-warcrow-text/80">
                      <p><span className="font-medium">Name:</span> {currentItem.name}</p>
                      <p><span className="font-medium">Description:</span></p>
                      <p className="whitespace-pre-wrap text-xs">{currentItem.description}</p>
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
              onClick={updateItem}
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
            <DialogTitle className="text-warcrow-gold">
              Add New {itemType === 'keyword' ? 'Keyword' : 'Special Rule'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Name</label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="bg-black/60 border-warcrow-gold/30"
              />
            </div>
            
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Description (English)</label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="bg-black/60 border-warcrow-gold/30 min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Description (Spanish) - Optional</label>
              <Textarea
                value={newItem.description_es || ''}
                onChange={(e) => setNewItem({...newItem, description_es: e.target.value})}
                className="bg-black/60 border-warcrow-gold/30 min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="text-sm text-warcrow-text/80 mb-1 block">Description (French) - Optional</label>
              <Textarea
                value={newItem.description_fr || ''}
                onChange={(e) => setNewItem({...newItem, description_fr: e.target.value})}
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
              onClick={addItem}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Add {itemType === 'keyword' ? 'Keyword' : 'Special Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UnitKeywordSpecialRulesManager;
