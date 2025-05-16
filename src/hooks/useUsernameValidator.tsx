
import { supabase } from "@/integrations/supabase/client";

export const useUsernameValidator = () => {
  // Function to check if a username already exists
  const checkUsernameExists = async (username: string, currentUserId: string): Promise<boolean> => {
    if (!username || username === "") return false;
    
    try {
      // First, try to use our new database function
      const { data, error } = await supabase.rpc(
        'check_username_exists', 
        { username_to_check: username }
      );
      
      if (error) {
        console.error("Error checking username with RPC:", error);
        // Fallback: Query the profiles table directly with case-insensitive match
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id")
          .not("id", "eq", currentUserId) // Exclude current user
          .ilike("username", username)
          .maybeSingle();
          
        if (profilesError) {
          console.error("Error checking username:", profilesError);
          return false;
        }
        
        return !!profilesData;
      }
      
      return data;
    } catch (err) {
      console.error("Username check error:", err);
      return false;
    }
  };

  return { checkUsernameExists };
};
