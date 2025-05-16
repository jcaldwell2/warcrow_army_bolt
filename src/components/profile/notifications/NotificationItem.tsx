
import React from "react";
import { CheckCheck, AlertTriangle } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatNotificationContent } from "@/utils/notificationUtils";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  notification: any;
  onRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  // Function to handle opening the deployment URL
  const handleOpenDeploymentUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  // Parse content if it's a string
  const content = notification.content && typeof notification.content === 'string'
    ? JSON.parse(notification.content)
    : notification.content;

  // Check if this is a build failure notification
  const isBuildFailure = notification.type === 'build_failure';

  return (
    <DropdownMenuItem 
      key={notification.id} 
      onClick={() => onRead(notification.id)}
      className="hover:bg-warcrow-gold/10 data-[state=open]:bg-warcrow-gold/10"
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm flex items-center">
            {isBuildFailure && (
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            )}
            <span className={isBuildFailure ? "font-medium text-red-400" : ""}>
              {formatNotificationContent(notification)}
            </span>
          </div>
          {notification.read ? (
            <CheckCheck className="h-4 w-4 ml-2 text-green-500" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-blue-500 ml-2"></span>
          )}
        </div>
        
        {isBuildFailure && content?.deploy_url && (
          <div className="mt-1 text-xs">
            {content?.error_message && (
              <p className="text-red-400 mb-1">{content.error_message}</p>
            )}
            <Button
              size="sm"
              variant="link"
              className="h-auto p-0 text-blue-400 hover:text-blue-300"
              onClick={(e) => handleOpenDeploymentUrl(e, content.deploy_url)}
            >
              View build details
            </Button>
          </div>
        )}
      </div>
    </DropdownMenuItem>
  );
};
