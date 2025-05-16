
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormData } from "@/types/profile";
import { toast } from "sonner";
import { useUsernameValidator } from "./useUsernameValidator";

interface UseProfileUpdateProps {
  usePreviewData: boolean;
  profile: any;
  onSuccess?: () => void;
}

export const useProfileUpdate = ({ usePreviewData, profile, onSuccess }: UseProfileUpdateProps) => {
  const queryClient = useQueryClient();
  const { checkUsernameExists } = useUsernameValidator();

  const updateProfile = useMutation({
    mutationFn: async (updateData: ProfileFormData) => {
      if (usePreviewData) {
        console.log("Update skipped in preview mode");
        return;
      }
      
      console.log("Updating profile with data:", updateData);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found during update");
        throw new Error("Not authenticated");
      }

      // Check if username already exists (if it was changed)
      if (updateData.username && updateData.username !== profile?.username) {
        const exists = await checkUsernameExists(updateData.username, session.user.id);
        if (exists) {
          throw new Error("Username already taken. Please choose a different username.");
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", session.user.id);

      if (error) {
        console.error("Error updating profile:", error);
        // Handle the unique constraint violation
        if (error.code === '23505') {
          throw new Error("Username already taken. Please choose a different username.");
        }
        throw error;
      }
      
      console.log("Profile update successful");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile: " + (error as Error).message);
    },
  });

  return { updateProfile };
};
