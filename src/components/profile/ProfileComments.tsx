
import { useProfileComments } from "@/hooks/useProfileComments";
import { CommentForm } from "@/components/profile/CommentForm";
import { CommentsList } from "@/components/profile/CommentsList";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useProfileSession } from "@/hooks/useProfileSession";

interface ProfileCommentsProps {
  profileId: string;
}

export const ProfileComments = ({ profileId }: ProfileCommentsProps) => {
  const { comments, isLoading, addComment, deleteComment, refreshComments } = useProfileComments(profileId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isAuthenticated } = useProfileSession();
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshComments();
    setIsRefreshing(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-warcrow-gold">Comments</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="border-warcrow-gold/30 text-warcrow-gold hover:bg-black/50"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {isAuthenticated && (
        <CommentForm onSubmit={addComment} disabled={isLoading} />
      )}
      
      <CommentsList
        comments={comments}
        isLoading={isLoading}
        onDeleteComment={deleteComment}
      />
    </div>
  );
};
