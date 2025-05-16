
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Faction } from "@/types/army";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UnitFiltersProps {
  factions: Faction[];
  selectedFaction: string;
  onFactionChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
  showHidden: boolean;
  onShowHiddenChange: (value: boolean) => void;
  isLoadingFactions?: boolean;
  onRefreshFactions?: () => Promise<any>;
}

export const UnitFilters: React.FC<UnitFiltersProps> = ({
  factions,
  selectedFaction,
  onFactionChange,
  searchQuery,
  onSearchChange,
  t,
  showHidden,
  onShowHiddenChange,
  isLoadingFactions = false,
  onRefreshFactions
}) => {
  const handleRefreshFactions = () => {
    if (onRefreshFactions) {
      toast.promise(onRefreshFactions(), {
        loading: 'Refreshing factions...',
        success: 'Factions refreshed',
        error: 'Failed to refresh factions'
      });
    }
  };

  useEffect(() => {
    if (factions.length === 0 && !isLoadingFactions) {
      toast.info('Using default factions. No factions found in database.', {
        duration: 5000,
        id: 'faction-filter-notice' // Prevent duplicate toasts
      });
    }
  }, [factions, isLoadingFactions]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warcrow-gold/70 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchUnits')}
            value={searchQuery}
            onChange={onSearchChange}
            className="pl-10 bg-warcrow-accent/50 border-warcrow-gold/30 text-warcrow-text placeholder:text-warcrow-muted/70"
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={selectedFaction}
            onValueChange={onFactionChange}
          >
            <SelectTrigger className="bg-warcrow-accent/50 border-warcrow-gold/30 text-warcrow-text flex-1">
              <SelectValue placeholder={t('selectFaction')}>
                {isLoadingFactions ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    {t('loading')}
                  </div>
                ) : (
                  factions.find(f => f.id === selectedFaction)?.name || t('selectFaction')
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-warcrow-background border-warcrow-gold/30 max-h-72 overflow-y-auto z-50">
              <SelectItem value="all" className="text-warcrow-text hover:bg-warcrow-gold/10">
                {t('allFactions')}
              </SelectItem>
              {isLoadingFactions ? (
                <div className="flex justify-center items-center py-2">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  {t('loading')}
                </div>
              ) : factions.length > 0 ? (
                factions.map(faction => (
                  <SelectItem 
                    key={faction.id} 
                    value={faction.id}
                    className="text-warcrow-text hover:bg-warcrow-gold/10"
                  >
                    {faction.name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1 text-sm text-warcrow-gold/70">
                  {t('noFactionsFound')}
                </div>
              )}
            </SelectContent>
          </Select>
          
          {onRefreshFactions && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefreshFactions}
              disabled={isLoadingFactions}
              className="text-warcrow-text hover:text-warcrow-gold"
              title={t('refreshFactions')}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingFactions ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="show-hidden" 
            checked={showHidden}
            onCheckedChange={onShowHiddenChange}
            className="data-[state=checked]:bg-warcrow-gold"
          />
          <Label htmlFor="show-hidden" className="text-warcrow-text cursor-pointer">
            {t('showHiddenUnits')}
          </Label>
        </div>
      </div>
    </div>
  );
};
