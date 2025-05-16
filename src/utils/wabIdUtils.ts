
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to generate a WAB ID with the format WAB-XXXX-XXXX-XXXX
export const generateWabId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'WAB-';
  
  // Generate 3 groups of 4 characters separated by dashes
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
    // Add dash after every 4 characters, but not at the end
    if (i % 4 === 3 && i < 11) {
      result += '-';
    }
  }
  
  return result;
};

// Function to check if a user has a WAB ID and generate one if needed
export const ensureWabId = async (userId: string): Promise<string | null> => {
  if (!userId) {
    console.error("Cannot ensure WAB ID: No user ID provided");
    return null;
  }
  
  try {
    // First check if the user already has a WAB ID
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('wab_id')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error("Error fetching profile to check WAB ID:", fetchError);
      throw fetchError;
    }
    
    // If WAB ID already exists, return it
    if (profile?.wab_id) {
      console.log("User already has WAB ID:", profile.wab_id);
      return profile.wab_id;
    }
    
    // Generate a new WAB ID
    const newWabId = generateWabId();
    console.log("Generated new WAB ID for user:", newWabId);
    
    // Update the user's profile with the new WAB ID
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ wab_id: newWabId })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error updating profile with new WAB ID:", updateError);
      throw updateError;
    }
    
    toast.success("Your Warcrow Army Builder ID has been generated");
    return newWabId;
    
  } catch (error) {
    console.error("Error ensuring WAB ID:", error);
    toast.error("Failed to generate WAB ID. Please try again later.");
    return null;
  }
};
