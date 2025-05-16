
import React, { useState, useEffect } from 'react';
import { useTranslateKeyword } from '@/utils/translation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UnitTable } from '@/components/stats/unit-explorer/UnitTable';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, RefreshCw, Database, RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { findMissingUnits, generateFactionFileContent } from '@/utils/unitSyncUtility';
import UnitSyncChecker from './UnitSyncChecker';

const UnitDataTable = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [factionFilter, setFactionFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [factions, setFactions] = useState<{id: string, name: string}[]>([]);
  const [showAddUnitDialog, setShowAddUnitDialog] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<any>(null);
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [selectedFactionForSync, setSelectedFactionForSync] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [isLoadingFactions, setIsLoadingFactions] = useState(false);

  // New unit form state
  const [unitName, setUnitName] = useState('');
  const [unitId, setUnitId] = useState('');
  const [unitFaction, setUnitFaction] = useState('');
  const [unitType, setUnitType] = useState('unit');
  const [unitPoints, setUnitPoints] = useState('0');
  const [unitKeywords, setUnitKeywords] = useState('');
  const [unitSpecialRules, setUnitSpecialRules] = useState('');
  const [unitAvailability, setUnitAvailability] = useState('1');
  const [unitCommand, setUnitCommand] = useState('0');
  const [unitHighCommand, setUnitHighCommand] = useState(false);
  const [unitDescription, setUnitDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load units from Supabase
  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('unit_data')
        .select('*')
        .order('faction')
        .order('name');
      
      if (error) throw error;
      
      setUnits(data || []);
      setFilteredUnits(data || []);
    } catch (err) {
      console.error('Error fetching units:', err);
      toast.error('Failed to load units');
    } finally {
      setIsLoading(false);
    }
  };

  // Load factions for filtering and adding new units
  const fetchFactions = async () => {
    setIsLoadingFactions(true);
    try {
      const { data, error } = await supabase
        .from('factions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log('Fetched factions for unit management:', data);
        setFactions(data);
      } else {
        console.log('No factions found in database');
        toast.error('No factions found. Please add factions first.');
      }
    } catch (err) {
      console.error('Error fetching factions:', err);
      toast.error('Failed to fetch factions');
    } finally {
      setIsLoadingFactions(false);
    }
  };

  useEffect(() => {
    fetchUnits();
    fetchFactions();
  }, []);

  // Filter units based on search and faction
  useEffect(() => {
    if (units.length > 0) {
      let filtered = [...units];
      
      // Apply search filter
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        filtered = filtered.filter(unit => 
          unit.name?.toLowerCase().includes(search) ||
          unit.id?.toLowerCase().includes(search) ||
          unit.keywords?.some((k: string) => k.toLowerCase().includes(search))
        );
      }
      
      // Apply faction filter
      if (factionFilter !== 'all') {
        filtered = filtered.filter(unit => unit.faction === factionFilter);
      }
      
      setFilteredUnits(filtered);
    }
  }, [searchQuery, factionFilter, units]);

  // Generate a kebab-case ID from unit name
  const generateUnitId = (name: string): string => {
    return name.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  // Handle unit name change and auto-generate ID
  const handleNameChange = (value: string) => {
    setUnitName(value);
    if (!unitId || unitId === generateUnitId(value.replace(/\s+/g, '-'))) {
      setUnitId(generateUnitId(value));
    }
  };

  // Add new unit to Supabase
  const handleAddUnit = async () => {
    setIsSubmitting(true);
    
    try {
      // Parse and validate inputs
      const keywords = unitKeywords.split(',').map(k => k.trim()).filter(Boolean);
      const specialRules = unitSpecialRules.split(',').map(r => r.trim()).filter(Boolean);
      const points = parseInt(unitPoints) || 0;
      const availability = parseInt(unitAvailability) || 1;
      const command = parseInt(unitCommand) || 0;

      // Validate required fields
      if (!unitName || !unitId || !unitFaction) {
        throw new Error('Name, ID and faction are required');
      }
      
      // Create unit object with required description field
      const newUnit = {
        id: unitId,
        name: unitName,
        faction: unitFaction,
        type: unitType,
        points: points,
        keywords: keywords,
        special_rules: specialRules,
        description: unitDescription || ' ', // Add required description field with default value
        characteristics: {
          availability,
          command,
          highCommand: unitHighCommand
        }
      };
      
      // Insert to Supabase
      const { error } = await supabase
        .from('unit_data')
        .insert(newUnit);
      
      if (error) throw error;
      
      toast.success(`Unit "${unitName}" added successfully`);
      setShowAddUnitDialog(false);
      resetForm();
      fetchUnits(); // Refresh the unit list
    } catch (err: any) {
      console.error('Error adding unit:', err);
      toast.error(`Failed to add unit: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset add unit form
  const resetForm = () => {
    setUnitName('');
    setUnitId('');
    setUnitFaction('');
    setUnitType('unit');
    setUnitPoints('0');
    setUnitKeywords('');
    setUnitSpecialRules('');
    setUnitAvailability('1');
    setUnitCommand('0');
    setUnitHighCommand(false);
    setUnitDescription('');
    setIsSubmitting(false);
  };

  // Handle sync with local files
  const handleLocalFileSync = async (factionId: string) => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const syncData = await findMissingUnits(factionId);
      setSyncResult(syncData);
      
      if (syncData.onlyInDatabase.length === 0 && syncData.onlyInLocalData.length === 0) {
        toast.success(`All units for ${factionId} are in sync!`);
      } else {
        toast.info(`Found differences for ${factionId}. Review the results.`);
      }
    } catch (error: any) {
      console.error('Error syncing local files:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Generate files for a selected faction
  const handleGenerateFiles = async () => {
    if (!selectedFactionForSync) return;
    
    setIsSyncing(true);
    try {
      const files = await generateFactionFileContent(selectedFactionForSync);
      setSyncStats(files);
      toast.success(`Generated files for ${selectedFactionForSync}`);
    } catch (error: any) {
      console.error('Error generating files:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-black border-warcrow-gold/30">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search units by name, id, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-warcrow-accent/50 border-warcrow-gold/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={factionFilter} onValueChange={setFactionFilter}>
              <SelectTrigger className="w-[200px] bg-warcrow-accent/50 border-warcrow-gold/30">
                <SelectValue placeholder="All Factions" />
              </SelectTrigger>
              <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                <SelectItem value="all">All Factions</SelectItem>
                {factions.map((faction) => (
                  <SelectItem key={faction.id} value={faction.id}>
                    {faction.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={showAddUnitDialog} onOpenChange={setShowAddUnitDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Unit
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-warcrow-gold/30">
                <DialogHeader>
                  <DialogTitle className="text-warcrow-gold">Add New Unit</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitName">Unit Name</Label>
                    <Input 
                      id="unitName" 
                      value={unitName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Unit Name"
                      className="bg-warcrow-accent/50 border-warcrow-gold/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitId">Unit ID</Label>
                    <Input 
                      id="unitId" 
                      value={unitId}
                      onChange={(e) => setUnitId(e.target.value)}
                      placeholder="unit-id"
                      className="bg-warcrow-accent/50 border-warcrow-gold/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitFaction">Faction</Label>
                    <Select value={unitFaction} onValueChange={setUnitFaction}>
                      <SelectTrigger className="bg-warcrow-accent/50 border-warcrow-gold/30">
                        <SelectValue placeholder="Select Faction" />
                      </SelectTrigger>
                      <SelectContent className="bg-warcrow-accent border-warcrow-gold/30 max-h-[200px] overflow-y-auto">
                        {isLoadingFactions ? (
                          <SelectItem value="loading" disabled>Loading factions...</SelectItem>
                        ) : factions.length > 0 ? (
                          factions.map((faction) => (
                            <SelectItem key={faction.id} value={faction.id}>
                              {faction.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>No factions found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitType">Type</Label>
                    <Select value={unitType} onValueChange={setUnitType}>
                      <SelectTrigger className="bg-warcrow-accent/50 border-warcrow-gold/30">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="character">Character</SelectItem>
                        <SelectItem value="companion">Companion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPoints">Points</Label>
                    <Input 
                      id="unitPoints" 
                      type="number"
                      value={unitPoints}
                      onChange={(e) => setUnitPoints(e.target.value)}
                      className="bg-warcrow-accent/50 border-warcrow-gold/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitAvailability">Availability</Label>
                    <Input 
                      id="unitAvailability" 
                      type="number"
                      value={unitAvailability}
                      onChange={(e) => setUnitAvailability(e.target.value)}
                      className="bg-warcrow-accent/50 border-warcrow-gold/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitCommand">Command Value</Label>
                    <Input 
                      id="unitCommand" 
                      type="number"
                      value={unitCommand}
                      onChange={(e) => setUnitCommand(e.target.value)}
                      className="bg-warcrow-accent/50 border-warcrow-gold/30"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-7">
                    <Checkbox 
                      id="unitHighCommand"
                      checked={unitHighCommand}
                      onCheckedChange={(checked) => setUnitHighCommand(checked === true)}
                    />
                    <Label htmlFor="unitHighCommand">High Command</Label>
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="unitKeywords">Keywords (comma separated)</Label>
                    <Textarea 
                      id="unitKeywords" 
                      value={unitKeywords}
                      onChange={(e) => setUnitKeywords(e.target.value)}
                      placeholder="Infantry, Elf, Fearless, etc."
                      className="bg-warcrow-accent/50 border-warcrow-gold/30"
                    />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="unitSpecialRules">Special Rules (comma separated)</Label>
                    <Textarea 
                      id="unitSpecialRules" 
                      value={unitSpecialRules}
                      onChange={(e) => setUnitSpecialRules(e.target.value)}
                      placeholder="Vulnerable, Frightened, Slowed, etc."
                      className="bg-warcrow-accent/50 border-warcrow-gold/30"
                    />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="unitDescription">Description</Label>
                    <Textarea 
                      id="unitDescription" 
                      value={unitDescription}
                      onChange={(e) => setUnitDescription(e.target.value)}
                      placeholder="Unit description (optional)"
                      className="bg-warcrow-accent/50 border-warcrow-gold/30"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="mt-4 border-warcrow-gold/30">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleAddUnit}
                    disabled={isSubmitting}
                    className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Unit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10">
                  <RotateCw className="w-4 h-4 mr-2" />
                  Sync Files
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-warcrow-gold/30 max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-warcrow-gold">Data Synchronization</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <Alert className="bg-black/50 border-amber-500/50">
                    <AlertDescription className="text-sm text-amber-300">
                      Use this tool to check for differences between database units and local unit data files,
                      or generate new files for a faction based on database data.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="w-full md:w-64">
                      <Select value={selectedFactionForSync || ''} onValueChange={setSelectedFactionForSync}>
                        <SelectTrigger className="bg-warcrow-accent/50 border-warcrow-gold/30 w-full">
                          <SelectValue placeholder="Select Faction" />
                        </SelectTrigger>
                        <SelectContent className="bg-warcrow-accent border-warcrow-gold/30 max-h-[200px] overflow-y-auto">
                          {isLoadingFactions ? (
                            <SelectItem value="loading" disabled>Loading factions...</SelectItem>
                          ) : factions.length > 0 ? (
                            factions.map((faction) => (
                              <SelectItem key={faction.id} value={faction.id}>
                                {faction.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No factions found</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        disabled={!selectedFactionForSync || isSyncing}
                        onClick={() => handleLocalFileSync(selectedFactionForSync!)}
                        className="border-warcrow-gold/30 text-warcrow-text"
                      >
                        {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Check Differences
                      </Button>
                      
                      <Button
                        variant="outline"
                        disabled={!selectedFactionForSync || isSyncing}
                        onClick={handleGenerateFiles}
                        className="border-warcrow-gold/30 text-warcrow-gold"
                      >
                        {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                        Generate Files
                      </Button>
                    </div>
                  </div>
                  
                  {// ... keep existing code (syncResult and syncStats rendering)
                  }
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={() => {
                fetchUnits();
                fetchFactions();
              }} 
              className="border-warcrow-gold/30 text-warcrow-text hover:bg-black/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <UnitTable 
          filteredUnits={filteredUnits}
          t={(key) => key} // Simple translation function
          isLoading={isLoading}
        />

        <div className="mt-4 text-sm text-right text-warcrow-muted">
          Showing {filteredUnits.length} of {units.length} units
        </div>
      </Card>
      
      <UnitSyncChecker />
    </div>
  );
};

export default UnitDataTable;
