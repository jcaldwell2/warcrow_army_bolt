
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileComment, ProfileCommentFormData } from "@/types/comments";
import { useProfileSession } from "@/hooks/useProfileSession";
import { toast } from "sonner";

export const useProfileComments = (profileId: string | null) => {
  const [comments, setComments] = useState<ProfileComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { userId } = useProfileSession();

  // Fetch comments for this profile
  const fetchComments = async () => {
    if (!profileId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First get the comments
      const { data, error } = await supabase
        .from('profile_comments')
        .select(`
          id,
          author_id,
          profile_id,
          content,
          created_at,
          updated_at
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get author information for each comment
      const commentsWithAuthors = await Promise.all(
        data.map(async (comment) => {
          const { data: authorData, error: authorError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', comment.author_id)
            .single();
          
          if (authorError) {
            console.error('Error fetching author data:', authorError);
            return {
              ...comment,
              author_username: 'Unknown User',
              author_avatar_url: null
            };
          }
          
          return {
            ...comment,
            author_username: authorData?.username || 'Unknown User',
            author_avatar_url: authorData?.avatar_url || null
          };
        })
      );
      
      setComments(commentsWithAuthors);
    } catch (err) {
      console.error('Error fetching profile comments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch comments'));
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new comment
  const addComment = async (formData: ProfileCommentFormData) => {
    if (!profileId || !userId) {
      toast.error('You must be logged in to post comments');
      return false;
    }
    
    if (!formData.content.trim()) {
      toast.error('Comment cannot be empty');
      return false;
    }
    
    try {
      // Get the current user's username for the notification
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();
        
      if (userError) {
        console.error('Error fetching user data:', userError);
      }
      
      const username = userData?.username || 'Someone';
      
      // Post the comment
      const { data, error } = await supabase
        .from('profile_comments')
        .insert({
          author_id: userId,
          profile_id: profileId,
          content: formData.content.trim()
        })
        .select();
      
      if (error) throw error;
      
      // Only create a notification if the comment is on someone else's profile
      if (userId !== profileId) {
        // Create a notification for the profile owner
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: profileId,
            sender_id: userId,
            type: 'profile_comment',
            content: {
              sender_name: username,
              message: `${username} commented on your profile`,
              comment_id: data?.[0]?.id,
              comment_preview: formData.content.trim().substring(0, 50) + (formData.content.length > 50 ? '...' : '')
            }
          });
          
        if (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
        
        // Add this comment to friend activities so it shows in the activity feed
        const { error: activityError } = await supabase
          .from('friend_activities')
          .insert({
            user_id: userId,
            activity_type: 'profile_comment',
            activity_data: {
              profile_id: profileId,
              comment_id: data?.[0]?.id,
              comment_preview: formData.content.trim().substring(0, 50) + (formData.content.length > 50 ? '...' : ''),
              list_id: '', // These fields are required by the existing activity_data type
              list_name: '',
              faction: ''
            }
          });
          
        if (activityError) {
          console.error('Error creating friend activity:', activityError);
        }
      }
      
      toast.success('Comment posted successfully');
      
      // Refresh the comments list
      fetchComments();
      return true;
    } catch (err) {
      console.error('Error posting comment:', err);
      toast.error('Failed to post comment');
      return false;
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('profile_comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', userId);
      
      if (error) throw error;
      
      toast.success('Comment deleted');
      
      // Update the local comments state
      setComments(comments.filter(comment => comment.id !== commentId));
      return true;
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
      return false;
    }
  };

  // Set up realtime subscription for live comments
  useEffect(() => {
    if (!profileId) return;
    
    fetchComments();
    
    // Set up realtime subscription for comments
    const channel = supabase
      .channel('profile-comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'profile_comments',
        filter: `profile_id=eq.${profileId}`
      }, (payload) => {
        console.log('New comment received:', payload);
        fetchComments();
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'profile_comments',
        filter: `profile_id=eq.${profileId}`
      }, (payload) => {
        console.log('Comment deleted:', payload);
        fetchComments();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    refreshComments: fetchComments
  };
};
