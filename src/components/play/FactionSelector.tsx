
import React, { useEffect } from 'react';
import { Check, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Faction } from '@/types/army';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFactions } from '@/components/stats/unit-explorer/useUnitData';
import { toast } from 'sonner';

interface NationSelectorProps {
  selectedFaction: Faction | null;
  onSelectFaction: (faction: Faction) => void;
  selectedFactionId?: string;
  onFactionSelect?: (factionId: string, factionName: string) => void;
}

const FactionSelector: React.FC<NationSelectorProps> = ({ 
  selectedFaction, 
  onSelectFaction,
  selectedFactionId,
  onFactionSelect
}) => {
  const { language } = useLanguage();
  const { 
    data: nations = [], 
    isLoading, 
    isError, 
    refetch 
  } = useFactions(language);

  useEffect(() => {
    if (nations.length === 0 && !isLoading && !isError) {
      toast.info('Using default factions. No factions found in database.', {
        duration: 5000,
        id: 'faction-fallback-notice' // Prevent duplicate toasts
      });
    }
  }, [nations, isLoading, isError]);

  // Handle click based on which prop API is being used
  const handleFactionClick = (faction: Faction) => {
    if (onSelectFaction) {
      onSelectFaction(faction);
    } else if (onFactionSelect) {
      onFactionSelect(faction.id, faction.name);
    }
  };

  const handleRefetch = () => {
    toast.promise(refetch(), {
      loading: 'Refreshing factions...',
      success: 'Factions refreshed successfully',
      error: 'Failed to refresh factions'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="w-6 h-6 border-2 border-warcrow-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-700/30 rounded-md text-center">
        <p className="text-red-400 mb-2">Error loading factions</p>
        <button 
          onClick={handleRefetch}
          className="px-3 py-1 bg-red-900/40 hover:bg-red-800/40 text-red-300 rounded-md flex items-center mx-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 w-full"
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {nations.map((faction) => (
          <motion.div
            key={faction.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFactionClick(faction)}
            className={cn(
              "neo-card p-4 flex items-center justify-between cursor-pointer",
              (selectedFaction?.id === faction.id || selectedFactionId === faction.id) 
                ? "ring-2 ring-warcrow-gold/50" 
                : "hover:bg-warcrow-accent/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warcrow-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-warcrow-gold" />
              </div>
              <span className="font-medium text-warcrow-text">{faction.name}</span>
            </div>
            {(selectedFaction?.id === faction.id || selectedFactionId === faction.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 bg-warcrow-gold rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-warcrow-background" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end">
        <button 
          onClick={handleRefetch}
          className="flex items-center text-sm text-warcrow-gold/70 hover:text-warcrow-gold px-2 py-1"
        >
          <RefreshCw className="h-3 w-3 mr-1" /> Refresh factions
        </button>
      </div>
    </motion.div>
  );
};

export default FactionSelector;
