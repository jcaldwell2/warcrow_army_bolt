
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useFactions } from "@/components/stats/unit-explorer/useUnitData";
import { factions as fallbackFactions } from "@/data/factions";

interface FactionSelectorProps {
  selectedFaction: string;
  onFactionChange: (faction: string) => void;
}

const FactionSelector = ({ selectedFaction, onFactionChange }: FactionSelectorProps) => {
  const { language } = useLanguage();
  const { 
    data: availableFactions = [], 
    isLoading, 
    isError, 
    refetch,
    isFetching
  } = useFactions(language);
  
  const [hasFallbackNotified, setHasFallbackNotified] = useState(false);
  
  // Use fallback factions if needed
  const displayFactions = availableFactions.length > 0 
    ? availableFactions 
    : fallbackFactions;
  
  const handleRefetch = () => {
    toast.promise(refetch(), {
      loading: 'Refreshing factions...',
      success: 'Factions refreshed successfully',
      error: 'Failed to refresh factions'
    });
  };
  
  useEffect(() => {
    // Only show the fallback notification once
    if (availableFactions.length === 0 && !isLoading && !isError && !isFetching && !hasFallbackNotified) {
      toast.info('Using default factions. No factions found in database.', {
        duration: 5000,
        id: 'faction-fallback-notice' // Prevent duplicate toasts
      });
      setHasFallbackNotified(true);
    }
  }, [availableFactions, isLoading, isError, isFetching, hasFallbackNotified]);
  
  return (
    <div className="w-full max-w-xs mb-4 md:mb-8">
      <div className="flex space-x-2 mb-2 items-center">
        <Select value={selectedFaction} onValueChange={onFactionChange}>
          <SelectTrigger className="w-full bg-warcrow-accent text-warcrow-text border-warcrow-gold">
            <SelectValue placeholder="Select a faction">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {selectedFaction ? displayFactions.find(f => f.id === selectedFaction)?.name || "Select a faction" : "Select a faction"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-warcrow-accent border-warcrow-gold max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <SelectItem value="loading" disabled className="text-warcrow-text/50">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading factions...
                </div>
              </SelectItem>
            ) : isError ? (
              <SelectItem value="error" disabled className="text-red-400">
                Error loading factions
              </SelectItem>
            ) : displayFactions.length > 0 ? (
              displayFactions.map((faction) => (
                <SelectItem
                  key={faction.id}
                  value={faction.id}
                  className="text-warcrow-text hover:bg-warcrow-gold hover:text-warcrow-background cursor-pointer"
                >
                  {faction.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled className="text-warcrow-text/50">
                No factions available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleRefetch}
          disabled={isLoading || isFetching}
          className="text-warcrow-text hover:text-warcrow-gold"
          title="Refresh factions"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading || isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default FactionSelector;
