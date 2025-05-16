
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, Save, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { batchTranslate } from "@/utils/translation";
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from "@/components/ui/progress";

interface SpecialRuleItem {
  id?: string;
  name: string;
  description: string;
  description_es?: string;
  description_fr?: string;
}

const UnitSpecialRulesManager: React.FC = () => {
  const [specialRules, setSpecialRules] = useState<SpecialRuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRule, setEditingRule] = useState<SpecialRuleItem | null>(null);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    fetchSpecialRules();
  }, []);

  const fetchSpecialRules = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('special_rules')
        .select('*')
        .order('name');

      if (error) throw error;
      setSpecialRules(data || []);
    } catch (error: any) {
      console.error("Error fetching special rules:", error);
      toast.error(`Failed to fetch special rules: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (rule: SpecialRuleItem) => {
    setEditingRule({ ...rule });
  };

  const saveRule = async () => {
    if (!editingRule) return;
    
    try {
      const { data, error } = await supabase
        .from('special_rules')
        .upsert({
          id: editingRule.id,
          name: editingRule.name,
          description: editingRule.description,
          description_es: editingRule.description_es,
          description_fr: editingRule.description_fr
        }, { onConflict: 'id' });

      if (error) throw error;
      
      setSpecialRules(specialRules.map(r => r.id === editingRule.id ? editingRule : r));
      setEditingRule(null);
      toast.success(`Saved special rule: ${editingRule.name}`);
    } catch (error: any) {
      console.error("Error saving special rule:", error);
      toast.error(`Failed to save: ${error.message}`);
    }
  };

  const translateAllRules = async (targetLanguage: string) => {
    if (specialRules.length === 0) {
      toast.error("No special rules to translate");
      return;
    }

    setTranslationInProgress(true);
    setTranslationProgress(0);
    
    try {
      const itemsToTranslate = specialRules
        .filter(r => r.description && (!r.description_es || targetLanguage === 'fr' && !r.description_fr))
        .map(r => ({
          id: r.id || '',
          key: 'description',
          source: r.description
        }));
      
      if (itemsToTranslate.length === 0) {
        toast.info("All special rules already have translations");
        setTranslationInProgress(false);
        return;
      }

      // Track progress
      const total = itemsToTranslate.length;
      let completed = 0;

      // Process in batches
      const batchSize = 10;
      for (let i = 0; i < itemsToTranslate.length; i += batchSize) {
        const batch = itemsToTranslate.slice(i, i + batchSize);
        
        // Extract just the text content for translation
        const textsToTranslate = batch.map(item => item.source);
        
        // Perform batch translation - fixed to use correct parameters
        const translatedTexts = await batchTranslate(textsToTranslate, targetLanguage);
        
        // Update each item with its translation
        for (let j = 0; j < batch.length; j++) {
          const item = batch[j];
          const translatedText = translatedTexts[j];
          
          if (translatedText) {
            // Update in Supabase
            await supabase
              .from('special_rules')
              .update({
                [targetLanguage === 'es' ? 'description_es' : 'description_fr']: translatedText
              })
              .eq('id', item.id);
          }
        }
        
        completed += batch.length;
        setTranslationProgress(Math.round((completed / total) * 100));
        
        // Small delay between batches
        if (i + batchSize < itemsToTranslate.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      await fetchSpecialRules(); // Refresh rule list
      toast.success(`Successfully translated ${itemsToTranslate.length} special rules`);
    } catch (error: any) {
      console.error("Error translating special rules:", error);
      toast.error(`Translation error: ${error.message}`);
    } finally {
      setTranslationInProgress(false);
    }
  };

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-warcrow-gold">Special Rules Management</h2>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-warcrow-gold/50 text-warcrow-gold"
              onClick={() => translateAllRules('es')}
              disabled={isLoading || translationInProgress}
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate to Spanish
            </Button>
            <Button 
              variant="outline" 
              className="border-warcrow-gold/50 text-warcrow-gold"
              onClick={() => translateAllRules('fr')}
              disabled={isLoading || translationInProgress}
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate to French
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
        
        {editingRule && (
          <Card className="p-4 border-warcrow-gold bg-black/70">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Rule Name</label>
                <Input 
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({...editingRule, name: e.target.value})}
                  className="bg-black border-warcrow-gold/50"
                />
              </div>
              
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Description (English)</label>
                <Textarea 
                  value={editingRule.description}
                  onChange={(e) => setEditingRule({...editingRule, description: e.target.value})}
                  className="bg-black border-warcrow-gold/50 h-24"
                />
              </div>
              
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Description (Spanish)</label>
                <Textarea 
                  value={editingRule.description_es || ''}
                  onChange={(e) => setEditingRule({...editingRule, description_es: e.target.value})}
                  className="bg-black border-warcrow-gold/50 h-24"
                />
              </div>
              
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Description (French)</label>
                <Textarea 
                  value={editingRule.description_fr || ''}
                  onChange={(e) => setEditingRule({...editingRule, description_fr: e.target.value})}
                  className="bg-black border-warcrow-gold/50 h-24"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingRule(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
                  onClick={saveRule}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        <div className="rounded border border-warcrow-gold/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
                <TableHead className="text-warcrow-gold">Rule Name</TableHead>
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
              ) : specialRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-warcrow-text/70">No special rules found</TableCell>
                </TableRow>
              ) : (
                specialRules.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-warcrow-accent/5">
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{rule.description}</TableCell>
                    <TableCell>
                      {rule.description_es ? '✓' : '—'}
                    </TableCell>
                    <TableCell>
                      {rule.description_fr ? '✓' : '—'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => startEditing(rule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default UnitSpecialRulesManager;
