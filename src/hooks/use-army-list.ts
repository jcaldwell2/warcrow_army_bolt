
import { useState, useEffect, useCallback } from "react";
import { SelectedUnit, SavedList, Unit } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUpdatedQuantities, updateSelectedUnits } from "@/utils/unitManagement";
import { validateUnitAddition } from "@/utils/armyValidation";
import { useArmyBuilderUnits, mapApiUnitToUnit } from '@/components/stats/unit-explorer/useUnitData';

export const useArmyList = (selectedFaction: string) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [currentListName, setCurrentListName] = useState<string>("New Army List");
  const [listName, setListName] = useState<string>("");
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  
  // Use our new hook that filters out hidden units
  const { data: factionUnits = [], isLoading: unitsLoading, error: unitsError } = useArmyBuilderUnits(selectedFaction);

  useEffect(() => {
    // Log information about the units being loaded
    if (unitsLoading) {
      console.log(`[useArmyList] Loading units for faction: ${selectedFaction}`);
    } else if (unitsError) {
      console.error(`[useArmyList] Error loading units for faction ${selectedFaction}:`, unitsError);
    } else {
      console.log(`[useArmyList] Loaded ${factionUnits.length} units for faction: ${selectedFaction}`);
      
      // Log the first few units for debugging purposes
      if (factionUnits.length > 0) {
        console.log(`[useArmyList] Sample units:`, factionUnits.slice(0, 3));
      } else {
        console.warn(`[useArmyList] No units found for faction: ${selectedFaction}`);
      }
    }
  }, [factionUnits, unitsLoading, unitsError, selectedFaction]);

  // Load saved lists for the current faction
  const fetchSavedLists = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user) {
      const { data } = await supabase
        .from('army_lists')
        .select('*')
        .eq('faction', selectedFaction)
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false });
      
      if (data) {
        // Convert database units to proper typed SelectedUnit[]
        const typedLists: SavedList[] = data.map(list => ({
          ...list,
          units: (list.units as any[]).map(unit => ({
            ...unit,
            keywords: Array.isArray(unit.keywords) 
              ? unit.keywords 
              : (typeof unit.keywords === 'string' ? [unit.keywords] : [])
          })) as SelectedUnit[]
        }));
        setSavedLists(typedLists);
      } else {
        setSavedLists([]);
      }
    } else {
      // If user is not logged in, check local storage
      const localLists = JSON.parse(localStorage.getItem('savedLists') || '[]');
      setSavedLists(localLists.filter((list: SavedList) => list.faction === selectedFaction));
    }
  }, [selectedFaction]);

  // Load saved lists on faction change
  useEffect(() => {
    fetchSavedLists();
    // Clear current selections when faction changes
    setQuantities({});
    setSelectedUnits([]);
    setCurrentListName("New Army List");
  }, [selectedFaction, fetchSavedLists]);

  const handleAdd = (unitId: string) => {
    const unit = factionUnits.find((u) => u.id === unitId);
    if (!unit) {
      console.warn(`[useArmyList] Tried to add unit with ID ${unitId} but it was not found in factionUnits`);
      return;
    }

    // Perform validation 
    const canAdd = validateUnitAddition(
      selectedUnits, 
      unit, 
      selectedFaction
    );

    if (!canAdd) {
      if (unit.highCommand && selectedUnits.some(u => u.highCommand)) {
        setShowHighCommandAlert(true);
      }
      return;
    }

    // Update quantities and selected units
    const newQuantities = getUpdatedQuantities(unitId, quantities, true);
    setQuantities(newQuantities);

    const updatedSelectedUnits = updateSelectedUnits(
      selectedUnits,
      unit,
      true
    );
    setSelectedUnits(updatedSelectedUnits);
  };

  const handleRemove = (unitId: string) => {
    const unit = factionUnits.find((u) => u.id === unitId);
    if (!unit) {
      console.warn(`[useArmyList] Tried to remove unit with ID ${unitId} but it was not found in factionUnits`);
      return;
    }

    // Update quantities and selected units
    const newQuantities = getUpdatedQuantities(unitId, quantities, false);
    setQuantities(newQuantities);

    const updatedSelectedUnits = updateSelectedUnits(
      selectedUnits,
      unit,
      false
    );
    setSelectedUnits(updatedSelectedUnits);
  };

  const handleNewList = () => {
    setQuantities({});
    setSelectedUnits([]);
    setCurrentListName("New Army List");
  };

  const handleSaveList = async () => {
    if (listName.trim() === "") {
      toast.error("Please enter a name for your list");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const listToSave: SavedList = {
      id: crypto.randomUUID(),
      name: listName,
      faction: selectedFaction,
      units: selectedUnits,
      created_at: new Date().toISOString(),
      user_id: userData?.user?.id
    };

    try {
      if (userData?.user) {
        // Convert SelectedUnit[] to database-compatible format
        const databaseCompatibleUnits = selectedUnits.map(unit => ({
          ...unit,
          // Ensure keywords is compatible with database Json type
          keywords: Array.isArray(unit.keywords) 
            ? unit.keywords 
            : [unit.keywords]
        }));
        
        // Save to Supabase if user is logged in
        const { error } = await supabase
          .from('army_lists')
          .insert({
            name: listName,
            faction: selectedFaction,
            units: databaseCompatibleUnits,
            user_id: userData.user.id
          });

        if (error) throw error;
      } else {
        // Save to local storage if not logged in
        const existingLists = JSON.parse(localStorage.getItem('savedLists') || '[]');
        const updatedLists = [...existingLists, listToSave];
        localStorage.setItem('savedLists', JSON.stringify(updatedLists));
      }

      setCurrentListName(listName);
      toast.success("List saved successfully");
      fetchSavedLists();
    } catch (error: any) {
      console.error("Error saving list:", error);
      toast.error(`Error saving list: ${error.message}`);
    }
  };

  const handleLoadList = (list: SavedList) => {
    setCurrentListName(list.name);
    setSelectedUnits(list.units);
    
    // Rebuild quantities from the selected units
    const newQuantities: Record<string, number> = {};
    list.units.forEach(unit => {
      newQuantities[unit.id] = unit.quantity;
    });
    setQuantities(newQuantities);
  };

  return {
    quantities,
    selectedUnits,
    listName,
    currentListName,
    savedLists,
    showHighCommandAlert,
    setShowHighCommandAlert,
    setListName,
    handleAdd,
    handleRemove,
    handleNewList,
    handleSaveList,
    handleLoadList,
    factionUnits,
    unitsLoading,
    unitsError
  };
};
