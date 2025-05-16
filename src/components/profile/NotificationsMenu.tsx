
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationsList } from "./notifications/NotificationsList";
import { NotificationsEmpty } from "./notifications/NotificationsEmpty";

export const NotificationsMenu = ({ userId }: { userId: string }) => {
  const isPreviewId = userId === "preview-user-id";
  
  const {
    notifications,
    isLoading,
    unreadCount,
    refreshNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead
  } = useNotifications(userId);

  if (isPreviewId) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="relative rounded-full border-warcrow-gold/30 bg-black hover:bg-black"
          >
            <Bell className="h-5 w-5 text-warcrow-gold" />
          </Button>
        </DropdownMenuTrigger>
        <NotificationsEmpty />
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative rounded-full border-warcrow-gold/30 bg-black hover:bg-black"
          onClick={refreshNotifications}
        >
          <Bell className="h-5 w-5 text-warcrow-gold" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-black border-warcrow-gold/30 text-warcrow-text">
        <DropdownMenuLabel className="text-warcrow-gold">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-warcrow-gold/20" />
        <NotificationsList 
          notifications={notifications}
          isLoading={isLoading}
          onRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
