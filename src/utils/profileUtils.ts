
import { supabase } from "@/integrations/supabase/client";
import { SavedList, SelectedUnit } from "@/types/army";

// Function to fetch saved lists by WAB ID
export const fetchListsByWabId = async (wabId: string): Promise<SavedList[]> => {
  try {
    console.log("Utility: Fetching lists by WAB ID:", wabId);
    
    if (!wabId || wabId.trim() === '') {
      console.log("Utility: No WAB ID provided");
      return [];
    }
    
    // First method: Try directly using the WAB ID from the army_lists table
    const { data: directLists, error: directError } = await supabase
      .from('army_lists')
      .select('*')
      .eq('wab_id', wabId);
    
    if (directError) {
      console.error("Utility: Error fetching lists directly by WAB ID:", directError);
    } else {
      console.log("Utility: Direct query by WAB ID returned:", directLists?.length || 0, "lists");
    }
    
    if (directLists && directLists.length > 0) {
      console.log("Utility: Found lists directly with WAB ID:", directLists.length);
      return formatListsData(directLists);
    }
    
    // Second method: Get the profile by WAB ID, then get lists by user_id
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('wab_id', wabId)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid errors when no rows are returned
    
    if (profileError) {
      console.error("Utility: Error fetching profile by WAB ID:", profileError);
      return [];
    }
    
    if (!profileData?.id) {
      console.log("Utility: No profile found with WAB ID:", wabId);
      return [];
    }
    
    console.log("Utility: Found profile with ID:", profileData.id);
    
    // Fetch the lists using the profile ID
    const { data: listsData, error: listsError } = await supabase
      .from('army_lists')
      .select('*')
      .eq('user_id', profileData.id);
    
    if (listsError) {
      console.error("Utility: Error fetching lists by user ID:", listsError);
      return [];
    }
    
    console.log("Utility: Found lists by user ID:", listsData?.length || 0);
    return formatListsData(listsData || []);
    
  } catch (err) {
    console.error("Utility: Error in fetchListsByWabId:", err);
    return [];
  }
};

// Function to fetch saved lists by user ID
export const fetchSavedListsByUserId = async (userId: string): Promise<SavedList[]> => {
  try {
    console.log("Utility: Fetching saved lists for user ID:", userId);
    const { data, error } = await supabase
      .from('army_lists')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Utility: Error fetching saved lists:", error);
      return [];
    }
    
    return formatListsData(data || []);
  } catch (err) {
    console.error("Utility: Error in fetchSavedListsByUserId:", err);
    return [];
  }
};

// Helper function to format lists data consistently
const formatListsData = (data: any[]): SavedList[] => {
  if (!data || data.length === 0) {
    return [];
  }
  
  console.log("Utility: Formatting lists data:", data.length);
  
  // Convert the database response to SavedList[] type
  const typedLists: SavedList[] = data.map(item => {
    // Ensure units is properly typed as SelectedUnit[]
    let typedUnits: SelectedUnit[] = [];
    if (Array.isArray(item.units)) {
      typedUnits = item.units.map((unit: any) => ({
        id: unit.id || `unit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: unit.name || 'Unknown Unit',
        pointsCost: unit.pointsCost || 0,
        quantity: unit.quantity || 1,
        faction: unit.faction || item.faction,
        keywords: Array.isArray(unit.keywords) ? unit.keywords : [],
        highCommand: !!unit.highCommand,
        availability: unit.availability || 1,
        specialRules: Array.isArray(unit.specialRules) ? unit.specialRules : [],
        command: unit.command || 0
      }));
    }
    
    return {
      id: item.id,
      name: item.name,
      faction: item.faction,
      units: typedUnits,
      user_id: item.user_id,
      created_at: item.created_at,
      wab_id: item.wab_id
    };
  });
  
  console.log("Utility: Processed typed lists:", typedLists.length);
  return typedLists;
};
