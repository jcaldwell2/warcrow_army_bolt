
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFriendActivities, FriendActivity } from '@/hooks/useFriendActivities';
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';

interface FriendActivityFeedProps {
  userId: string;
  className?: string;
}

export const FriendActivityFeed: React.FC<FriendActivityFeedProps> = ({ userId, className }) => {
  const isMobile = useIsMobile();
  const { activities, isLoading, error } = useFriendActivities(userId);

  const refreshFeed = () => {
    // Force refetch by reloading the page - in a real app, we would use the
    // refetch function from the hook instead
    window.location.reload();
    toast.success("Refreshing activity feed");
  };

  // Format activity message based on activity type
  const formatActivityMessage = (activity: FriendActivity) => {
    switch (activity.activity_type) {
      case 'create_list':
        return `Created a new army list: ${activity.activity_data.list_name}`;
      case 'update_list':
        return `Updated army list: ${activity.activity_data.list_name}`;
      case 'login':
        return 'Logged in';
      case 'profile_update':
        return 'Updated their profile';
      case 'add_friend':
        return 'Added a new friend';
      case 'profile_comment':
        return `Commented on a profile: "${activity.activity_data.comment_preview}"`;
      default:
        return activity.activity_type.replace('_', ' ');
    }
  };

  // Format time to relative format (e.g., "2 hours ago")
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };

  return (
    <div className={`bg-black/50 backdrop-filter backdrop-blur-sm rounded-lg p-3 border border-warcrow-gold/10 flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-warcrow-gold font-medium text-sm md:text-base">Friend Activity</h3>
        <Button
          onClick={refreshFeed}
          variant="outline"
          size="sm"
          className="border-warcrow-gold/50 text-black bg-warcrow-gold hover:bg-warcrow-gold/80 h-7 px-2 py-1 text-xs md:text-sm"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          {!isMobile ? 'Refresh' : ''}
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 md:h-4 w-full" />
                <Skeleton className="h-2 md:h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && <div className="text-red-500 text-sm">Error loading activities: {error.message}</div>}

      <ul className="space-y-2 overflow-auto flex-1 min-h-0 max-h-[150px] md:max-h-full">
        {!isLoading && activities.length > 0 ? (
          activities.map(activity => (
            <li key={activity.id} className="text-warcrow-text/80 text-xs md:text-sm">
              <div className="flex items-center space-x-2">
                <img 
                  src={activity.avatar_url || "/images/user.png"} 
                  alt="" 
                  className="h-5 w-5 md:h-6 md:w-6 rounded-full"
                />
                <div>
                  <span className="text-warcrow-gold/90">{activity.username}</span>
                  <span className="ml-1">{formatActivityMessage(activity)}</span>
                  <div className="text-[10px] md:text-xs text-warcrow-text/50">
                    {formatTime(activity.created_at)}
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          !isLoading && !error && (
            <li className="text-warcrow-text/50 text-xs md:text-sm">No activity to display.</li>
          )
        )}
      </ul>
    </div>
  );
};
