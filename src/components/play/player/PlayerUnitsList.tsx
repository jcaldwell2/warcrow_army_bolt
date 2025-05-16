
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Unit } from '@/types/game';

interface PlayerUnitsListProps {
  units: Unit[];
}

const PlayerUnitsList: React.FC<PlayerUnitsListProps> = ({ units }) => {
  return (
    <div>
      <Label className="font-medium">Units</Label>
      <div className="mt-2 space-y-2">
        {units.length > 0 ? (
          units.map((unit) => (
            <Card key={unit.id} className="bg-background/50 border-dashed">
              <CardContent className="p-3">
                <div className="text-sm font-medium">{unit.name}</div>
                {unit.status && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Status: {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-sm text-muted-foreground italic">No units parsed from list</div>
        )}
      </div>
    </div>
  );
};

export default PlayerUnitsList;
