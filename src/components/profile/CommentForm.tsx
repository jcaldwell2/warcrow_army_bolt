
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ProfileCommentFormData } from "@/types/comments";
import { useProfileSession } from "@/hooks/useProfileSession";
import { toast } from "sonner";

interface CommentFormProps {
  onSubmit: (formData: ProfileCommentFormData) => Promise<boolean>;
  disabled?: boolean;
}

export const CommentForm = ({ onSubmit, disabled }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useProfileSession();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to post comments");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    const success = await onSubmit({ content });
    
    if (success) {
      setContent("");
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="bg-black/30 border-warcrow-gold/30 text-warcrow-text placeholder:text-warcrow-text/50 resize-none"
        disabled={isSubmitting || disabled || !isAuthenticated}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || disabled || !content.trim() || !isAuthenticated}
          className="bg-warcrow-gold/80 hover:bg-warcrow-gold text-black"
        >
          <Send className="h-4 w-4 mr-2" />
          Post
        </Button>
      </div>
    </form>
  );
};
