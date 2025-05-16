
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from '@/components/auth/AuthProvider';

const DEFAULT_FACTIONS = [
  { id: "northern-tribes", name: "Northern Tribes", name_es: "Tribus del Norte", name_fr: "Tribus du Nord" },
  { id: "hegemony-of-embersig", name: "Hegemony of Embersig", name_es: "Hegemonía de Embersig", name_fr: "Hégémonie d'Embersig" },
  { id: "scions-of-yaldabaoth", name: "Scions of Yaldabaoth", name_es: "Vástagos de Yaldabaoth", name_fr: "Rejetons de Yaldabaoth" },
  { id: "syenann", name: "Sÿenann", name_es: "Syenann", name_fr: "Syenann" }
];

/**
 * Hook to ensure default factions are in the database
 * Only used in admin interfaces to prevent empty faction tables
 */
export function useEnsureDefaultFactions() {
  const [isChecking, setIsChecking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    // Only run this check if the user is authenticated and has admin privileges
    if (!isAuthenticated || !isAdmin || isInitialized) {
      return;
    }

    const checkAndInsertDefaultFactions = async () => {
      setIsChecking(true);
      try {
        console.log("[useEnsureDefaultFactions] Checking if factions exist in database");
        
        // First check if we have any factions
        const { data: existingFactions, error: countError } = await supabase
          .from('factions')
          .select('id');
          
        if (countError) {
          console.error("[useEnsureDefaultFactions] Error checking factions:", countError);
          return;
        }
        
        if (!existingFactions || existingFactions.length === 0) {
          console.log("[useEnsureDefaultFactions] No factions found, inserting defaults");
          
          // No factions exist, insert defaults
          const { error: insertError } = await supabase
            .from('factions')
            .insert(DEFAULT_FACTIONS);
            
          if (insertError) {
            console.error("[useEnsureDefaultFactions] Error inserting default factions:", insertError);
            toast.error("Failed to initialize default factions");
          } else {
            console.log("[useEnsureDefaultFactions] Default factions initialized successfully");
            toast.success("Default factions initialized successfully", {
              duration: 5000,
              id: 'default-factions-inserted'
            });
          }
        } else {
          console.log(`[useEnsureDefaultFactions] Found ${existingFactions.length} existing factions, no need to insert defaults`);
        }
      } catch (error) {
        console.error("[useEnsureDefaultFactions] Error in faction check:", error);
      } finally {
        setIsChecking(false);
        setIsInitialized(true);
      }
    };

    checkAndInsertDefaultFactions();
  }, [isAuthenticated, isAdmin, isInitialized]);

  return { isChecking };
}
