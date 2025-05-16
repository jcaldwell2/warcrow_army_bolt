
import { SelectedUnit } from "@/types/army";

interface TotalPointsProps {
  selectedUnits: SelectedUnit[];
}

const TotalPoints = ({ selectedUnits }: TotalPointsProps) => {
  const totalPoints = selectedUnits.reduce(
    (total, unit) => total + unit.pointsCost * unit.quantity,
    0
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-warcrow-background border-t border-warcrow-gold py-2 px-3 md:p-4 z-20">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-sm md:text-base text-warcrow-text">Total Army Points:</span>
        <span className="text-lg md:text-xl font-bold text-warcrow-gold">
          {totalPoints} pts
        </span>
      </div>
    </div>
  );
};

export default TotalPoints;
