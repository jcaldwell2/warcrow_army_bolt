
import { useState, useEffect, useMemo, useCallback } from "react";
import { Unit, SelectedUnit, SavedList } from "@/types/army";
import { useToast } from "@/hooks/use-toast";
import { validateHighCommandAddition, validateUnitAddition } from "@/utils/armyValidation";
import { units } from "@/data/factions";
import { fetchSavedLists, saveListToStorage } from "@/utils/listManagement";
import { getUpdatedQuantities, updateSelectedUnits, canAddUnit } from "@/utils/unitManagement";
import { useAuth } from "@/components/auth/AuthProvider";
import { useArmyBuilderUnits } from "@/components/stats/unit-explorer/useUnitData";
import { toast } from "sonner";

export const useArmyList = (selectedFaction: string) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [listName, setListName] = useState("");
  const [currentListName, setCurrentListName] = useState<string | null>(null);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isGuest } = useAuth();
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  // Use react-query hook to fetch faction units with proper loading/error states
  const { 
    data: factionUnits = [], 
    isLoading: unitsLoading, 
    error: unitsError,
    isError: isUnitsError
  } = useArmyBuilderUnits(selectedFaction);

  // Show toast if units fail to load
  useEffect(() => {
    if (isUnitsError && unitsError) {
      console.error('[useArmyList] Error loading units:', unitsError);
      toast({
        title: "Failed to load units",
        description: "Using fallback units. You can try refreshing the page.",
        variant: "destructive",
      });
    }
  }, [isUnitsError, unitsError, toast]);

  // Fetch saved lists on mount and when auth state changes
  useEffect(() => {
    const loadSavedLists = async () => {
      setIsLoadingLists(true);
      try {
        console.log("Fetching saved lists with auth state:", { isAuthenticated, isGuest });
        const lists = await fetchSavedLists();
        console.log(`Fetched ${lists.length} saved lists`);
        setSavedLists(lists);
      } catch (error) {
        console.error('[useArmyList] Error fetching saved lists:', error);
      } finally {
        setIsLoadingLists(false);
      }
    };
    loadSavedLists();
  }, [isAuthenticated, isGuest]);

  const handleAdd = useCallback(
    (unitId: string) => {
      const unit = factionUnits.find((u) => u.id === unitId);
      if (!unit) return;

      const currentQuantity = quantities[unitId] || 0;

      if (!validateUnitAddition(selectedUnits, unit, selectedFaction)) {
        toast({
          title: "Unit Limit Reached",
          description: `You cannot add more ${unit.name} to your list.`,
          variant: "destructive",
        });
        return;
      }

      if (!validateHighCommandAddition(selectedUnits, unit)) {
        setShowHighCommandAlert(true);
        return;
      }

      setQuantities((prev) => getUpdatedQuantities(unitId, prev, true));
      setSelectedUnits((prev) => updateSelectedUnits(prev, unit, true));
    },
    [factionUnits, quantities, selectedUnits, selectedFaction, toast]
  );

  const handleRemove = useCallback((unitId: string) => {
    const unit = factionUnits.find((u) => u.id === unitId);
    setQuantities((prev) => getUpdatedQuantities(unitId, prev, false));
    setSelectedUnits((prev) => updateSelectedUnits(prev, unit, false));
  }, [factionUnits]);

  const handleNewList = useCallback(() => {
    setQuantities({});
    setSelectedUnits([]);
    setListName("");
    setCurrentListName(null);
    toast({
      title: "New List Created",
      description: "Started a new empty list",
    });
  }, [toast]);

  const handleSaveList = useCallback(() => {
    const nameToUse = currentListName || listName;

    if (!nameToUse || !nameToUse.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your list before saving",
        variant: "destructive",
      });
      return;
    }

    if (nameToUse.toLowerCase() === "new list") {
      toast({
        title: "Invalid Name",
        description: "Please choose a different name for your list",
        variant: "destructive",
      });
      return;
    }

    const validatedUnits = selectedUnits.map((unit) => ({
      ...unit,
      quantity: Math.min(unit.quantity, unit.availability),
    }));

    const filteredLists = savedLists.filter((list) => list.name !== nameToUse);
    const newList = saveListToStorage(nameToUse, selectedFaction, validatedUnits);
    const updatedLists = [...filteredLists, newList];

    setSavedLists(updatedLists);
    localStorage.setItem("armyLists", JSON.stringify(updatedLists));
    setCurrentListName(nameToUse);

    const newQuantities: Record<string, number> = {};
    validatedUnits.forEach((unit) => {
      newQuantities[unit.id] = unit.quantity;
    });
    
    setQuantities(newQuantities);
    setSelectedUnits(validatedUnits);
    setListName("");

    toast({
      title: "Success",
      description: "Army list saved successfully",
    });
  }, [currentListName, listName, selectedFaction, selectedUnits, savedLists, toast]);

  const handleLoadList = useCallback((list: SavedList) => {
    const validatedUnits = list.units.map((unit) => ({
      ...unit,
      quantity: Math.min(unit.quantity, unit.availability),
    }));

    const newQuantities: Record<string, number> = {};
    validatedUnits.forEach((unit) => {
      newQuantities[unit.id] = unit.quantity;
    });

    setSelectedUnits(validatedUnits);
    setQuantities(newQuantities);
    setCurrentListName(list.name);

    toast({
      title: "Success",
      description: `Loaded army list: ${list.name}`,
    });
  }, [toast]);

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
    unitsError,
    isLoadingLists
  };
};
