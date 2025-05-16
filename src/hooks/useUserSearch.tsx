
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  username: string | null;
  wab_id: string | null;
  avatar_url: string | null;
  banned?: boolean;
  deactivated?: boolean;
}

export const useUserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // First try to search by WAB ID or username
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, wab_id, avatar_url, banned, deactivated")
        .or(`wab_id.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);
      
      if (profileError) throw profileError;
      
      // If no results found, try to search by email
      if ((!profileData || profileData.length === 0) && query.includes('@')) {
        try {
          // Use the function to get user by email
          const { data: emailData, error: emailError } = await supabase
            .rpc('get_user_email', { user_id: query });
            
          if (emailError) {
            console.error("Email search error:", emailError);
            // If this fails, just return empty results
            setSearchResults([]);
            return;
          }
          
          if (emailData) {
            // Try to find the user profile by matching email
            try {
              // Direct query to find a profile with matching email-like ID
              const { data: userProfile, error: profileError } = await supabase
                .from("profiles")
                .select("id, username, wab_id, avatar_url, banned, deactivated")
                .eq("id", query)
                .single();
                
              if (profileError) {
                console.error("Profile search error:", profileError);
                setSearchResults([]);
              } else {
                setSearchResults(userProfile ? [userProfile] : []);
              }
              return;
            } catch (profileSearchError: unknown) {
              if (profileSearchError instanceof Error) {
                console.error("Profile search error:", profileSearchError.message);
              } else {
                console.error("Profile search error:", profileSearchError);
              }
              setSearchResults([]); // Safe fallback
              return;
            }
          }
        } catch (emailSearchError: unknown) {
          if (emailSearchError instanceof Error) {
            console.error("Email search error:", emailSearchError.message);
          } else {
            console.error("Email search error:", emailSearchError);
          }
          // If this fails, return empty results
          setSearchResults([]);
          return;
        }

        // As a fallback, try to directly query profiles that might match the email pattern
        try {
          const { data: emailProfileData, error: emailProfileError } = await supabase
            .from("profiles")
            .select("id, username, wab_id, avatar_url, banned, deactivated")
            .eq("id", query)
            .limit(10);
          
          if (emailProfileError) {
            console.error("Direct email search error:", emailProfileError);
            setSearchResults([]);
            return;
          }
          
          if (emailProfileData && emailProfileData.length > 0) {
            setSearchResults(emailProfileData);
            return;
          } else {
            setSearchResults([]);
            return;
          }
        } catch (directSearchError: unknown) {
          if (directSearchError instanceof Error) {
            console.error("Direct email search error:", directSearchError.message);
          } else {
            console.error("Direct email search error:", directSearchError);
          }
          setSearchResults([]);
          return;
        }
      }
      
      // If we reached here, return the results from the initial query
      setSearchResults(profileData || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error searching users:", error.message);
      } else {
        console.error("Error searching users:", error);
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchUsers
  };
};
