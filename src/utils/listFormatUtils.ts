
import { SelectedUnit, SavedList } from "@/types/army";
import { factions } from "@/data/factions";

export const getFactionName = (factionId: string): string => {
  const factionData = factions.find(f => f.id === factionId);
  return factionData?.name || "Unknown Faction";
};

export const generateListText = (selectedUnits: SelectedUnit[], listName: string | null, faction: string): string => {
  const sortedUnits = [...selectedUnits].sort((a, b) => {
    if (a.highCommand && !b.highCommand) return -1;
    if (!a.highCommand && b.highCommand) return 1;
    return 0;
  });

  const factionName = getFactionName(faction);
  const listText = `${listName || "Untitled List"}\nFaction: ${factionName}\n\n${sortedUnits
    .map((unit) => {
      const highCommandLabel = unit.highCommand ? " [High Command]" : "";
      const commandPoints = unit.command ? ` (${unit.command} CP)` : "";
      return `${unit.name}${highCommandLabel}${commandPoints} x${unit.quantity} (${unit.pointsCost * unit.quantity} pts)`;
    })
    .join("\n")}`;

  const totalPoints = selectedUnits.reduce(
    (total, unit) => total + unit.pointsCost * unit.quantity,
    0
  );

  const totalCommand = selectedUnits.reduce(
    (total, unit) => total + ((unit.command || 0) * unit.quantity),
    0
  );

  return `${listText}\n\nTotal Command Points: ${totalCommand}\nTotal Points: ${totalPoints}`;
};

export const filterUnitsForCourtesy = (units: SelectedUnit[]): SelectedUnit[] => {
  return units.filter(unit => {
    const hasHiddenKeyword = Array.isArray(unit.keywords) && unit.keywords.some(keyword => {
      if (typeof keyword === 'string') {
        return keyword.toLowerCase() === 'scout' || keyword.toLowerCase() === 'ambusher';
      } else if (keyword && typeof keyword === 'object' && 'name' in keyword) {
        const keywordObj = keyword as { name: string };
        return keywordObj.name.toLowerCase() === 'scout' || keywordObj.name.toLowerCase() === 'ambusher';
      }
      return false;
    });
    return !hasHiddenKeyword;
  });
};
