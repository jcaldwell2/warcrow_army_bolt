
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash2, X, RefreshCw, Languages } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { batchTranslate } from '@/utils/translation/batchTranslate';

interface Faction {
  id: string;
  name: string;
  name_es?: string;
  name_fr?: string;
  created_at?: string;
  updated_at?: string;
}

const FactionManager: React.FC = () => {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newFaction, setNewFaction] = useState<Faction>({ id: '', name: '' });
  const [editingFaction, setEditingFaction] = useState<Faction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [unitCountByFaction, setUnitCountByFaction] = useState<Record<string, number>>({});
  const [activeTranslationTab, setActiveTranslationTab] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchFactions();
    fetchUnitCounts();
  }, []);

  const fetchFactions = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      console.log("[FactionManager] Fetching factions from database");
      const { data, error } = await supabase
        .from('factions')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('[FactionManager] Error fetching factions:', error);
        setFetchError(`Failed to fetch factions: ${error.message}`);
        toast.error(`Failed to fetch factions: ${error.message}`);
        throw error;
      }
      
      if (data) {
        console.log(`[FactionManager] Successfully fetched ${data.length} factions`);
        setFactions(data);
        
        if (data.length === 0) {
          console.log('[FactionManager] No factions found in database');
          toast.warning('No factions found in database. You should add some factions.', {
            duration: 5000,
            id: 'admin-faction-empty-notice'
          });
        }
      }
    } catch (error: any) {
      console.error('[FactionManager] Error fetching factions:', error);
      toast.error(`Failed to fetch factions: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnitCounts = async () => {
    try {
      // Get all unit data
      const { data, error } = await supabase
        .from('unit_data')
        .select('faction');

      if (error) throw error;

      // Count by faction
      const counts: Record<string, number> = {};
      if (data && data.length > 0) {
        data.forEach((item: any) => {
          if (item.faction) {
            counts[item.faction] = (counts[item.faction] || 0) + 1;
          }
        });
      }
      setUnitCountByFaction(counts);
    } catch (error: any) {
      console.error('[FactionManager] Error fetching unit counts:', error);
    }
  };

  const handleAddNewFaction = () => {
    setEditingFaction(null);
    setNewFaction({ id: '', name: '' });
    setIsModalOpen(true);
  };

  const handleEditFaction = (faction: Faction) => {
    setEditingFaction({ ...faction });
    setNewFaction(faction);
    setIsModalOpen(true);
  };

  const handleDeleteFaction = (factionId: string) => {
    setDeleteTarget(factionId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteFaction = async () => {
    if (!deleteTarget) return;
    
    try {
      const { error } = await supabase.rpc('delete_faction_cascade', {
        faction_id: deleteTarget
      });

      if (error) throw error;
      
      toast.success('Faction and all related units deleted successfully');
      fetchFactions();
      fetchUnitCounts();
    } catch (error: any) {
      console.error('[FactionManager] Error deleting faction:', error);
      toast.error(`Failed to delete faction: ${error.message}`);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const validateNewFaction = () => {
    if (!newFaction.id.trim()) {
      toast.error('Faction ID is required');
      return false;
    }
    
    if (!newFaction.name.trim()) {
      toast.error('Faction name is required');
      return false;
    }

    // Only check for duplicate ID if creating a new faction (not when editing)
    if (!editingFaction) {
      const existingFaction = factions.find(f => f.id === newFaction.id);
      if (existingFaction) {
        toast.error('Faction ID already exists');
        return false;
      }
    }
    
    return true;
  };

  const handleSaveFaction = async () => {
    if (!validateNewFaction()) return;

    try {
      if (editingFaction) {
        // Update existing faction
        const { error } = await supabase
          .from('factions')
          .update({
            name: newFaction.name,
            name_es: newFaction.name_es,
            name_fr: newFaction.name_fr,
          })
          .eq('id', editingFaction.id);

        if (error) throw error;
        toast.success('Faction updated successfully');
      } else {
        // Create new faction
        const { error } = await supabase
          .from('factions')
          .insert({
            id: newFaction.id,
            name: newFaction.name,
            name_es: newFaction.name_es,
            name_fr: newFaction.name_fr,
          });

        if (error) throw error;
        toast.success('Faction added successfully');
      }
      
      setIsModalOpen(false);
      fetchFactions();
    } catch (error: any) {
      console.error('[FactionManager] Error saving faction:', error);
      toast.error(`Failed to save faction: ${error.message}`);
    }
  };

  const handleInputChange = (field: keyof Faction, value: string) => {
    setNewFaction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTranslateFaction = async () => {
    if (!newFaction.name) {
      toast.error('Please enter the faction name in English first');
      return;
    }
    
    setIsTranslating(true);
    try {
      if (activeTranslationTab === 'es') {
        const result = await batchTranslate([newFaction.name], 'es') as string[];
        if (result && result.length > 0) {
          setNewFaction(prev => ({
            ...prev,
            name_es: result[0]
          }));
        }
      } else if (activeTranslationTab === 'fr') {
        const result = await batchTranslate([newFaction.name], 'fr') as string[];
        if (result && result.length > 0) {
          setNewFaction(prev => ({
            ...prev,
            name_fr: result[0]
          }));
        }
      }
      toast.success('Translation completed');
    } catch (error: any) {
      console.error('[FactionManager] Error translating faction name:', error);
      toast.error(`Translation failed: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-lg font-semibold text-warcrow-gold">Faction Management</h2>
          <div className="flex gap-2">
            <Button
              onClick={fetchFactions}
              variant="outline"
              disabled={isLoading}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-warcrow-gold/70 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
            <Button
              onClick={handleAddNewFaction}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Faction
            </Button>
          </div>
        </div>

        {fetchError && (
          <div className="bg-red-900/20 border border-red-700/30 p-4 rounded-md mb-4 text-red-300">
            <p>{fetchError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchFactions}
              className="mt-2 bg-red-900/20 border-red-700/30 text-red-300 hover:bg-red-900/40"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Try Again
            </Button>
          </div>
        )}

        <div className="rounded border border-warcrow-gold/30 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
                <TableHead className="text-warcrow-gold">Faction ID</TableHead>
                <TableHead className="text-warcrow-gold">Name (English)</TableHead>
                <TableHead className="text-warcrow-gold">Name (Spanish)</TableHead>
                <TableHead className="text-warcrow-gold">Name (French)</TableHead>
                <TableHead className="text-warcrow-gold">Units</TableHead>
                <TableHead className="text-warcrow-gold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-warcrow-text/70">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 mb-2 border-2 border-warcrow-gold/70 border-t-transparent rounded-full animate-spin" />
                      Loading factions...
                    </div>
                  </TableCell>
                </TableRow>
              ) : factions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-warcrow-text/70">
                    <p className="mb-2">No factions found</p>
                    <Button
                      onClick={handleAddNewFaction}
                      size="sm"
                      className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Your First Faction
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                factions.map((faction) => (
                  <TableRow key={faction.id} className="hover:bg-warcrow-accent/5">
                    <TableCell>{faction.id}</TableCell>
                    <TableCell className="font-medium">{faction.name}</TableCell>
                    <TableCell>{faction.name_es || '-'}</TableCell>
                    <TableCell>{faction.name_fr || '-'}</TableCell>
                    <TableCell>{unitCountByFaction[faction.id] || 0}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditFaction(faction)}
                          className="h-8 w-8 p-0 text-warcrow-gold hover:text-warcrow-gold/80"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFaction(faction.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                          disabled={unitCountByFaction[faction.id] > 0}
                          title={unitCountByFaction[faction.id] > 0 ? 
                            "Cannot delete faction with units. Delete all units first." : 
                            "Delete faction"}
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
      </div>

      {/* Add/Edit Faction Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-warcrow-accent border-warcrow-gold/30 text-warcrow-text max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">
              {editingFaction ? 'Edit Faction' : 'Add New Faction'}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTranslationTab} onValueChange={setActiveTranslationTab} className="w-full mt-2">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="en" className="text-sm">English</TabsTrigger>
              <TabsTrigger value="es" className="text-sm">Español</TabsTrigger>
              <TabsTrigger value="fr" className="text-sm">Français</TabsTrigger>
            </TabsList>
            
            {/* English Content */}
            <TabsContent value="en" className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-warcrow-text/80 block">Faction ID</label>
                  <Input
                    value={newFaction.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                    placeholder="e.g., new-faction-name"
                    disabled={!!editingFaction}
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                  <p className="text-xs text-warcrow-text/60">
                    Use kebab-case format (lowercase with hyphens). This ID will be used in URLs and data references.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-warcrow-text/80 block">Faction Name (English)</label>
                  <Input
                    value={newFaction.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., New Faction"
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Spanish Content */}
            <TabsContent value="es" className="space-y-4">
              <div className="flex justify-end mb-2">
                <Button 
                  variant="outline" 
                  onClick={handleTranslateFaction}
                  disabled={isTranslating || !newFaction.name}
                  className="border-warcrow-gold/30 text-warcrow-gold"
                >
                  {isTranslating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-warcrow-gold/70 border-t-transparent rounded-full animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="h-4 w-4 mr-2" />
                      Translate to Spanish
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-warcrow-text/80 block">Faction Name (Spanish)</label>
                <Input
                  value={newFaction.name_es || ''}
                  onChange={(e) => handleInputChange('name_es', e.target.value)}
                  placeholder="Spanish name"
                  className="bg-black/60 border-warcrow-gold/30"
                />
              </div>
              
              {newFaction.name && (
                <div className="p-3 bg-black/30 border border-warcrow-gold/20 rounded-md mt-4">
                  <h4 className="text-sm font-medium text-warcrow-gold mb-2">English Reference</h4>
                  <p className="text-sm text-warcrow-text/80">{newFaction.name}</p>
                </div>
              )}
            </TabsContent>
            
            {/* French Content */}
            <TabsContent value="fr" className="space-y-4">
              <div className="flex justify-end mb-2">
                <Button 
                  variant="outline" 
                  onClick={handleTranslateFaction}
                  disabled={isTranslating || !newFaction.name}
                  className="border-warcrow-gold/30 text-warcrow-gold"
                >
                  {isTranslating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-warcrow-gold/70 border-t-transparent rounded-full animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Languages className="h-4 w-4 mr-2" />
                      Translate to French
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-warcrow-text/80 block">Faction Name (French)</label>
                <Input
                  value={newFaction.name_fr || ''}
                  onChange={(e) => handleInputChange('name_fr', e.target.value)}
                  placeholder="French name"
                  className="bg-black/60 border-warcrow-gold/30"
                />
              </div>
              
              {newFaction.name && (
                <div className="p-3 bg-black/30 border border-warcrow-gold/20 rounded-md mt-4">
                  <h4 className="text-sm font-medium text-warcrow-gold mb-2">English Reference</h4>
                  <p className="text-sm text-warcrow-text/80">{newFaction.name}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="border-warcrow-gold/30 text-warcrow-text"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSaveFaction}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingFaction ? 'Update Faction' : 'Add Faction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-warcrow-accent border-warcrow-gold/30 text-warcrow-text">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-gold">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this faction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-warcrow-gold/30 text-warcrow-text">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFaction}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default FactionManager;
