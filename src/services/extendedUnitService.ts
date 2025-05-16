
import { ExtendedUnit, AttachedCharacter } from "@/types/extendedUnit";
import { allExtendedUnits, hegemonyCharacters } from "@/data/extendedUnits";
import { SelectedUnit } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";

// Get extended unit data by unit ID
export const getExtendedUnitById = (unitId: string): ExtendedUnit | undefined => {
  const unit = allExtendedUnits.find(unit => unit.id === unitId);
  return unit;
};

// Get character data by ID
export const getCharacterById = (characterId: string): AttachedCharacter | undefined => {
  // Combine all character arrays for searching
  const allCharacters = [...hegemonyCharacters];
  return allCharacters.find(char => char.id === characterId);
};

// Match regular unit with extended unit data
export const matchWithExtendedData = (selectedUnit: SelectedUnit): ExtendedUnit | undefined => {
  // Try to match by ID first
  let extendedUnit = getExtendedUnitById(selectedUnit.id);
  
  // If no match by ID, try matching by name
  if (!extendedUnit) {
    extendedUnit = allExtendedUnits.find(
      unit => unit.name.toLowerCase() === selectedUnit.name.toLowerCase()
    );
  }
  
  return extendedUnit;
};

// Get all extended units from Supabase
export const getAllExtendedUnits = async (): Promise<ExtendedUnit[]> => {
  console.log("[ExtendedUnitService] Fetching units from Supabase");
  try {
    // First try to fetch from Supabase
    const { data, error } = await supabase
      .from("unit_data")
      .select("*")
      .order('faction');

    if (error) {
      console.error("Error fetching units from Supabase:", error);
      console.log("[ExtendedUnitService] Falling back to local data");
      // Fallback to local data if there's an error
      return allExtendedUnits;
    }

    if (!data || data.length === 0) {
      console.warn("No unit data found in Supabase, using local data instead");
      return allExtendedUnits;
    }
    
    console.log(`[ExtendedUnitService] Successfully retrieved ${data.length} units from Supabase`);
    
    // Transform the Supabase data to the ExtendedUnit format
    return data.map(unit => {
      // Safely access characteristics as an object
      const characteristics = unit.characteristics as Record<string, any> || {};
      
      return {
        id: unit.id,
        name: unit.name,
        cost: unit.points || 0,
        stats: { 
          MOV: characteristics.movement?.toString() || "3-3 (9)", 
          W: characteristics.wounds || 1, 
          WP: characteristics.resolve?.toString() || "🟠", 
          MOR: characteristics.command?.toString() || "1", 
          AVB: characteristics.availability || 1 
        },
        type: unit.type || "Infantry",
        keywords: unit.keywords || [],
        specialRules: unit.special_rules || [],
        profiles: [], // This would need more complex mapping
        abilities: {}, // This would need more complex mapping
        imageUrl: undefined, 
        command: characteristics.command || undefined,
        availability: characteristics.availability || undefined,
        points: unit.points
      };
    });
  } catch (err) {
    console.error("[ExtendedUnitService] Error in getAllExtendedUnits:", err);
    return allExtendedUnits; // Return local data as fallback
  }
};

// Legacy synchronous version for backward compatibility
export const getAllExtendedUnitsSync = (): ExtendedUnit[] => {
  console.log("[ExtendedUnitService] Using synchronous fallback for extended units");
  return allExtendedUnits;
};
