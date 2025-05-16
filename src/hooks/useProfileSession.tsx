import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileSession = () => {
  // State to track if we've initialized the session check
  const [sessionChecked, setSessionChecked] = useState(false);
  
  // Check if we're running in preview mode
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                  window.location.hostname.endsWith('.lovableproject.com');

  // Get the session to check if user is authenticated
  const { data: sessionData, error: sessionError, refetch } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      console.log("Fetching authentication session");
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    },
    retry: 1,
    enabled: true, // Always enable the query to ensure we have the latest session data
  });

  // Effect to listen for auth state changes and refetch session data
  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, "Session exists:", !!session);
      
      // Refetch session data when auth state changes
      refetch();
      setSessionChecked(true);
    });

    // Initial session check
    supabase.auth.getSession().then(() => {
      setSessionChecked(true);
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [refetch]);

  // Determine if we're authenticated and if we should use preview data
  const isAuthenticated = !!sessionData?.session?.user;
  const usePreviewData = isPreview && !isAuthenticated;
  const userId = sessionData?.session?.user?.id || null;

  console.log("Auth status:", { 
    isPreview, 
    isAuthenticated, 
    usePreviewData, 
    sessionChecked,
    userId: sessionData?.session?.user?.id 
  });

  return {
    isAuthenticated,
    usePreviewData,
    sessionData,
    sessionError,
    userId,
    sessionChecked
  };
};
