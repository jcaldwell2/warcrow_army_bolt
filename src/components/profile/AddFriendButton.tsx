
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useProfileContext } from "@/context/ProfileContext"; // Fix the import path
import { supabase } from "@/integrations/supabase/client";
import { useProfileSession } from "@/hooks/useProfileSession";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddFriendButtonProps {
  targetUserId: string;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  className?: string;
}

export const AddFriendButton = ({ targetUserId, variant = "outline", size = "default", className }: AddFriendButtonProps) => {
  const { userId: currentUserId } = useProfileSession();
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const { t } = useLanguage();

  // Skip if viewing own profile
  if (currentUserId === targetUserId) {
    return null;
  }

  const handleSendRequest = async () => {
    if (!currentUserId) {
      toast.error(t('loginRequired'));
      return;
    }

    setIsLoading(true);
    try {
      // Check if friendship already exists
      const { data: existingFriendship, error: checkError } = await supabase
        .from("friendships")
        .select()
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},recipient_id.eq.${currentUserId})`)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingFriendship) {
        toast.info(t('alreadyFriends'), {
          description: t('friendRequestExisting'),
        });
        return;
      }
      
      // Send friend request
      const { error: insertError } = await supabase
        .from("friendships")
        .insert({
          sender_id: currentUserId,
          recipient_id: targetUserId,
          status: "pending"
        });
      
      if (insertError) throw insertError;
      
      // Create notification
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: targetUserId,
          sender_id: currentUserId,
          type: "friend_request",
          content: { message: "sent you a friend request" }
        });
      
      if (notificationError) throw notificationError;
      
      toast.success(t('requestSent'));
      setRequestSent(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error(t('failedToSend'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className || "border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"}
      onClick={handleSendRequest}
      disabled={isLoading || requestSent}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      {requestSent ? t('friendRequestSent') : t('addFriend')}
    </Button>
  );
};
