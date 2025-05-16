import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Database, RefreshCw, Loader2 } from 'lucide-react';
import { findMissingUnits, generateFactionFileContent } from '@/utils/unitSyncUtility';
import { useFactions } from '@/components/stats/unit-explorer/useUnitData';

const UnitSyncChecker: React.FC = () => {
  const [factionId, setFactionId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<any>(null);
  
  // Use our consolidated factions hook
  const { 
    data: factions = [],
    isLoading: isLoadingFactions,
    refetch: refetchFactions
  } = useFactions();

  // Create the file contents for the selected faction
  const handleCreateFiles = async () => {
    if (!factionId) {
      toast.error('Please select a faction first');
      return;
    }
    
    setIsSyncing(true);
    setSyncResults(null);
    
    try {
      // First check for missing units
      const syncData = await findMissingUnits(factionId);
      
      // Generate file content
      const files = await generateFactionFileContent(factionId);
      
      setSyncResults({
        syncData,
        files
      });
      
      toast.success(`Successfully generated files for ${factionId}`);
    } catch (error: any) {
      console.error('Error generating files:', error);
      toast.error(`Failed to generate files: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRefreshFactions = () => {
    toast.promise(refetchFactions(), {
      loading: 'Refreshing factions...',
      success: 'Factions refreshed',
      error: 'Failed to refresh factions'
    });
  };

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-warcrow-gold flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database to Local Files Synchronization
        </h2>
        
        <p className="text-sm text-warcrow-text/80">
          This utility allows you to generate TypeScript files with unit data from the database. 
          Select a faction and click "Generate Files" to create the necessary files.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Select value={factionId || ''} onValueChange={setFactionId}>
              <SelectTrigger className="w-[250px] bg-warcrow-accent/50 border-warcrow-gold/30">
                <SelectValue placeholder="Select Faction">
                  {isLoadingFactions ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading factions...
                    </div>
                  ) : (
                    factionId ? 
                      factions.find(f => f.id === factionId)?.name || "Select Faction" : 
                      "Select Faction"
                  )}
                </SelectValue>
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
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefreshFactions}
              disabled={isLoadingFactions}
              className="border-warcrow-gold/30 text-warcrow-text hover:bg-black/50"
              title="Refresh faction list"
            >
              {isLoadingFactions ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
          
          <Button
            onClick={handleCreateFiles}
            disabled={!factionId || isSyncing}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          >
            {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Generate Local Files
          </Button>
        </div>

        {syncResults && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-warcrow-gold text-sm font-medium mb-2">Main File</h3>
                <div className="bg-black/50 border border-warcrow-gold/20 rounded-md p-3 h-[150px] overflow-y-auto">
                  <pre className="text-xs text-warcrow-text/70 whitespace-pre-wrap">
                    {syncResults.files.mainFile}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-warcrow-gold text-sm font-medium mb-2">Troops</h3>
                <div className="bg-black/50 border border-warcrow-gold/20 rounded-md p-3 h-[150px] overflow-y-auto">
                  <pre className="text-xs text-warcrow-text/70 whitespace-pre-wrap">
                    {syncResults.files.troopsFile}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-warcrow-gold text-sm font-medium mb-2">Characters</h3>
                <div className="bg-black/50 border border-warcrow-gold/20 rounded-md p-3 h-[150px] overflow-y-auto">
                  <pre className="text-xs text-warcrow-text/70 whitespace-pre-wrap">
                    {syncResults.files.charactersFile}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-warcrow-gold text-sm font-medium mb-2">High Command</h3>
                <div className="bg-black/50 border border-warcrow-gold/20 rounded-md p-3 h-[150px] overflow-y-auto">
                  <pre className="text-xs text-warcrow-text/70 whitespace-pre-wrap">
                    {syncResults.files.highCommandFile}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-3 bg-black/30 border border-warcrow-gold/20 rounded">
              <h3 className="text-warcrow-gold text-sm font-medium mb-2">Synchronization Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-warcrow-text mb-1">Units only in database: {syncResults.syncData.onlyInDatabase.length}</p>
                  <div className="bg-black/30 p-2 rounded max-h-[100px] overflow-y-auto">
                    {syncResults.syncData.onlyInDatabase.length === 0 ? (
                      <p className="text-xs text-warcrow-text/50">None</p>
                    ) : (
                      <ul className="text-xs text-warcrow-text/70">
                        {syncResults.syncData.onlyInDatabase.map((unit: any) => (
                          <li key={unit.id}>{unit.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-warcrow-text mb-1">Units only in local data: {syncResults.syncData.onlyInLocalData.length}</p>
                  <div className="bg-black/30 p-2 rounded max-h-[100px] overflow-y-auto">
                    {syncResults.syncData.onlyInLocalData.length === 0 ? (
                      <p className="text-xs text-warcrow-text/50">None</p>
                    ) : (
                      <ul className="text-xs text-warcrow-text/70">
                        {syncResults.syncData.onlyInLocalData.map((unit: any) => (
                          <li key={unit.id}>{unit.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-amber-400/90">
              To update your local files, copy the content from each section and replace the corresponding files in your project.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UnitSyncChecker;
