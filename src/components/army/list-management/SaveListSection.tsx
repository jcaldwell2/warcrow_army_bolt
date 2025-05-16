
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, CloudUpload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

interface SaveListSectionProps {
  listName: string;
  onListNameChange: (name: string) => void;
  onSaveList: () => void;
  selectedUnits: any[];
  selectedFaction: string;
  refreshSavedLists?: () => void;
}

const SaveListSection = ({ 
  listName, 
  onListNameChange, 
  onSaveList,
  selectedUnits,
  selectedFaction,
  refreshSavedLists
}: SaveListSectionProps) => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleCloudSave = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to use cloud save");
      return;
    }

    if (!listName.trim()) {
      toast.error("Please enter a list name before saving");
      return;
    }
    
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication error. Please try logging in again.");
        return;
      }

      // First, fetch the user's profile to get their WAB ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('wab_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error("Failed to retrieve your WAB ID");
        return;
      }

      const wab_id = profileData?.wab_id;
      
      if (!wab_id) {
        toast.error("Your profile doesn't have a WAB ID assigned");
        return;
      }

      console.log(`Saving list with WAB ID: ${wab_id}`);
      
      // Insert the data, handling possible errors
      const { data, error } = await supabase
        .from('army_lists')
        .insert({
          name: listName,
          faction: selectedFaction,
          units: selectedUnits,
          user_id: user.id,
          wab_id: wab_id
        })
        .select();

      if (error) {
        console.error('Error saving to cloud:', error);
        throw error;
      }

      console.log("List saved successfully:", data);
      toast.success("List saved to cloud successfully!");
      
      // Update the local state like local save does
      onSaveList();
      
      // Call the refreshSavedLists function if it exists to update the saved lists
      if (refreshSavedLists) {
        setTimeout(() => {
          refreshSavedLists();
        }, 500);
      }
    } catch (error) {
      console.error('Error saving to cloud:', error);
      toast.error("Failed to save list to cloud");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
      <Input
        placeholder={t('enterListName')}
        value={listName}
        onChange={(e) => onListNameChange(e.target.value)}
        className="flex-1 bg-warcrow-background text-warcrow-text border-warcrow-accent focus:border-warcrow-gold order-1 md:order-3"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSaveList}
              className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black whitespace-nowrap order-2 md:order-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {t('saveListLocally')}
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-warcrow-background border-warcrow-accent text-warcrow-text"
            side="bottom"
          >
            Save list to your browser's local storage
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleCloudSave}
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed order-3 md:order-2"
              disabled={!isAuthenticated || isSaving}
            >
              <CloudUpload className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : t('cloudSave')}
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-warcrow-background border-warcrow-accent text-warcrow-text"
            side="bottom"
          >
            {isAuthenticated ? 'Save list to the cloud' : 'Login required to use cloud features'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SaveListSection;
