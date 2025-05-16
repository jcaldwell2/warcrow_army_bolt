import { Unit } from "@/types/army";
import UnitKeywords from "../UnitKeywords";

interface UnitCardKeywordsProps {
  unit: Unit;
  isMobile: boolean;
}

const UnitCardKeywords = ({ unit, isMobile }: UnitCardKeywordsProps) => {
  return (
    <div className="space-y-4">
      <UnitKeywords keywords={unit.keywords} specialRules={unit.specialRules} />
    </div>
  );
};

export default UnitCardKeywords;