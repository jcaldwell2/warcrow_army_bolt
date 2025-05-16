import { ProfileDataProvider, useProfileContext } from "@/components/profile/ProfileData";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LoadingScreen } from "@/components/profile/LoadingScreen";
import { toast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useFriends } from "@/hooks/useFriends";
import { useProfileSession } from "@/hooks/useProfileSession";

const ProfileWithData = () => {
  const { isLoading, profile, error } = useProfileContext();
  const { userId: sessionUserId } = useProfileSession();
  
  // Get the current user ID and any friend IDs to track
  const currentUserId = profile?.id || null;
  
  // Get friends list to track online status
  const { friends } = useFriends(currentUserId || '');
  
  // Create a list of IDs to track online status for (current user + friends)
  const idsToTrack = useMemo(() => {
    if (!currentUserId) return [];
    
    // Always include the session user to ensure we track our own status
    const userIds = new Set([currentUserId]);
    
    // Add sessionUserId if different from profile ID
    if (sessionUserId && sessionUserId !== currentUserId) {
      userIds.add(sessionUserId);
    }
    
    // Track all friends
    friends.forEach(friend => userIds.add(friend.id));
    
    return Array.from(userIds);
  }, [currentUserId, sessionUserId, friends]);
  
  // Initialize online tracking for current user and their friends
  const { onlineStatus } = useOnlineStatus(idsToTrack);
  
  // Log current user's online status for debugging
  useEffect(() => {
    if (currentUserId && onlineStatus) {
      console.log("Current user online status:", { 
        userId: currentUserId, 
        isOnline: onlineStatus[currentUserId] 
      });
    }
    
    if (sessionUserId && onlineStatus) {
      console.log("Session user online status:", { 
        userId: sessionUserId, 
        isOnline: onlineStatus[sessionUserId] 
      });
    }
  }, [currentUserId, sessionUserId, onlineStatus]);
  
  useEffect(() => {
    if (error) {
      console.error("Profile loading error:", error);
      toast({
        title: "Error loading profile",
        description: "There was an error loading your profile data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center">
        <div className="text-warcrow-gold text-xl mb-4">Profile Not Available</div>
        <div className="text-warcrow-text/70 text-center max-w-md px-4">
          Your profile could not be loaded. This may be due to connection issues or account permissions.
        </div>
      </div>
    );
  }

  // Determine which online status to use - prioritize session user if viewing own profile
  const isViewingOwnProfile = sessionUserId === currentUserId;
  const isOnline = isViewingOwnProfile 
    ? true // Always show yourself as online
    : currentUserId ? onlineStatus[currentUserId] || false : false;

  return <ProfileContent isOnline={isOnline} />;
};

const Profile = () => {
  return (
    <ProfileDataProvider>
      <ProfileWithData />
    </ProfileDataProvider>
  );
};

export default Profile;
