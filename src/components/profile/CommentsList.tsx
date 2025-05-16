
import { ProfileComment } from "@/types/comments";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";
import { useProfileSession } from "@/hooks/useProfileSession";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { motion } from "framer-motion";
import { profileFadeIn, staggerChildren } from "./animations";
import { toast } from "sonner";

interface CommentsListProps {
  comments: ProfileComment[];
  isLoading: boolean;
  onDeleteComment: (commentId: string) => Promise<boolean>;
}

export const CommentsList = ({ comments, isLoading, onDeleteComment }: CommentsListProps) => {
  const { userId } = useProfileSession();
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  
  const handleLike = (commentId: string) => {
    if (likedComments.has(commentId)) {
      // Unlike
      const newLiked = new Set(likedComments);
      newLiked.delete(commentId);
      setLikedComments(newLiked);
      toast.info("Like removed");
    } else {
      // Like
      setLikedComments(new Set(likedComments).add(commentId));
      toast.success("Comment liked");
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex items-start gap-3 p-3 bg-black/30 rounded-md border border-warcrow-gold/10">
            <div className="h-10 w-10 bg-warcrow-gold/20 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 w-1/3 bg-warcrow-gold/20 rounded mb-2"></div>
              <div className="h-3 bg-warcrow-text/20 rounded mb-1"></div>
              <div className="h-3 w-2/3 bg-warcrow-text/20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (comments.length === 0) {
    return (
      <motion.div 
        className="py-8 text-center text-warcrow-text/50 bg-black/20 rounded-md border border-warcrow-gold/10 p-4"
        variants={profileFadeIn}
        initial="hidden"
        animate="visible"
      >
        <div className="text-warcrow-gold/70 mb-2 text-lg">No comments yet</div>
        <p>Be the first to leave a comment!</p>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-4"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      {comments.map((comment) => (
        <motion.div 
          key={comment.id} 
          className="p-3 bg-black/30 rounded-md border border-warcrow-gold/10 transition-all hover:bg-black/40"
          variants={profileFadeIn}
        >
          <div className="flex items-start gap-3">
            <ProfileAvatar
              avatarUrl={comment.author_avatar_url || null}
              username={comment.author_username || "User"}
              isEditing={false}
              onAvatarUpdate={() => {}}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-warcrow-gold">{comment.author_username || "Unknown User"}</span>
                  <span className="text-xs text-warcrow-text/50 ml-2">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(comment.id)}
                    className="h-7 px-2 text-warcrow-text/60 hover:text-warcrow-gold hover:bg-transparent"
                  >
                    <Heart 
                      className={`h-4 w-4 ${likedComments.has(comment.id) ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </Button>
                  
                  {userId === comment.author_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteComment(comment.id)}
                      className="h-7 w-7 p-0 text-warcrow-text/50 hover:text-red-400 hover:bg-black/30"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-warcrow-text break-words whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
