
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface ActivityData {
  list_id: string;
  list_name: string;
  faction: string;
  profile_id?: string; // Added for comment activities
  comment_id?: string; // Added for comment activities
  comment_preview?: string; // Added for comment activities
}

export interface FriendActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: ActivityData;
  created_at: string;
  username?: string;
  avatar_url?: string;
}

export const useFriendActivities = (userId: string) => {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["friend-activities", userId],
    queryFn: async () => {
      console.log("Fetching friend activities for user:", userId);
      
      // If this is a preview user, return empty data
      if (userId === "preview-user-id") {
        return { activities: [], error: null };
      }
      
      // First get the user's friends
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('sender_id, recipient_id')
        .eq('status', 'accepted')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
        
      if (friendshipsError) {
        console.error("Error fetching friendships:", friendshipsError);
        throw friendshipsError;
      }
      
      // Extract friend IDs
      const friendIds = friendships.map(friendship => 
        friendship.sender_id === userId ? friendship.recipient_id : friendship.sender_id
      );
      
      if (friendIds.length === 0) {
        console.log("No friends found, returning empty activities");
        return { activities: [], error: null };
      }
      
      console.log("Found friend IDs:", friendIds);
      
      // Get activities for these friends
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('friend_activities')
        .select(`
          id,
          user_id,
          activity_type,
          activity_data,
          created_at,
          profiles:user_id(username, avatar_url)
        `)
        .in('user_id', friendIds)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (activitiesError) {
        console.error("Error fetching friend activities:", activitiesError);
        throw activitiesError;
      }
      
      // Format the activities with user information and properly cast the activity_data
      const formattedActivities: FriendActivity[] = activitiesData.map(activity => {
        // Safely handle activity_data by ensuring it conforms to the ActivityData type
        let typedActivityData: ActivityData;
        const rawData = activity.activity_data as Json;
        
        // Default values in case data is missing
        typedActivityData = {
          list_id: typeof rawData === 'object' && rawData !== null && 'list_id' in rawData 
            ? String(rawData.list_id) 
            : '',
          list_name: typeof rawData === 'object' && rawData !== null && 'list_name' in rawData 
            ? String(rawData.list_name) 
            : '',
          faction: typeof rawData === 'object' && rawData !== null && 'faction' in rawData 
            ? String(rawData.faction) 
            : '',
          profile_id: typeof rawData === 'object' && rawData !== null && 'profile_id' in rawData
            ? String(rawData.profile_id)
            : undefined,
          comment_id: typeof rawData === 'object' && rawData !== null && 'comment_id' in rawData
            ? String(rawData.comment_id)
            : undefined,
          comment_preview: typeof rawData === 'object' && rawData !== null && 'comment_preview' in rawData
            ? String(rawData.comment_preview)
            : undefined
        };
        
        return {
          id: activity.id,
          user_id: activity.user_id,
          activity_type: activity.activity_type,
          activity_data: typedActivityData,
          created_at: activity.created_at,
          username: activity.profiles?.username,
          avatar_url: activity.profiles?.avatar_url
        };
      });
      
      console.log("Fetched friend activities:", formattedActivities.length);
      
      return { activities: formattedActivities, error: null };
    },
    enabled: !!userId && userId !== "preview-user-id",
    staleTime: 30000, // Refresh every 30 seconds
  });

  return {
    activities: activities?.activities || [],
    isLoading,
    error
  };
};
