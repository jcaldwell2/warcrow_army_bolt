
import React, { useState, useEffect } from "react";
import { getAllExtendedUnits } from "@/services/extendedUnitService";
import UnitStatCard from "@/components/stats/UnitStatCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExtendedUnit } from "@/types/extendedUnit";
import { UnitStatsHeader } from "@/components/stats/UnitStatsHeader";
import { Loader2 } from "lucide-react";

const UnitStats = () => {
  const [allUnits, setAllUnits] = useState<ExtendedUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<ExtendedUnit | null>(null);
  const [showSymbolBg, setShowSymbolBg] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Common background color for all symbols
  const symbolBgColor = "rgba(40, 40, 40, 0.7)";

  // Fetch units data when component mounts
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setIsLoading(true);
        const units = await getAllExtendedUnits();
        setAllUnits(units);
        
        // Set the first unit as selected if available
        if (units.length > 0) {
          setSelectedUnit(units[0]);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading units:", err);
        setError("Failed to load unit data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnits();
  }, []);

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <UnitStatsHeader />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            className="bg-black/60 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10 hover:text-warcrow-gold"
            onClick={() => setShowSymbolBg(!showSymbolBg)}
          >
            {showSymbolBg ? "Hide Symbol Backgrounds" : "Show Symbol Backgrounds"}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold" />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-8 text-center">
            <p className="text-red-400">{error}</p>
            <Button 
              className="mt-4 bg-red-900/50 hover:bg-red-900/70"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Unit Selection Column */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-black/40 rounded-lg p-4 border border-warcrow-gold/30">
                <h2 className="text-xl font-bold text-warcrow-gold mb-4">Select Unit</h2>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-2 pr-4">
                    {allUnits.map((unit) => (
                      <Button
                        key={unit.id}
                        variant="outline"
                        className={`w-full justify-start ${
                          selectedUnit?.id === unit.id 
                            ? "bg-warcrow-gold/20 border-warcrow-gold text-warcrow-gold" 
                            : "bg-black/60 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10 hover:text-warcrow-gold"
                        }`}
                        onClick={() => setSelectedUnit(unit)}
                      >
                        {unit.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Unit Stat Card Column */}
            <div className="md:col-span-2">
              {selectedUnit ? (
                <UnitStatCard unit={selectedUnit} showSymbolBg={showSymbolBg} symbolBgColor={symbolBgColor} />
              ) : (
                <div className="bg-black/40 rounded-lg p-8 border border-warcrow-gold/30 text-center">
                  <p className="text-warcrow-gold">Select a unit to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitStats;
