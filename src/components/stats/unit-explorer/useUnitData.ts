
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ApiUnit, Unit, Faction } from '@/types/army';
import { useAuth } from '@/components/auth/AuthProvider';
import { factions as fallbackFactions, units as fallbackUnits } from '@/data/factions';

// Remove the duplicate Unit interface since we're importing it from @/types/army
export function useUnitData(selectedFaction: string) {
  return useQuery({
    queryKey: ['units', selectedFaction],
    queryFn: async () => {
      console.log(`[useUnitData] Fetching units for faction: ${selectedFaction}`);
      try {
        // Set up a timeout for the fetch - reduced to 800ms for faster fallback
        const timeoutPromise = new Promise<ApiUnit[]>((_, reject) => {
          setTimeout(() => reject(new Error('Database fetch timeout')), 800); // 800ms timeout
        });
        
        // Actual fetch with promise race
        let query = supabase.from('unit_data').select('*');
        
        if (selectedFaction !== 'all') {
          query = query.eq('faction', selectedFaction);
        }
        
        // Race between the fetch and timeout
        const { data, error } = await Promise.race([
          query,
          timeoutPromise.then(() => {
            throw new Error('Database fetch timeout');
          })
        ]) as any;
        
        if (error) {
          console.error(`[useUnitData] Error fetching units for faction ${selectedFaction}:`, error);
          throw error;
        }
        
        console.log(`[useUnitData] Successfully fetched ${data?.length || 0} units`);
        
        // Log unit names for debugging
        if (data && data.length > 0) {
          console.log(`[useUnitData] Units for ${selectedFaction}:`, data.map((u: any) => u.name).slice(0, 5), `... (${data.length} total)`);
        }
        
        // Add faction_display field and convert Json to proper Record type
        const unitsWithFactionDisplay = (data || []).map((unit: any) => ({
          ...unit,
          faction_display: unit.faction, // Use faction ID as display name for now
          characteristics: unit.characteristics as Record<string, any> // Convert Json to Record
        })) as ApiUnit[];
        
        return unitsWithFactionDisplay;
      } catch (error) {
        console.error(`[useUnitData] Failed to fetch units:`, error);
        
        // Return mock data for testing when API fails
        console.log(`[useUnitData] Using fallback data for faction: ${selectedFaction}`);
        return fallbackUnits.map(unit => ({
          ...unit,
          faction_display: unit.faction,
          characteristics: { command: unit.command, availability: unit.availability }
        })) as ApiUnit[];
      }
    },
    retry: 0, // No retries to provide fallback faster
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Updated useFactions hook with better error handling, caching and language support
export function useFactions(language: string = 'en') {
  return useQuery({
    queryKey: ['factions', language],
    queryFn: async () => {
      console.log("[useFactions] Fetching factions from Supabase with language:", language);
      try {
        // First check localStorage for immediate display
        const cachedFactions = localStorage.getItem('cached_factions');
        let localFactions: Faction[] = [];
        
        if (cachedFactions) {
          try {
            localFactions = JSON.parse(cachedFactions);
            console.log('[useFactions] Found cached factions in localStorage:', localFactions.length);
            // Continue with the fetch but use cached data for faster display
          } catch (e) {
            console.error('[useFactions] Failed to parse cached factions:', e);
          }
        }
        
        // Set up a timeout for the fetch - reduced to 800ms for faster fallback
        const timeoutPromise = new Promise<Faction[]>((resolve) => {
          setTimeout(() => {
            console.log("[useFactions] Database fetch timeout after 800ms, using cached or default factions");
            return resolve(localFactions.length > 0 ? localFactions : fallbackFactions);
          }, 800); // 800ms timeout
        });
        
        // Actual fetch with promise race
        const fetchPromise = supabase
          .from('factions')
          .select('*')
          .order('name');
          
        // Race between the fetch and timeout
        const { data, error } = await Promise.race([
          fetchPromise,
          timeoutPromise.then(() => {
            // If timeout wins, return a fake response that will trigger fallback
            return { data: null, error: new Error('Database fetch timeout') };
          })
        ]) as any;
          
        if (error) {
          console.error("[useFactions] Error fetching factions:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Transform to expected Faction type with language support
          const fetchedFactions = data.map((faction: any) => ({
            id: faction.id,
            name: language === 'es' ? faction.name_es || faction.name :
                 language === 'fr' ? faction.name_fr || faction.name : 
                 faction.name,
            name_es: faction.name_es,
            name_fr: faction.name_fr
          }));
          
          console.log(`[useFactions] Successfully fetched ${fetchedFactions.length} factions:`, 
            fetchedFactions.map((f: Faction) => f.name).join(', '));
          
          // Store in localStorage as a backup
          try {
            localStorage.setItem('cached_factions', JSON.stringify(fetchedFactions));
          } catch (e) {
            console.error('[useFactions] Failed to cache factions in localStorage:', e);
          }
          
          return fetchedFactions;
        } 
        
        // If we have local factions, return them
        if (localFactions.length > 0) {
          console.log('[useFactions] No factions in database, using cached factions');
          return localFactions;
        }
        
        console.log('[useFactions] No factions found in database or cache, using default factions');
        // Provide fallback data if no factions were found
        return fallbackFactions;
      } catch (error) {
        console.error('[useFactions] Failed to fetch factions:', error);
        
        // Try getting from localStorage if API fails
        try {
          const cachedFactions = localStorage.getItem('cached_factions');
          if (cachedFactions) {
            console.log('[useFactions] Using cached factions from localStorage after API error');
            return JSON.parse(cachedFactions);
          }
        } catch (e) {
          console.error('[useFactions] Failed to retrieve cached factions after API error:', e);
        }
        
        // Return fallback data on error
        return fallbackFactions;
      }
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 0, // No retry to provide fallback faster
  });
}

// Convert API units to army builder units - ensuring type compatibility
export function mapApiUnitToUnit(apiUnit: ApiUnit): Unit {
  // Safely access characteristics as an object and handle nullability
  const characteristics = apiUnit.characteristics && 
    typeof apiUnit.characteristics === 'object' ? 
    apiUnit.characteristics as Record<string, any> : {};
    
  return {
    id: apiUnit.id,
    name: apiUnit.name,
    faction: apiUnit.faction,
    pointsCost: apiUnit.points,
    availability: characteristics?.availability || 0,
    command: characteristics?.command || 0,
    keywords: (apiUnit.keywords || []).map(k => ({ name: k })),
    specialRules: apiUnit.special_rules || [],
    // Fixed the TypeScript error with proper type checking
    highCommand: Boolean(characteristics?.highCommand) || false,
  };
}

export function useArmyBuilderUnits(selectedFaction: string) {
  const { isAuthenticated, isGuest } = useAuth();
  
  return useQuery({
    queryKey: ['army-builder-units', selectedFaction],
    queryFn: async () => {
      // Log the authentication state for debugging
      console.log("[useArmyBuilderUnits] Auth state:", { isAuthenticated, isGuest, selectedFaction, timestamp: new Date().toISOString() });
      
      try {
        const startTime = performance.now();
        console.log(`[useArmyBuilderUnits] Starting fetch for faction: ${selectedFaction}`);
        
        // First check localStorage for cached units - for immediate display
        let cachedUnits: Unit[] = [];
        try {
          const cachedData = localStorage.getItem(`units_${selectedFaction}`);
          if (cachedData) {
            try {
              cachedUnits = JSON.parse(cachedData);
              console.log(`[useArmyBuilderUnits] Found ${cachedUnits.length} cached units in localStorage for ${selectedFaction}`);
              // Continue with fetch but use cached data for instant display
            } catch (parseError) {
              console.error('[useArmyBuilderUnits] Failed to parse cached units:', parseError);
            }
          }
        } catch (e) {
          console.error('[useArmyBuilderUnits] Failed to access localStorage:', e);
        }
        
        // Try getting data from Supabase with a very short timeout
        let query = supabase.from('unit_data').select('*');
        
        if (selectedFaction !== 'all') {
          query = query.eq('faction', selectedFaction);
        }
        
        // Set a shorter timeout for the fetch (800ms)
        const timeoutPromise = new Promise((_resolve, reject) => {
          setTimeout(() => {
            console.log("[useArmyBuilderUnits] Database fetch timeout after 800ms");
            reject(new Error('Database fetch timeout'));
          }, 800); // 800ms timeout
        });
        
        // Race between the fetch and timeout
        const { data, error } = await Promise.race([
          query,
          timeoutPromise.then(() => {
            throw new Error('Database fetch timeout');
          })
        ]) as any;
        
        if (error) {
          console.error("[useArmyBuilderUnits] Error fetching units from Supabase:", error);
          throw error; // Throw to trigger the fallback path
        }
        
        // Check if we have data
        if (!data || data.length === 0) {
          console.info(`[useArmyBuilderUnits] No units found in database for faction: ${selectedFaction}`);
          throw new Error("No units found in database"); // Trigger fallback to local data
        }
        
        const fetchTime = performance.now() - startTime;
        console.log(`[useArmyBuilderUnits] Database fetch completed in ${fetchTime.toFixed(2)}ms`);
        
        // Log sample of unit names for debugging
        console.log(`[useArmyBuilderUnits] Database units for ${selectedFaction}:`, 
          data.slice(0, 3).map((u: any) => `${u.name}${u.characteristics?.highCommand ? ' (HC)' : ''}`).join(', ') + 
          (data.length > 3 ? ` and ${data.length - 3} more` : ''));
        
        // Filter out units that should not be shown in the builder
        const visibleUnits = data
          .filter((unit: any) => {
            // Make sure characteristics is properly handled as it might be null
            const characteristics = unit.characteristics && typeof unit.characteristics === 'object' ? 
              unit.characteristics as Record<string, any> : {};
            // If showInBuilder is explicitly false, exclude the unit
            // Otherwise include it (undefined or true)
            return characteristics.showInBuilder !== false;
          })
          .map((apiUnit: any) => {
            // Make sure characteristics is properly handled
            const safeCharacteristics = apiUnit.characteristics && 
              typeof apiUnit.characteristics === 'object' ? 
              apiUnit.characteristics as Record<string, any> : {};
              
            const mappedUnit = mapApiUnitToUnit({
              ...apiUnit,
              characteristics: safeCharacteristics,
              faction_display: apiUnit.faction,
            });
            return mappedUnit;
          });
        
        console.log(`[useArmyBuilderUnits] Found ${visibleUnits.length} units for faction ${selectedFaction} in database`);
        
        // Cache the result in localStorage for faster access
        try {
          localStorage.setItem(`units_${selectedFaction}`, JSON.stringify(visibleUnits));
        } catch (e) {
          console.error('[useArmyBuilderUnits] Failed to cache units in localStorage:', e);
        }
        
        return visibleUnits;
      } catch (error) {
        console.warn(`[useArmyBuilderUnits] Database fetch failed, trying localStorage and fallback...`, error);
        
        // Try to get units from localStorage cache first
        try {
          const cachedUnits = localStorage.getItem(`units_${selectedFaction}`);
          if (cachedUnits) {
            try {
              const units = JSON.parse(cachedUnits);
              console.log(`[useArmyBuilderUnits] Using ${units.length} cached units from localStorage for ${selectedFaction}`);
              return units;
            } catch (parseError) {
              console.error('[useArmyBuilderUnits] Failed to parse cached units:', parseError);
              // Continue to fallback if parsing fails
            }
          }
        } catch (e) {
          console.error('[useArmyBuilderUnits] Failed to retrieve cached units:', e);
        }
        
        console.log(`[useArmyBuilderUnits] Using fallback unit data from local factions for: ${selectedFaction}`);
        
        // Import directly from the faction-specific file based on the selected faction
        try {
          if (selectedFaction === 'northern-tribes') {
            console.log('[useArmyBuilderUnits] Loading northern-tribes units from static import');
            const { northernTribesUnits } = await import('@/data/factions/northern-tribes');
            return northernTribesUnits;
          } else if (selectedFaction === 'hegemony-of-embersig') {
            console.log('[useArmyBuilderUnits] Loading hegemony-of-embersig units from static import');
            const { hegemonyOfEmbersigUnits } = await import('@/data/factions/hegemony-of-embersig');
            return hegemonyOfEmbersigUnits;
          } else if (selectedFaction === 'scions-of-yaldabaoth') {
            console.log('[useArmyBuilderUnits] Loading scions-of-yaldabaoth units from static import');
            const { scionsOfYaldabaothUnits } = await import('@/data/factions/scions-of-yaldabaoth');
            return scionsOfYaldabaothUnits;
          } else if (selectedFaction === 'syenann') {
            console.log('[useArmyBuilderUnits] Loading syenann units from static import');
            const { syenannUnits } = await import('@/data/factions/syenann');
            return syenannUnits;
          }
        
          // Fallback to full unit list and filter by faction
          console.log('[useArmyBuilderUnits] Loading units from global fallback');
          const { units } = await import('@/data/factions');
          return selectedFaction === 'all' ? units : units.filter(unit => unit.faction === selectedFaction);
        } catch (importError) {
          console.error(`[useArmyBuilderUnits] Failed to import faction units:`, importError);
          // Final fallback to the global units array
          console.log('[useArmyBuilderUnits] Using last resort global units fallback');
          const { units } = await import('@/data/factions');
          return selectedFaction === 'all' ? units : units.filter(unit => unit.faction === selectedFaction);
        }
      }
    },
    retry: 0, // No retries to speed up fallback to static files
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
