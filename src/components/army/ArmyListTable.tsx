
import React from 'react';
import { Unit } from '@/types/army';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from '@/utils/translationUtils';

interface ArmyListTableProps {
  units: {
    unit: Unit;
    quantity: number;
  }[];
  onRemoveUnit?: (unit: Unit) => void;
  onAddUnit?: (unit: Unit) => void;
  showControls?: boolean;
}

const ArmyListTable: React.FC<ArmyListTableProps> = ({ 
  units,
  onRemoveUnit,
  onAddUnit,
  showControls = true
}) => {
  const { t, language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();

  // Sort by name for easier navigation
  const sortedUnits = [...units].sort((a, b) => {
    return a.unit.name.localeCompare(b.unit.name);
  });
  
  const totalPoints = units.reduce((sum, { unit, quantity }) => sum + (unit.pointsCost * quantity), 0);
  const totalUnits = units.reduce((sum, { quantity }) => sum + quantity, 0);
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-warcrow-text border-collapse">
        <thead className="bg-warcrow-accent/50">
          <tr>
            <th className="text-left px-4 py-2">{t('unit')}</th>
            <th className="text-center px-2 py-2">{t('quantity')}</th>
            <th className="text-center px-2 py-2">{t('points')}</th>
            {showControls && <th className="text-right px-2 py-2">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {sortedUnits.map(({ unit, quantity }) => (
            <tr key={unit.id} className="border-b border-warcrow-gold/20">
              <td className="px-4 py-3 text-sm">
                {translateUnitName(unit.name, language)}
                {unit.command ? 
                  <span className="ml-2 text-xs bg-warcrow-gold/20 border border-warcrow-gold px-1 py-0.5 rounded">
                    {t('command')}: {unit.command}
                  </span> : null}
              </td>
              <td className="text-center px-2 py-3">{quantity}</td>
              <td className="text-center px-2 py-3">{unit.pointsCost * quantity}</td>
              {showControls && (
                <td className="text-right px-2 py-3">
                  <div className="flex justify-end items-center space-x-1.5">
                    <button 
                      onClick={() => onRemoveUnit && onRemoveUnit(unit)}
                      className="w-6 h-6 rounded border border-warcrow-gold/30 flex items-center justify-center bg-warcrow-gold/10 hover:bg-warcrow-gold/20 transition-colors"
                    >
                      <span>-</span>
                    </button>
                    <button 
                      onClick={() => onAddUnit && onAddUnit(unit)}
                      className="w-6 h-6 rounded border border-warcrow-gold/30 flex items-center justify-center bg-warcrow-gold/10 hover:bg-warcrow-gold/20 transition-colors"
                      disabled={unit.availability ? quantity >= unit.availability : false}
                    >
                      <span>+</span>
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          <tr className="bg-warcrow-accent/30">
            <td className="px-4 py-3 font-semibold">{t('total')}</td>
            <td className="text-center px-2 py-3">{totalUnits}</td>
            <td className="text-center px-2 py-3 font-semibold">{totalPoints} {t('pts')}</td>
            {showControls && <td></td>}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ArmyListTable;
