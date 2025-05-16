
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

export const useFriendProfileFetch = (friendId: string | null) => {
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["friend-profile", friendId],
    queryFn: async () => {
      if (!friendId) return null;
      
      console.log("Fetching friend profile data for:", friendId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", friendId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching friend profile:", error);
        throw error;
      }
      
      // Log friend WAB ID to verify it's present
      console.log("Friend profile data with WAB ID:", data?.wab_id);
      
      if (!data?.wab_id) {
        console.warn("No WAB ID found in friend profile data. This may indicate a database issue.");
      }
      
      // Cast the data to the Profile type, ensuring all fields are present or null
      return {
        id: data.id,
        username: data.username,
        bio: data.bio,
        location: data.location,
        favorite_faction: data.favorite_faction,
        social_discord: data.social_discord,
        social_twitter: data.social_twitter,
        social_instagram: data.social_instagram,
        social_youtube: data.social_youtube,
        social_twitch: data.social_twitch,
        avatar_url: data.avatar_url,
        wab_id: data.wab_id,
        games_won: data.games_won,
        games_lost: data.games_lost
      } as Profile;
    },
    enabled: !!friendId,
    staleTime: 60000, // Cache friend profile data for 1 minute
  });

  return { profile, isLoading, isError, error };
};
