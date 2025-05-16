
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ExtendedUnit } from '@/types/extendedUnit';

interface UnitListProps {
  units: Array<any>;
  searchQuery: string;
  isLoading: boolean;
  error: any;
  onSelectUnit?: (unit: ExtendedUnit) => void;
}

export const UnitList: React.FC<UnitListProps> = ({
  units,
  searchQuery,
  isLoading,
  error,
  onSelectUnit
}) => {
  // Filter units based on search query
  const filteredUnits = units?.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    return (
      <Card className="p-6 border-red-500 bg-red-50 text-red-900">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold">Error Loading Units</h3>
        </div>
        <p>{(error as Error).message}</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (filteredUnits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No units found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredUnits.map(unit => (
        <Card 
          key={unit.id} 
          className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-warcrow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => onSelectUnit && onSelectUnit(unit)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{unit.name}</h3>
              <p className="text-sm text-gray-600">{unit.faction_display}</p>
            </div>
            <div className="flex gap-1">
              {unit.name_es && <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">ES</div>}
              {unit.name_fr && <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">FR</div>}
            </div>
          </div>
          <p className="mt-2 text-sm line-clamp-2">{unit.description || "No description available"}</p>
        </Card>
      ))}
    </div>
  );
};

export default UnitList;
