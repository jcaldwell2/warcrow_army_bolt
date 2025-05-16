
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "@/utils/notificationUtils";
import { useToast } from "@/hooks/use-toast";

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [triggerRefresh, setTriggerRefresh] = useState<number>(0);
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();
  
  const isPreviewId = userId === "preview-user-id";

  // Function to refresh notifications
  const refreshNotifications = async () => {
    if (!userId || isPreviewId) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const { notifications: fetchedNotifications, error } = await fetchNotifications(userId, isPreviewId);
    
    if (error) {
      uiToast({
        title: "Error fetching notifications",
        description: "Please try again later",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    setNotifications(fetchedNotifications);
    setIsLoading(false);
  };

  // Mark a notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    const { success } = await markNotificationAsRead(notificationId, isPreviewId);
    
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (isPreviewId || notifications.length === 0) return;
    
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) return;
    
    const { success } = await markAllNotificationsAsRead(userId, isPreviewId);
    
    if (success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    if (isPreviewId || !userId) return;

    console.log("Setting up realtime subscription for notifications");
    
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`
        },
        (payload) => {
          console.log('New notification received via realtime:', payload);
          // Add new notification to state
          setNotifications(prev => [payload.new, ...prev]);
          
          // Trigger a refresh of the notifications via query cache
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          
          // Trigger the component to refresh
          setTriggerRefresh(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isPreviewId, queryClient]);

  // Listen for query cache changes
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const notificationsQuery = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["notifications"] });
      
      if (notificationsQuery.length > 0) {
        console.log("Notifications query cache updated, refreshing...");
        refreshNotifications();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  // Initial fetch and refresh on userId/triggerRefresh change
  useEffect(() => {
    if (userId) {
      refreshNotifications();
    }
  }, [userId, triggerRefresh]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    refreshNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead
  };
};
