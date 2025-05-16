
import { ReactNode, useEffect } from "react";
import ProfileContext from "@/context/ProfileContext";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileRealtime } from "@/hooks/useProfileRealtime";
import { toast } from "sonner";

export { useProfileContext } from "@/context/ProfileContext";

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const profileData = useProfileData();
  
  // Configure real-time subscriptions only if we have a profile ID that's not the preview ID
  const profileId = profileData.profile?.id || null;
  const isPreviewMode = profileId === "preview-user-id";
    
  // Pass both the profile ID and whether this is preview mode
  const { isInitialized } = useProfileRealtime(profileId, isPreviewMode);

  // Check for WAB ID
  useEffect(() => {
    if (profileData.profile && !profileData.profile.wab_id && !isPreviewMode) {
      console.error("ProfileDataProvider - WAB ID is missing from profile data:", profileData.profile);
      // Don't show toast here now since we'll generate it in useProfileData
    }
  }, [profileData.profile, isPreviewMode]);

  // Log the initialization state for debugging
  console.log("ProfileDataProvider - realtime subscriptions initialized:", isInitialized, 
              "Profile ID:", profileId,
              "WAB ID present:", !!profileData.profile?.wab_id,
              "Notifications enabled:", !isPreviewMode && isInitialized);

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};
