
import { SelectedUnit } from "@/types/army";
import SelectedUnits from "../SelectedUnits";
import ShareExportButton from "./ShareExportButton";

interface SelectedUnitsSectionProps {
  selectedUnits: SelectedUnit[];
  currentListName: string | null;
  onRemove: (unitId: string) => void;
}

const SelectedUnitsSection = ({
  selectedUnits,
  currentListName,
  onRemove,
}: SelectedUnitsSectionProps) => {
  // Get faction from the first unit (if available)
  const faction = selectedUnits.length > 0 ? selectedUnits[0].faction : "";

  return (
    <div className="sticky top-4 z-10 flex flex-col space-y-4 bg-warcrow-background/95 backdrop-blur-sm rounded-lg md:h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold">Selected Units</h2>
        <div className="hidden md:flex gap-2">
          {selectedUnits.length > 0 && currentListName && (
            <ShareExportButton 
              selectedUnits={selectedUnits} 
              listName={currentListName}
              faction={faction}
            />
          )}
        </div>
      </div>
      <div className="flex-grow overflow-auto pb-4">
        <SelectedUnits selectedUnits={selectedUnits} onRemove={onRemove} />
      </div>
      
      {/* Mobile share button at the bottom */}
      <div className="block md:hidden">
        {selectedUnits.length > 0 && currentListName && (
          <ShareExportButton 
            selectedUnits={selectedUnits} 
            listName={currentListName}
            faction={faction}
          />
        )}
      </div>
    </div>
  );
};

export default SelectedUnitsSection;
