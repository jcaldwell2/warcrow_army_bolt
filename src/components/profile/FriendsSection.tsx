
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, UserPlus, UserMinus, GamepadIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from '@/hooks/use-mobile';
import { useFriends } from '@/hooks/useFriends';
import { useProfileContext } from './ProfileData';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfileSession } from '@/hooks/useProfileSession';
import { FriendProfileDialog } from './FriendProfileDialog';
import { inviteFriendToGame } from '@/utils/joinCodeUtils';

interface Friend {
  id: string;
  username: string | null;
  avatar_url: string | null;
  friendship_id: string;
}

interface FriendsSectionProps {
  userId: string;
  isCompact?: boolean;
}

export const FriendsSection: React.FC<FriendsSectionProps> = ({ userId, isCompact = false }) => {
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [showFriendProfile, setShowFriendProfile] = useState(false);
  const [invitingFriendIds, setInvitingFriendIds] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const { profile } = useProfileContext();
  const { userId: currentUserId } = useProfileSession();
  
  const { 
    friends, 
    isLoading, 
    sendFriendRequest, 
    unfriend,
    acceptFriendRequest,
    rejectFriendRequest
  } = useFriends(userId);

  const friendIds = friends.map(friend => friend.id);
  
  const trackedIds = [...friendIds];
  if (currentUserId) {
    trackedIds.push(currentUserId);
  }
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const { onlineStatus } = useOnlineStatus(trackedIds);

  useEffect(() => {
    if (profile && userId) {
      setIsCurrentUser(profile.id === userId);
    }
  }, [profile, userId]);

  const refreshFriends = () => {
    setRefreshTrigger(prev => prev + 1);
    window.location.reload();
    toast.success("Refreshing friends list");
  };

  const handleAddFriend = async () => {
    if (!profile) {
      toast.error("You must be logged in to add friends.");
      return;
    }
    
    try {
      await sendFriendRequest(userId);
      toast.success("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request.");
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (!profile) {
      toast.error("You must be logged in to remove friends.");
      return;
    }
    
    try {
      await unfriend(friendshipId);
      toast.success("Friend removed successfully.");
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend.");
    }
  };

  const handleFriendClick = (friendId: string) => {
    setSelectedFriendId(friendId);
    setShowFriendProfile(true);
  };

  const handleInviteToGame = async (friend: Friend) => {
    if (!profile) {
      toast.error("You must be logged in to invite friends to a game.");
      return;
    }

    setInvitingFriendIds(prev => ({ ...prev, [friend.id]: true }));
    
    try {
      const gameId = 'profile-invite-' + Date.now(); 
      const senderName = profile.username || 'A player';
      
      const success = await inviteFriendToGame(friend.id, gameId, senderName);
      
      if (success) {
        toast.success(`Invitation sent to ${friend.username || 'friend'}`);
      } else {
        toast.error(`Failed to invite ${friend.username || 'friend'}`);
      }
    } catch (err) {
      console.error("Error inviting friend to game:", err);
      toast.error(`Failed to invite ${friend.username || 'friend'}`);
    } finally {
      setTimeout(() => {
        setInvitingFriendIds(prev => ({ ...prev, [friend.id]: false }));
      }, 2000);
    }
  };

  const getListHeight = () => {
    if (isCompact) {
      const baseHeight = isMobile ? 240 : 320;
      return {
        maxHeight: `${baseHeight}px`,
        contentHeight: friends.length <= 10 ? 'auto' : `${isMobile ? 220 : 300}px`
      };
    } else {
      return {
        maxHeight: 'none',
        contentHeight: friends.length <= 10 ? 'auto' : '400px'
      };
    }
  };

  const { maxHeight, contentHeight } = getListHeight();

  useEffect(() => {
    if (currentUserId) {
      console.log("Current user online status:", currentUserId, onlineStatus[currentUserId]);
    }
    if (friends.length > 0) {
      console.log("Friend online statuses:", 
        friends.map(f => ({ id: f.id, username: f.username, isOnline: onlineStatus[f.id] }))
      );
    }
  }, [onlineStatus, currentUserId, friends, refreshTrigger]);

  return (
    <>
      <div className={`bg-black/50 backdrop-filter backdrop-blur-sm rounded-lg p-3 border border-warcrow-gold/10 relative`} style={{ maxHeight }}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-warcrow-gold font-medium text-sm md:text-base">
            Friends {friends.length > 0 && `(${friends.length})`}
          </h3>
          <div className="flex gap-1 md:gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-warcrow-gold h-7 px-2 py-1 text-xs"
              onClick={refreshFriends}
            >
              <RefreshCw className="h-3 w-3" />
              {!isMobile && <span className="ml-1">Refresh</span>}
            </Button>

            {!isCurrentUser && profile && (
              <Button
                variant="outline"
                size="sm"
                className="bg-green-600 text-white hover:bg-green-500 hover:text-white border-green-500 h-7 px-2 py-1 text-xs"
                onClick={handleAddFriend}
              >
                <UserPlus className="h-3 w-3" />
                {!isMobile && <span className="ml-1">Add</span>}
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" />
                  <Skeleton className="h-2 md:h-4 w-[60px] md:w-[80px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className={contentHeight !== 'auto' ? `h-[${contentHeight}]` : ''}>
            <ul className="space-y-2 pr-2">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <li 
                    key={friend.id} 
                    className="flex items-center justify-between group"
                  >
                    <div 
                      className="flex items-center space-x-2 flex-1 cursor-pointer hover:bg-black/30 p-1 rounded-md transition-colors"
                      onClick={() => handleFriendClick(friend.id)}
                    >
                      <div className="relative">
                        <img src={friend.avatar_url || "/images/user.png"} alt={friend.username || ''} className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
                        <span 
                          className={`absolute bottom-0 right-0 h-2 w-2 md:h-3 md:w-3 rounded-full border border-black ${
                            onlineStatus[friend.id] ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-warcrow-gold text-xs md:text-sm group-hover:underline">{friend.username}</div>
                        <div className="text-[10px] md:text-xs text-warcrow-text/70">
                          {onlineStatus[friend.id] ? 'Online' : 'Offline'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {isCurrentUser && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white border-blue-500/70 h-7 px-2 py-1 text-xs"
                            onClick={() => handleInviteToGame(friend)}
                            disabled={!!invitingFriendIds[friend.id]}
                          >
                            {invitingFriendIds[friend.id] ? (
                              "Invited"
                            ) : (
                              <span className="flex items-center">
                                <GamepadIcon className="h-3 w-3" />
                              </span>
                            )}
                          </Button>
                        
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-500 hover:text-white border-red-500/70 h-7 px-2 py-1 text-xs"
                            onClick={() => handleRemoveFriend(friend.friendship_id)}
                          >
                            <UserMinus className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-warcrow-text/70 text-xs md:text-sm">No friends yet.</li>
              )}
            </ul>
          </ScrollArea>
        )}
      </div>

      <FriendProfileDialog 
        friendId={selectedFriendId}
        isOpen={showFriendProfile}
        onClose={() => setShowFriendProfile(false)}
      />
    </>
  );
};
