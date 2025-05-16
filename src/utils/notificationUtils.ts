
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Format notification content based on type
export const formatNotificationContent = (notification: any) => {
  if (notification.type === 'direct_message') {
    const senderName = notification.content?.sender_name || 'Someone';
    return `${senderName} sent you a message`;
  }
  
  if (notification.type === 'friend_request') {
    const senderName = notification.content?.sender_name || 'Someone';
    return `${senderName} sent you a friend request`;
  }
  
  if (notification.type === 'friend_accepted') {
    const senderName = notification.content?.sender_name || 'Someone';
    return `${senderName} accepted your friend request`;
  }
  
  if (notification.type === 'profile_comment') {
    const senderName = notification.content?.sender_name || 'Someone';
    return `${senderName} commented on your profile`;
  }
  
  if (notification.type === 'build_failure') {
    try {
      const content = typeof notification.content === 'string' 
        ? JSON.parse(notification.content) 
        : notification.content;
      
      const siteName = content?.site_name || 'Unknown site';
      const branch = content?.branch || 'unknown branch';
      return `Build failed: ${siteName} (${branch})`;
    } catch (error) {
      console.error("Error parsing build_failure notification:", error);
      return "Build failure notification";
    }
  }
  
  return notification.message || notification.content?.message || "New notification";
};

// Fetch notifications for a user
export const fetchNotifications = async (userId: string, isPreviewId: boolean) => {
  if (isPreviewId) {
    return { notifications: [], error: null };
  }
  
  try {
    console.log("Fetching notifications for user:", userId);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Error fetching notifications", {
        description: "Please try again later",
        position: "top-right"
      });
      return { notifications: [], error };
    }
    
    console.log("Notifications fetched:", data?.length || 0, "notifications");
    
    // If there are unread notifications, show a toast
    const unreadCount = data ? data.filter(n => !n.read).length : 0;
    if (unreadCount > 0) {
      toast.info(`You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`, {
        position: "top-right",
        duration: 3000
      });
    }
    
    // Only show the most recent build failure notification if it's from the last 24 hours and unread
    let hasShownBuildFailureNotification = false;
    const recentBuildFailures = data ? data.filter(n => {
      const isRecent = n.type === 'build_failure' && 
             !n.read && 
             // Check if created within the last 24 hours
             (new Date().getTime() - new Date(n.created_at).getTime() < 24 * 60 * 60 * 1000);
      
      if (isRecent && !hasShownBuildFailureNotification) {
        hasShownBuildFailureNotification = true;
        return true;
      }
      return false;
    }) : [];
    
    // Only show a toast for the most recent build failure notification
    if (recentBuildFailures.length > 0) {
      const newestFailure = recentBuildFailures[0];
      try {
        const content = typeof newestFailure.content === 'string' 
          ? JSON.parse(newestFailure.content) 
          : newestFailure.content;
        
        toast.error(`Netlify build failed!`, {
          description: `${content.site_name}: ${content.branch} - ${content.error_message || 'Unknown error'}`,
          position: "top-right",
          duration: 8000
        });
      } catch (err) {
        console.error("Error parsing build failure notification:", err);
      }
    }
    
    return { notifications: data || [], error: null };
    
  } catch (err) {
    console.error("Error fetching notifications:", err);
    toast.error("Error fetching notifications", {
      description: "Please try again later",
      position: "top-right"
    });
    return { notifications: [], error: err };
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string, isPreviewId: boolean) => {
  if (isPreviewId) return { success: true, error: null };
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error marking notification as read", {
        description: "Please try again later",
        position: "top-right"
      });
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error("Error marking notification as read:", err);
    toast.error("Error marking notification as read", {
      description: "Please try again later",
      position: "top-right"
    });
    return { success: false, error: err };
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string, isPreviewId: boolean) => {
  if (isPreviewId) return { success: true, error: null };
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('recipient_id', userId)
      .eq('read', false);
    
    if (error) {
      console.error("Error marking all notifications as read:", error);
      return { success: false, error };
    }
    
    toast.success("All notifications marked as read", {
      position: "top-right"
    });
    
    return { success: true, error: null };
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    toast.error("Failed to mark all as read", {
      position: "top-right"
    });
    return { success: false, error: err };
  }
};

// Check and return build failure notifications for admin display
export const getBuildFailureNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('type', 'build_failure')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching build failure notifications:", error);
      return { notifications: [], error };
    }
    
    // Filter to only show notifications from the last 24 hours
    const recentNotifications = data ? data.filter(notification => {
      return new Date().getTime() - new Date(notification.created_at).getTime() < 24 * 60 * 60 * 1000;
    }) : [];
    
    return { notifications: recentNotifications || [], error: null };
  } catch (err) {
    console.error("Error fetching build failure notifications:", err);
    return { notifications: [], error: err };
  }
};
