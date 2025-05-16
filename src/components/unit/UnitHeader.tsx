
import { Unit } from "@/types/army";
import AvatarPortrait from "./header/AvatarPortrait";
import UnitTitle from "./header/UnitTitle";
import CharacteristicsSection from "./keyword-sections/CharacteristicsSection";

interface UnitHeaderProps {
  unit: Unit;
  mainName: string;
  subtitle?: string;
  portraitUrl?: string;
}

const UnitHeader = ({ unit, mainName, subtitle, portraitUrl }: UnitHeaderProps) => {
  return (
    <div className="flex items-start gap-2">
      <AvatarPortrait portraitUrl={portraitUrl} name={mainName} />
      <div className="space-y-1">
        <UnitTitle 
          mainName={mainName}
          subtitle={subtitle}
          command={unit.command || Boolean(unit.command)}
        />
        <CharacteristicsSection 
          keywords={unit.keywords}
          highCommand={unit.highCommand}
        />
      </div>
    </div>
  );
};

export default UnitHeader;
