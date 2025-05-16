
import { useState, useEffect } from "react";
import { SavedList } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import NewListButton from "./army/list-management/NewListButton";
import SaveListSection from "./army/list-management/SaveListSection";
import CurrentListDisplay from "./army/list-management/CurrentListDisplay";
import SavedListsSection from "./army/list-management/SavedListsSection";
import { useAuth } from "@/components/auth/AuthProvider";

interface ListManagementProps {
  listName: string;
  currentListName: string | null;
  onListNameChange: (name: string) => void;
  onSaveList: () => void;
  onLoadList: (list: SavedList) => void;
  onNewList: () => void;
  savedLists: SavedList[];
  selectedFaction: string;
  selectedUnits: any[]; // Using any[] for now since we don't have the type
}

const ListManagement = ({
  listName,
  currentListName,
  onListNameChange,
  onSaveList,
  onLoadList,
  onNewList,
  savedLists,
  selectedFaction,
  selectedUnits,
}: ListManagementProps) => {
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [localSavedLists, setLocalSavedLists] = useState<SavedList[]>(savedLists);
  const { isAuthenticated } = useAuth();

  // Refresh lists when authentication state changes or component mounts
  useEffect(() => {
    if (isAuthenticated !== null) {
      refreshSavedLists();
    }
  }, [isAuthenticated]);

  // Update local lists when savedLists prop changes
  useEffect(() => {
    setLocalSavedLists(savedLists);
  }, [savedLists]);

  const refreshSavedLists = async () => {
    try {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log("Fetching cloud lists for authenticated user:", user.id);
        
        // Fetch updated lists from Supabase
        const { data: cloudLists, error } = await supabase
          .from('army_lists')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching lists:', error);
          return;
        }

        // Get local lists from localStorage
        const localLists: SavedList[] = JSON.parse(localStorage.getItem('armyLists') || '[]');
        
        // Combine cloud and local lists, with cloud lists taking precedence
        const combinedLists = [...localLists];
        
        // Add cloud lists that don't already exist in local lists
        if (cloudLists) {
          cloudLists.forEach(cloudList => {
            // Parse units properly to ensure they're the correct SelectedUnit[] type
            const parsedUnits = Array.isArray(cloudList.units) 
              ? cloudList.units 
              : (typeof cloudList.units === 'string' 
                  ? JSON.parse(cloudList.units) 
                  : []);
                  
            // Convert the units from JSON to SelectedUnit array
            const processedList: SavedList = {
              id: cloudList.id,
              name: cloudList.name,
              faction: cloudList.faction,
              units: parsedUnits,
              created_at: cloudList.created_at,
              user_id: cloudList.user_id,
              wab_id: cloudList.wab_id
            };
            
            const index = combinedLists.findIndex(list => 
              list.name === processedList.name && list.faction === processedList.faction
            );
            
            if (index !== -1) {
              // Update existing entry
              combinedLists[index] = processedList;
            } else {
              // Add new entry
              combinedLists.push(processedList);
            }
          });
        }
        
        console.log("Refreshed lists:", {
          localCount: localLists.length,
          cloudCount: cloudLists?.length || 0,
          combinedCount: combinedLists.length
        });
        
        setLocalSavedLists(combinedLists);
      } else {
        // If not authenticated, just use local lists
        const localLists: SavedList[] = JSON.parse(localStorage.getItem('armyLists') || '[]');
        setLocalSavedLists(localLists);
      }
    } catch (error) {
      console.error('Error refreshing lists:', error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    const listToRemove = savedLists.find((list) => list.id === listId);
    if (!listToRemove) return;
    
    try {
      // Get all lists with the same name
      const listsWithSameName = savedLists.filter((list) => list.name === listToRemove.name);
      
      // Delete cloud saves
      const cloudLists = listsWithSameName.filter(list => list.user_id);
      if (cloudLists.length > 0) {
        const { error } = await supabase
          .from('army_lists')
          .delete()
          .in('id', cloudLists.map(list => list.id));

        if (error) {
          console.error('Error deleting from cloud:', error);
          toast.error("Failed to delete lists from cloud");
          return;
        }
      }
      
      // Update local storage by removing all lists with the same name
      const updatedLists = savedLists.filter((list) => list.name !== listToRemove.name);
      localStorage.setItem("armyLists", JSON.stringify(updatedLists));
      
      // Show success message
      toast.success("Lists deleted successfully");
      
      // Close the delete dialog
      setListToDelete(null);
      
      // Update the local state instead of refreshing the page
      setLocalSavedLists(updatedLists);
    } catch (error) {
      console.error('Error during list deletion:', error);
      toast.error("An error occurred while deleting the lists");
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col gap-4 w-full">
        <NewListButton onNewList={onNewList} />
        <SaveListSection
          listName={listName}
          onListNameChange={onListNameChange}
          onSaveList={onSaveList}
          selectedUnits={selectedUnits}
          selectedFaction={selectedFaction}
          refreshSavedLists={refreshSavedLists}
        />
        <CurrentListDisplay currentListName={currentListName} />
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 md:hidden w-full">
        <NewListButton onNewList={onNewList} />
        <div className="bg-warcrow-accent rounded-lg p-4 w-full">
          <SaveListSection
            listName={listName}
            onListNameChange={onListNameChange}
            onSaveList={onSaveList}
            selectedUnits={selectedUnits}
            selectedFaction={selectedFaction}
            refreshSavedLists={refreshSavedLists}
          />
          <div className="mt-2">
            <CurrentListDisplay currentListName={currentListName} />
          </div>
        </div>
      </div>

      <SavedListsSection
        savedLists={localSavedLists.length > 0 ? localSavedLists : savedLists}
        selectedFaction={selectedFaction}
        onLoadList={onLoadList}
        onDeleteClick={(listId) => setListToDelete(listId)}
      />

      <AlertDialog open={!!listToDelete} onOpenChange={() => setListToDelete(null)}>
        <AlertDialogContent className="bg-warcrow-background border-warcrow-accent">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-gold">Delete List</AlertDialogTitle>
            <AlertDialogDescription className="text-warcrow-text">
              Are you sure you want to delete this list? This will delete all versions of lists with this name. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-warcrow-background border-warcrow-accent text-warcrow-text hover:bg-warcrow-accent hover:text-warcrow-text"
              onClick={() => setListToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                if (listToDelete) {
                  handleDeleteList(listToDelete);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListManagement;
