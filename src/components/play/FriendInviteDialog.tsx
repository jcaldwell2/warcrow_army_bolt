import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Friend } from '@/hooks/useFriends';
import { Loader2, UserPlus, Check } from 'lucide-react';
import { inviteFriendToGame } from '@/utils/joinCodeUtils';
import { toast } from 'sonner';

interface FriendInviteDialogProps {
  gameId: string;
  playerName: string;
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  isLoading: boolean;
}

const FriendInviteDialog: React.FC<FriendInviteDialogProps> = ({ 
  gameId, 
  playerName,
  isOpen, 
  onClose, 
  friends, 
  isLoading 
}) => {
  const [invitingFriendIds, setInvitingFriendIds] = useState<Record<string, boolean>>({});
  
  // Reset inviting state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setInvitingFriendIds({});
    }
  }, [isOpen]);
  
  const handleInviteFriend = async (friend: Friend) => {
    // Mark this friend as being invited (for loading state)
    setInvitingFriendIds(prev => ({ ...prev, [friend.id]: true }));
    
    try {
      // Send the invitation
      const success = await inviteFriendToGame(friend.id, gameId, playerName);
      
      if (success) {
        toast.success(`Invitation sent to ${friend.username || 'friend'}`);
      }
    } catch (err) {
      console.error("Error inviting friend:", err);
      toast.error(`Failed to invite ${friend.username || 'friend'}`);
    } finally {
      // Keep the inviting state for UI feedback
      // We don't reset it to show which friends have been invited
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-warcrow-background border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">Invite Friends to Join</DialogTitle>
          <DialogDescription className="text-warcrow-text/90">
            Select friends to invite to your current game.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-warcrow-gold animate-spin" />
            <span className="ml-2 text-warcrow-text">Loading friends...</span>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-6 text-warcrow-text/80">
            <UserPlus className="h-12 w-12 mx-auto mb-2 text-warcrow-gold/60" />
            <p>You don't have any friends to invite yet.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[300px] pr-4">
            <div className="space-y-2">
              {friends.map(friend => (
                <div 
                  key={friend.id}
                  className="flex items-center justify-between p-3 rounded-md bg-warcrow-accent/30 border border-warcrow-gold/20"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-warcrow-gold/30">
                      {friend.avatar_url ? (
                        <AvatarImage src={friend.avatar_url} alt={friend.username || 'Friend'} />
                      ) : null}
                      <AvatarFallback className="bg-warcrow-accent text-warcrow-gold">
                        {(friend.username || 'F').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-warcrow-text">
                        {friend.username || 'Unknown Friend'}
                      </div>
                      {friend.wab_id && (
                        <div className="text-xs text-warcrow-text/70">
                          {friend.wab_id}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleInviteFriend(friend)}
                    disabled={!!invitingFriendIds[friend.id]}
                    className={invitingFriendIds[friend.id] 
                      ? "bg-warcrow-gold/50 text-warcrow-background" 
                      : "bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/80"
                    }
                  >
                    {invitingFriendIds[friend.id] ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Invited
                      </>
                    ) : (
                      'Invite'
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FriendInviteDialog;
