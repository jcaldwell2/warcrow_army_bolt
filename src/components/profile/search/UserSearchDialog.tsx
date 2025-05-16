
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserSearchForm } from "./UserSearchForm";
import { UserSearchResults } from "./UserSearchResults";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  username: string | null;
  wab_id: string;
  avatar_url: string | null;
}

interface UserSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSearchDialog = ({ isOpen, onClose }: UserSearchDialogProps) => {
  const { t } = useLanguage();
  const [pendingFriends, setPendingFriends] = useState<Record<string, boolean>>({});
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching, 
    searchUsers 
  } = useUserSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    try {
      await searchUsers(searchQuery);
      
      if (searchResults.length === 0) {
        toast.info(t('noResults'), {
          description: t('tryDifferent'),
          position: "top-right"
        });
      } else {
        const countMessage = searchResults.length > 1 ? 
          t('foundUsersPlural').replace('{count}', String(searchResults.length)) : 
          t('foundUsers').replace('{count}', String(searchResults.length));
          
        toast.success(countMessage, {
          position: "top-right",
          duration: 2000
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/90 border-warcrow-gold text-warcrow-text">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">{t('findFriends')}</DialogTitle>
        </DialogHeader>
        
        <UserSearchForm 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isSearching={isSearching}
        />
        
        <UserSearchResults 
          searchResults={searchResults}
          isSearching={isSearching}
          pendingFriends={pendingFriends}
          setPendingFriends={setPendingFriends}
        />
      </DialogContent>
    </Dialog>
  );
};
