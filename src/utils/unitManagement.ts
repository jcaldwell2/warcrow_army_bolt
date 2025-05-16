
import { Unit, SelectedUnit, Keyword } from "@/types/army";
import { validateUnitAddition, validateHighCommandAddition } from "./armyValidation";

export const validateUnitAdditionWrapper = (
  unit: Unit,
  currentQuantity: number,
  availability: number,
  selectedUnits: SelectedUnit[],
  armyFaction: string
): boolean => {
  // First, check basic availability
  if (currentQuantity >= availability) return false;
  
  // Then perform comprehensive validation
  return validateUnitAddition(selectedUnits, unit, armyFaction);
};

export const getUpdatedQuantities = (
  unitId: string,
  currentQuantities: Record<string, number>,
  isAdding: boolean
): Record<string, number> => {
  const currentQuantity = currentQuantities[unitId] || 0;
  
  if (isAdding) {
    return {
      ...currentQuantities,
      [unitId]: Math.min(currentQuantity + 1, 9),
    };
  } else {
    return {
      ...currentQuantities,
      [unitId]: Math.max(currentQuantity - 1, 0),
    };
  }
};

export const updateSelectedUnits = (
  selectedUnits: SelectedUnit[],
  unit: Unit | undefined,
  isAdding: boolean
): SelectedUnit[] => {
  if (!unit) return selectedUnits;

  const existingUnit = selectedUnits.find((u) => u.id === unit.id);
  
  if (isAdding) {
    if (existingUnit) {
      return selectedUnits.map((u) =>
        u.id === unit.id
          ? { ...u, quantity: Math.min(u.quantity + 1, 9) }
          : u
      );
    }
    // Convert Unit to SelectedUnit, mapping keywords from Keyword[] to string[]
    const keywordsAsStrings = unit.keywords.map(k => k.name);
    
    return [...selectedUnits, { 
      ...unit, 
      quantity: 1,
      keywords: keywordsAsStrings 
    }];
  } else {
    const updatedUnits = selectedUnits.map((u) =>
      u.id === unit.id ? { ...u, quantity: u.quantity - 1 } : u
    );
    return updatedUnits.filter((u) => u.quantity > 0);
  }
};

/**
 * Checks if a unit can be added to the army
 * Used by UnitCard and other components to disable add button when needed
 */
export const canAddUnit = (
  unit: Unit,
  currentQuantity: number,
  selectedUnits: SelectedUnit[],
  armyFaction: string
): boolean => {
  // If unit has reached availability limit
  if (currentQuantity >= unit.availability) return false;
  
  // If trying to add a high command unit when one already exists
  if (unit.highCommand && selectedUnits.some(u => u.highCommand)) return false;
  
  // If unit faction doesn't match army faction
  if (unit.faction !== armyFaction) return false;
  
  return true;
};
