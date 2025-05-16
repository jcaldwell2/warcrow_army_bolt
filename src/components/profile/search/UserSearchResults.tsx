import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { ProfileAvatar } from "../ProfileAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfileSession } from "@/hooks/useProfileSession";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  username: string | null;
  wab_id: string;
  avatar_url: string | null;
}

interface UserSearchResultsProps {
  searchResults: SearchResult[];
  isSearching: boolean;
  pendingFriends: Record<string, boolean>;
  setPendingFriends: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const UserSearchResults = ({ 
  searchResults, 
  isSearching, 
  pendingFriends,
  setPendingFriends
}: UserSearchResultsProps) => {
  const { t } = useLanguage();
  const { userId: currentUserId } = useProfileSession();

  const sendFriendRequest = async (recipientId: string, username: string | null) => {
    if (!currentUserId) return;
    
    try {
      setPendingFriends(prev => ({ ...prev, [recipientId]: true }));
      
      // Check if friendship already exists
      const { data: checkResult, error: checkError } = await supabase
        .from("friendships")
        .select()
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // Store the result in a local variable to avoid scope issues
      const existingFriendship = checkResult;
      
      if (existingFriendship) {
        toast.info(t('alreadyFriends'), {
          description: t('friendRequestExisting'),
          position: "top-right"
        });
        return;
      }
      
      // Send friend request
      const { error: insertError } = await supabase
        .from("friendships")
        .insert({
          sender_id: currentUserId,
          recipient_id: recipientId,
          status: "pending"
        });
      
      if (insertError) throw insertError;
      
      // Create notification
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: recipientId,
          sender_id: currentUserId,
          type: "friend_request",
          content: { message: "sent you a friend request" }
        });
      
      if (notificationError) throw notificationError;
      
      toast.success(t('requestSent'), {
        description: t('requestSentTo').replace('{username}', username || t('anonymous')),
        position: "top-right"
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error(t('failedToSend'), {
        position: "top-right"
      });
    } finally {
      // Keep the button disabled after successful request
      setTimeout(() => {
        setPendingFriends(prev => ({ ...prev, [recipientId]: false }));
      }, 2000);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {searchResults.length === 0 ? (
        <p className="text-warcrow-text/60 text-center">
          {isSearching ? t('searching') : t('noResults')}
        </p>
      ) : (
        searchResults.map((user) => (
          <div key={user.id} className="flex items-center justify-between bg-black/50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <ProfileAvatar 
                avatarUrl={user.avatar_url} 
                username={user.username || user.wab_id}
                isEditing={false}
                onAvatarUpdate={() => {}}
                size="sm"
              />
              <div>
                <div className="font-medium">{user.username || t('anonymous')}</div>
                <div className="text-sm text-warcrow-gold/60">{user.wab_id}</div>
              </div>
            </div>
            <Button 
              onClick={() => sendFriendRequest(user.id, user.username)}
              size="sm"
              disabled={pendingFriends[user.id]}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {pendingFriends[user.id] ? t('sent') : t('addFriend')}
            </Button>
          </div>
        ))
      )}
    </div>
  );
};
