
import { Unit } from "../../types/army";
import { scionsOfYaldabaothTroops } from "./scions-of-yaldabaoth/troops";
import { scionsOfYaldabaothCharacters } from "./scions-of-yaldabaoth/characters";
import { scionsOfYaldabaothHighCommand } from "./scions-of-yaldabaoth/high-command";

// Combine all the units for the Scions of Yaldabaoth faction
export const scionsOfYaldabaothUnits: Unit[] = [
  ...scionsOfYaldabaothTroops,
  ...scionsOfYaldabaothCharacters,
  ...scionsOfYaldabaothHighCommand
];

// Log the total number of units to verify all are included
console.log(`[scions-of-yaldabaoth] Total units: ${scionsOfYaldabaothUnits.length}`);
console.log(`[scions-of-yaldabaoth] Units: ${scionsOfYaldabaothUnits.map(u => u.name).join(', ')}`);
