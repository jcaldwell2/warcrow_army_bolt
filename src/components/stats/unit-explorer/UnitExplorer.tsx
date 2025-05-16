
import React, { useState } from 'react';
import { useUnitData, useFactions } from './useUnitData';
import { UnitFilters } from './UnitFilters';
import UnitList from './UnitList';
import { UnitTable } from './UnitTable';
import UnitStatCard from '../UnitStatCard';
import { ExtendedUnit } from '@/types/extendedUnit';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, Grid } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TranslationPanel from './TranslationPanel';
import UnitTranslationStatus from './UnitTranslationStatus';
import { ApiUnit } from '@/types/army';

const UnitExplorer: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedUnit, setSelectedUnit] = useState<ExtendedUnit | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [selectedFaction, setSelectedFaction] = useState<string | 'all'>('all');
  const [showSymbolBg, setShowSymbolBg] = useState<boolean>(true);
  const [symbolBgColor, setSymbolBgColor] = useState<string>('#1a1a1a');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showHidden, setShowHidden] = useState<boolean>(false);
  
  // Get units data
  const { 
    data: units = [], 
    isLoading: isLoadingUnits, 
    error,
    refetch: refetchUnits
  } = useUnitData(selectedFaction);

  // Get factions separately
  const { 
    data: factions = [], 
    isLoading: isLoadingFactions,
    refetch: refetchFactions
  } = useFactions(language);
  
  // Calculate translation statistics
  const translationStats = React.useMemo(() => {
    if (!units || units.length === 0) return { total: 0, spanishTranslated: 0, frenchTranslated: 0 };
    
    return {
      total: units.length,
      spanishTranslated: units.filter(unit => unit.name_es && unit.name_es.trim() !== '').length,
      frenchTranslated: units.filter(unit => unit.name_fr && unit.name_fr.trim() !== '').length,
    };
  }, [units]);
  
  // Handle refreshing factions
  const handleRefreshFactions = async () => {
    return refetchFactions();
  };

  // Handle translation completion
  const handleTranslationComplete = () => {
    // Refresh the unit data
    refetchUnits();
  };

  // Handle selecting a unit
  const handleSelectUnit = (unit: ExtendedUnit) => {
    console.log("Selected unit:", unit);
    setSelectedUnit(unit);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold">Unit Explorer</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode('list')} 
            className={viewMode === 'list' ? 'bg-warcrow-gold text-black' : ''}
          >
            <Grid size={16} className="mr-1" /> List
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode('table')} 
            className={viewMode === 'table' ? 'bg-warcrow-gold text-black' : ''}
          >
            <Table size={16} className="mr-1" /> Table
          </Button>
        </div>
      </div>

      <UnitFilters 
        selectedFaction={selectedFaction} 
        onFactionChange={setSelectedFaction}
        factions={factions}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        t={t}
        showHidden={showHidden}
        onShowHiddenChange={setShowHidden}
        isLoadingFactions={isLoadingFactions}
        onRefreshFactions={handleRefreshFactions}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={viewMode === 'list' ? 'md:col-span-1' : 'md:col-span-3'}>
          {viewMode === 'list' && (
            <Card className="bg-warcrow-background border-warcrow-gold/30">
              <CardContent className="p-2">
                <UnitList 
                  units={units}
                  searchQuery={searchQuery}
                  isLoading={isLoadingUnits}
                  error={error}
                  onSelectUnit={handleSelectUnit}
                />
              </CardContent>
            </Card>
          )}
          
          {viewMode === 'table' && (
            <Card className="bg-warcrow-background border-warcrow-gold/30">
              <CardContent className="p-2">
                <UnitTable 
                  filteredUnits={units}
                  t={t}
                  isLoading={isLoadingUnits}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        {viewMode === 'list' && selectedUnit && (
          <div className="md:col-span-2 space-y-4">
            <UnitStatCard 
              unit={selectedUnit}
              showSymbolBg={showSymbolBg}
              symbolBgColor={symbolBgColor}
            />
            
            <Card className="bg-warcrow-background border-warcrow-gold/30">
              <CardContent className="p-4">
                <UnitTranslationStatus 
                  stats={translationStats}
                  onTranslate={handleTranslationComplete}
                />
              </CardContent>
            </Card>
            
            <TranslationPanel 
              units={units as ApiUnit[]}
              onTranslationComplete={handleTranslationComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitExplorer;
