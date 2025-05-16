
import { Unit, SelectedUnit } from "@/types/army";

/**
 * Validates whether a high command unit can be added to the army list
 * Only one high command unit is allowed per army list
 */
export const validateHighCommandAddition = (selectedUnits: SelectedUnit[], newUnit: Unit): boolean => {
  if (!newUnit.highCommand) return true;
  
  const existingHighCommand = selectedUnits.some(unit => unit.highCommand);
  return !existingHighCommand;
};

/**
 * Validates if the unit can be added based on the unit's faction matching the army's faction
 */
export const validateFactionRestriction = (armyFaction: string, unitFaction: string): boolean => {
  return armyFaction === unitFaction;
};

/**
 * Validates if a unit can be added to the army based on availability and quantity restrictions
 */
export const validateUnitAvailability = (
  selectedUnits: SelectedUnit[],
  unitToAdd: Unit
): boolean => {
  // Check if the unit is already in the army
  const existingUnit = selectedUnits.find(unit => unit.id === unitToAdd.id);
  
  // If the unit isn't in the army yet, it can be added (up to availability)
  if (!existingUnit) return true;
  
  // Check if adding another of this unit would exceed its availability
  return existingUnit.quantity < unitToAdd.availability;
};

/**
 * Comprehensive validation of unit addition to an army list
 * Checks high command restriction, faction restriction, and availability
 */
export const validateUnitAddition = (
  selectedUnits: SelectedUnit[],
  unitToAdd: Unit,
  armyFaction: string
): boolean => {
  // High command validation
  const isHighCommandValid = validateHighCommandAddition(selectedUnits, unitToAdd);
  if (!isHighCommandValid) return false;
  
  // Faction validation
  const isFactionValid = validateFactionRestriction(armyFaction, unitToAdd.faction);
  if (!isFactionValid) return false;
  
  // Availability validation
  const isAvailabilityValid = validateUnitAvailability(selectedUnits, unitToAdd);
  if (!isAvailabilityValid) return false;
  
  return true;
};
