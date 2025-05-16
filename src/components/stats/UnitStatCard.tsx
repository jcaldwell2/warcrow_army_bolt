
import React from 'react';
import { ExtendedUnit } from '@/types/extendedUnit';
import { GameSymbol } from './GameSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from '@/utils/translationUtils';

interface UnitStatCardProps {
  unit: ExtendedUnit;
  showSymbolBg: boolean;
  symbolBgColor: string;
}

const UnitStatCard: React.FC<UnitStatCardProps> = ({ 
  unit, 
  showSymbolBg,
  symbolBgColor
}) => {
  const { language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  
  // Get translated unit name
  const displayName = translateUnitName(unit.name, language);

  // Helper function to render a stat row
  const renderStatRow = (label: string, value: React.ReactNode) => (
    <div className="grid grid-cols-2 py-2 border-b border-warcrow-gold/30 last:border-b-0">
      <div className="font-medium text-warcrow-gold">{label}</div>
      <div className="text-warcrow-text">{value}</div>
    </div>
  );

  // Choose either the extended unit format or use the stats object
  const commandValue = unit.command !== undefined ? unit.command : (unit.stats?.MOR !== undefined ? unit.stats.MOR : '-');
  const availabilityValue = unit.availability !== undefined ? unit.availability : (unit.stats?.AVB !== undefined ? unit.stats.AVB : '-');
  const pointsValue = unit.points !== undefined ? unit.points : unit.cost;
  const deploymentMin = unit.deploymentMin || 0;
  const deploymentMax = unit.deploymentMax || 0;
  const deployment = (deploymentMin || deploymentMax) ? `${deploymentMin} - ${deploymentMax}"` : '-';

  return (
    <div className="bg-black/40 rounded-lg p-6 border border-warcrow-gold/30">
      <div className="space-y-6">
        {/* Unit Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-warcrow-gold">{displayName}</h2>
          <div className="flex flex-wrap gap-2">
            {unit.keywords?.map((keyword, index) => (
              <span key={index} className="text-xs bg-warcrow-gold/20 border border-warcrow-gold px-2 py-1 rounded">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Unit Stats */}
        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-warcrow-gold">Combat Stats</h3>
            <div className="bg-black/60 border border-warcrow-gold/30 rounded-md p-4 space-y-2">
              {renderStatRow("Command", commandValue || "-")}
              {renderStatRow("Deployment", deployment)}
              {renderStatRow("Availability", availabilityValue || "-")}
              {renderStatRow("Points", pointsValue)}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-warcrow-gold">Main Profile</h3>
            <div className="bg-black/60 border border-warcrow-gold/30 rounded-md p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="mb-1 text-sm text-warcrow-gold/80">Resolve</div>
                  <div className="h-16 w-16 mx-auto flex items-center justify-center">
                    <GameSymbol 
                      symbol={unit.resolve || unit.stats?.WP} 
                      size="lg" 
                      showBackground={showSymbolBg} 
                      backgroundColor={symbolBgColor}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-sm text-warcrow-gold/80">Movement</div>
                  <div className="h-16 w-16 mx-auto flex items-center justify-center">
                    <div className="text-2xl font-bold text-warcrow-text">{unit.movement || unit.stats?.MOV}"</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-sm text-warcrow-gold/80">Melee</div>
                  <div className="h-16 w-16 mx-auto flex items-center justify-center">
                    <GameSymbol 
                      symbol={unit.melee} 
                      size="lg" 
                      showBackground={showSymbolBg} 
                      backgroundColor={symbolBgColor} 
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-sm text-warcrow-gold/80">Ranged</div>
                  <div className="h-16 w-16 mx-auto flex items-center justify-center">
                    <GameSymbol 
                      symbol={unit.ranged} 
                      size="lg" 
                      showBackground={showSymbolBg} 
                      backgroundColor={symbolBgColor} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-warcrow-gold">Defense Profile</h3>
            <div className="bg-black/60 border border-warcrow-gold/30 rounded-md p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="mb-1 text-sm text-warcrow-gold/80">Defense</div>
                  <div className="h-16 w-16 mx-auto flex items-center justify-center">
                    <GameSymbol 
                      symbol={unit.defense} 
                      size="lg" 
                      showBackground={showSymbolBg} 
                      backgroundColor={symbolBgColor} 
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-sm text-warcrow-gold/80">Wounds</div>
                  <div className="h-16 w-16 mx-auto flex items-center justify-center">
                    <div className="text-2xl font-bold text-warcrow-text">{unit.wounds || unit.stats?.W}</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-sm text-warcrow-gold/80">Actions</div>
                  <div className="h-16 w-16 mx-auto flex items-center justify-center">
                    <div className="text-2xl font-bold text-warcrow-text">{unit.actions || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(unit.specialRules && unit.specialRules.length > 0) && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-warcrow-gold">Special Rules</h3>
              <div className="bg-black/60 border border-warcrow-gold/30 rounded-md p-4">
                <div className="flex flex-wrap gap-2">
                  {unit.specialRules.map((rule, index) => (
                    <span key={index} className="text-xs bg-warcrow-gold/20 border border-warcrow-gold px-2 py-1 rounded">
                      {rule}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitStatCard;
