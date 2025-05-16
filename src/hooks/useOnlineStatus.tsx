
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileSession } from "@/hooks/useProfileSession";
import { toast } from "sonner";

export type OnlineStatus = {
  [userId: string]: boolean;
};

export const useOnlineStatus = (userIds: string[]) => {
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>({});
  const { userId } = useProfileSession();
  const currentUserId = userId;
  
  // Function to update presence - defined outside useEffect to use in multiple places
  const updatePresence = useCallback(async (channel: any, userId: string) => {
    if (!userId || userId === "preview-user-id") return;
    
    try {
      await channel.track({
        user_id: userId,
        online_at: new Date().toISOString(),
      });
      console.log("Updated presence for user:", userId);
      
      // Update local state to reflect that current user is online
      setOnlineStatus(prev => ({
        ...prev,
        [userId]: true
      }));
    } catch (err) {
      console.error("Error updating presence:", err);
    }
  }, []);
  
  // Track current user's online status
  useEffect(() => {
    if (!currentUserId || currentUserId === "preview-user-id") return;
    
    console.log("Setting up presence tracking for current user:", currentUserId);
    
    // Use a global channel name for better presence sharing
    const channelName = 'online-users-tracker';
    const channel = supabase.channel(channelName);
    
    // Subscribe to the channel
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to presence channel: ${channelName}`);
        
        // Initially set the user's status when subscribed
        await updatePresence(channel, currentUserId);
        
        // Update presence more frequently to ensure status is accurately reflected
        const interval = setInterval(() => updatePresence(channel, currentUserId), 3000);
        
        // Handle visibility changes (tab switching)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            console.log("Document visible, updating presence");
            updatePresence(channel, currentUserId);
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Handle online/offline browser events
        const handleOnline = () => {
          console.log("Browser went online, updating presence");
          updatePresence(channel, currentUserId);
          toast.success("You're back online", { id: "connection-status" });
        };
        
        const handleOffline = () => {
          console.log("Browser went offline");
          toast.error("You're offline", { id: "connection-status" });
        };
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
          clearInterval(interval);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    });
    
    return () => {
      console.log(`Cleaning up presence tracking for ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [currentUserId, updatePresence]);
  
  // Listen for online status of all requested userIds
  useEffect(() => {
    if (userIds.length === 0) return;
    
    // Filter out invalid IDs
    const validUserIds = userIds.filter(id => id && id !== "preview-user-id");
    if (validUserIds.length === 0) return;
    
    console.log("Monitoring online status for users:", validUserIds);
    
    const channelName = 'online-users-tracker';
    const channel = supabase.channel(channelName);
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        console.log("Presence state updated:", presenceState);
        
        // Create a new status object based on presence data
        const newStatus: OnlineStatus = {};
        
        // Set default status to false for all users we're tracking
        validUserIds.forEach(id => {
          newStatus[id] = false;
        });
        
        // Loop through all presence state entries
        Object.entries(presenceState).forEach(([_, presences]) => {
          const presenceArray = presences as Array<any>;
          
          presenceArray.forEach(presence => {
            if (presence.user_id && validUserIds.includes(presence.user_id)) {
              newStatus[presence.user_id] = true;
            }
          });
        });
        
        // Always show current user as online when they're included in tracking
        if (currentUserId && validUserIds.includes(currentUserId)) {
          newStatus[currentUserId] = true;
        }
        
        console.log("Updated online statuses:", newStatus);
        
        setOnlineStatus(prev => ({
          ...prev,
          ...newStatus
        }));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        
        if (!newPresences || newPresences.length === 0) return;
        
        newPresences.forEach(presence => {
          const presenceUserId = presence.user_id;
          
          if (presenceUserId && validUserIds.includes(presenceUserId)) {
            console.log(`Setting ${presenceUserId} as online from join event`);
            setOnlineStatus(prev => ({
              ...prev,
              [presenceUserId]: true
            }));
          }
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        
        if (!leftPresences || leftPresences.length === 0) return;
        
        // Use a shorter timeout for marking users as offline
        leftPresences.forEach(presence => {
          const presenceUserId = presence.user_id;
          
          // Never mark current user as offline
          if (presenceUserId === currentUserId) return;
          
          if (presenceUserId && validUserIds.includes(presenceUserId)) {
            // Set a timeout to mark user as offline after a delay
            setTimeout(() => {
              // Check if they've rejoined before marking offline
              const presenceState = channel.presenceState();
              let stillOnline = false;
              
              // Check all presence entries to see if the user has rejoined
              Object.values(presenceState).forEach((presences: any) => {
                if (presences.some((p: any) => p.user_id === presenceUserId)) {
                  stillOnline = true;
                }
              });
              
              if (!stillOnline && presenceUserId !== currentUserId) {
                console.log(`Marking ${presenceUserId} as offline after delay`);
                setOnlineStatus(prev => ({
                  ...prev,
                  [presenceUserId]: false
                }));
              }
            }, 5000); // Reduced to 5 seconds for quicker status updates
          }
        });
      })
      .subscribe();
    
    // If current user is in the list, ensure they show as online immediately
    if (currentUserId && validUserIds.includes(currentUserId)) {
      console.log("Setting current user as online immediately:", currentUserId);
      setOnlineStatus(prev => ({
        ...prev,
        [currentUserId]: true
      }));
      
      // Also track the current user's presence to broadcast to others
      updatePresence(channel, currentUserId);
    }
    
    return () => {
      console.log("Removing presence channel");
      supabase.removeChannel(channel);
    };
  }, [userIds, currentUserId, updatePresence]);
  
  return { onlineStatus };
};
