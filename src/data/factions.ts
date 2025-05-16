
import { Faction } from "../types/army";
import { northernTribesUnits } from "./factions/northern-tribes";
import { hegemonyOfEmbersigUnits } from "./factions/hegemony-of-embersig";
import { scionsOfYaldabaothUnits } from "./factions/scions-of-yaldabaoth";
import { syenannUnits } from "./factions/syenann";

// Define fallback factions in case the database fetch fails
export const factions: Faction[] = [
  { id: "northern-tribes", name: "Northern Tribes" },
  { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
  { id: "scions-of-yaldabaoth", name: "Scions of Yaldabaoth" },
  { id: "syenann", name: "Sÿenann" }
];

// Map for normalizing faction names
const factionNameMap: Record<string, string> = {
  'Hegemony of Embersig': 'hegemony-of-embersig',
  'Northern Tribes': 'northern-tribes',
  'Scions of Yaldabaoth': 'scions-of-yaldabaoth',
  'Sÿenann': 'syenann',
  'Syenann': 'syenann',
  'hegemony': 'hegemony-of-embersig',
  'tribes': 'northern-tribes',
  'scions': 'scions-of-yaldabaoth'
};

// Improved normalize and deduplicate units function
const normalizeUnits = () => {
  const allUnits = [...northernTribesUnits, ...hegemonyOfEmbersigUnits, ...scionsOfYaldabaothUnits, ...syenannUnits];
  const uniqueUnits = [];
  const seen = new Set();
  
  // Debug which units are being processed
  console.log(`Processing ${allUnits.length} units for normalization`);
  console.log(`Northern Tribes: ${northernTribesUnits.length}, Hegemony: ${hegemonyOfEmbersigUnits.length}, Scions: ${scionsOfYaldabaothUnits.length}, Syenann: ${syenannUnits.length}`);
  
  // Check for Battle-Scarred specifically
  const battleScarredUnit = allUnits.find(unit => unit.name === "Battle-Scarred");
  if (battleScarredUnit) {
    console.log("Found Battle-Scarred unit:", battleScarredUnit);
  } else {
    console.log("Battle-Scarred unit not found in original data!");
  }
  
  for (const unit of allUnits) {
    // Normalize faction name
    let normalizedFaction = unit.faction.toLowerCase();
    
    // Check if faction name needs normalization
    if (factionNameMap[unit.faction]) {
      normalizedFaction = factionNameMap[unit.faction];
    }
    // Check if it's a space-separated name that needs conversion
    else if (unit.faction.includes(' ')) {
      const kebabName = unit.faction.toLowerCase().replace(/\s+/g, '-');
      normalizedFaction = factionNameMap[kebabName] || kebabName;
    }
    
    // Create a normalized unit with consistent faction naming
    const normalizedUnit = {
      ...unit,
      faction: normalizedFaction
    };
    
    // Create a unique key including both name and id to guarantee uniqueness
    const key = `${normalizedUnit.id}`;
    
    // Log any potential duplicates for debugging
    if (seen.has(key)) {
      console.log(`Found duplicate unit: ${normalizedUnit.name} with ID ${normalizedUnit.id}`);
    }
    
    // Only add if we haven't seen this key before
    if (!seen.has(key)) {
      seen.add(key);
      uniqueUnits.push(normalizedUnit);
    }
  }
  
  console.log(`Normalized units: ${uniqueUnits.length} out of original ${allUnits.length}`);
  
  // Verify if Battle-Scarred made it to the final list
  const finalBattleScared = uniqueUnits.find(unit => unit.name === "Battle-Scarred");
  if (finalBattleScared) {
    console.log("Battle-Scarred unit is in the final normalized list");
  } else {
    console.log("Battle-Scarred unit did NOT make it to the final list!");
  }
  
  return uniqueUnits;
};

// Export normalized and deduplicated units
export const units = normalizeUnits();
