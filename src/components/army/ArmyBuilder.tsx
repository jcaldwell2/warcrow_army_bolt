
import { useState, useCallback, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { SavedList } from "@/types/army";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

interface ArmyBuilderProps {
  session: Session | null;
}

const ArmyBuilder = ({ session }: ArmyBuilderProps) => {
  const location = useLocation();
  const { isGuest } = useAuth();
  const [selectedFaction, setSelectedFaction] = useState(() => {
    // Try to get the faction from localStorage first
    const savedFaction = localStorage.getItem("warcrow_last_faction");
    const state = location.state as { selectedFaction?: string; loadList?: SavedList };
    
    // Priority: 1. Navigation state, 2. localStorage, 3. Default
    return state?.selectedFaction || savedFaction || "northern-tribes";
  });
  
  const state = location.state as { selectedFaction?: string; loadList?: SavedList };

  useEffect(() => {
    // If we have a faction from the navigation state, use it
    if (state?.selectedFaction) {
      setSelectedFaction(state.selectedFaction);
    }
  }, [state]);

  // Log the guest status and authentication for debugging
  useEffect(() => {
    console.log("ArmyBuilder render - Auth status:", { 
      isGuest,
      hasSession: !!session, 
      selectedFaction,
      timestamp: new Date().toISOString()
    });
  }, [isGuest, session, selectedFaction]);

  const handleFactionChange = useCallback((factionId: string) => {
    setSelectedFaction(factionId);
    // Save the selected faction to localStorage
    localStorage.setItem("warcrow_last_faction", factionId);
  }, []);

  return (
    <div className="space-y-4 md:space-y-8 px-2 md:px-4">
      <div className="hidden md:block">
        <FactionSelector
          selectedFaction={selectedFaction}
          onFactionChange={handleFactionChange}
        />
      </div>

      <ArmyList
        selectedFaction={selectedFaction}
        onFactionChange={handleFactionChange}
        initialList={state?.loadList}
      />
    </div>
  );
};

export default ArmyBuilder;
