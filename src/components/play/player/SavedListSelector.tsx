
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { SavedList } from '@/types/army';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SavedListSelectorProps {
  savedLists: SavedList[];
  playerWabId: string;
  isLoadingSavedLists: boolean;
  onSelectList: (listId: string) => void;
}

const SavedListSelector: React.FC<SavedListSelectorProps> = ({
  savedLists,
  playerWabId,
  isLoadingSavedLists,
  onSelectList
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      setIsAuthenticated(event !== 'SIGNED_OUT');
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="bg-warcrow-accent rounded-lg p-4">
      <Label className="text-lg font-semibold text-warcrow-gold mb-4 block">Saved Army Lists</Label>
      {isLoadingSavedLists ? (
        <div className="flex items-center text-warcrow-text space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-xs text-muted-foreground">Loading lists...</p>
        </div>
      ) : savedLists.length > 0 ? (
        <Select onValueChange={onSelectList}>
          <SelectTrigger className="w-full mt-1 bg-warcrow-background border-warcrow-gold text-warcrow-text">
            <SelectValue placeholder="Select a saved list" />
          </SelectTrigger>
          <SelectContent className="bg-warcrow-background border-warcrow-gold max-h-72 overflow-y-auto">
            {savedLists.map((list) => (
              <SelectItem 
                key={list.id} 
                value={list.id}
                className="text-warcrow-gold font-medium hover:bg-warcrow-gold/10"
              >
                {list.name} ({list.faction})
                {list.user_id && <span className="ml-2 text-xs text-blue-400">(Cloud)</span>}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="text-xs text-muted-foreground mt-1">
          {isAuthenticated 
            ? "No saved lists available. Create and save a list first." 
            : "Sign in to access your cloud lists."}
          {playerWabId ? ` WAB ID: ${playerWabId.slice(0, 8)}...` : ""}
        </p>
      )}
    </div>
  );
};

export default SavedListSelector;
