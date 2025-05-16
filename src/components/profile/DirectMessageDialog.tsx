import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfileSession } from "@/hooks/useProfileSession";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sent_at: string;
  isCurrentUser: boolean;
}

interface DirectMessageDialogProps {
  friendId: string | null;
  friendUsername: string | null;
  friendAvatar: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DirectMessageDialog = ({ 
  friendId, 
  friendUsername, 
  friendAvatar,
  isOpen, 
  onClose 
}: DirectMessageDialogProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { toast: uiToast } = useToast();
  const { userId, sessionChecked } = useProfileSession();

  useEffect(() => {
    if (isOpen && friendId && userId && sessionChecked) {
      loadMessages();
    }
  }, [isOpen, friendId, userId, sessionChecked]);

  const loadMessages = async () => {
    if (!friendId || !userId) return;
    
    setIsLoading(true);
    try {
      console.log(`Loading messages between ${userId} and ${friendId}`);
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${friendId}),and(sender_id.eq.${friendId},recipient_id.eq.${userId})`)
        .order('sent_at', { ascending: true });
        
      if (error) throw error;
      
      console.log(`Loaded ${data?.length || 0} messages`);
      
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        sent_at: msg.sent_at,
        isCurrentUser: msg.sender_id === userId
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages", {
        description: "Please try again later",
        position: "top-right"
      });
      uiToast({
        title: "Failed to load message history",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !friendId || !userId) return;
    
    setSendingMessage(true);
    try {
      console.log(`Sending message to ${friendId}`);
      
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: userId,
          recipient_id: friendId,
          content: newMessage.trim(),
        })
        .select()
        .single();
        
      if (error) throw error;
      
      console.log("Message sent successfully:", data);
      
      setMessages([...messages, {
        id: data.id,
        content: data.content,
        sender_id: data.sender_id,
        sent_at: data.sent_at,
        isCurrentUser: true
      }]);
      
      await supabase
        .from('notifications')
        .insert({
          recipient_id: friendId,
          sender_id: userId,
          type: 'direct_message',
          content: { message: "sent you a message" }
        });
        
      toast.success("Message sent", {
        position: "top-right",
        duration: 2000
      });
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: "Please try again",
        position: "top-right"
      });
      uiToast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="bg-black/90 border-warcrow-gold/30 text-warcrow-text max-w-md">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold flex items-center gap-2">
            {friendAvatar && (
              <ProfileAvatar
                avatarUrl={friendAvatar}
                username={friendUsername || "User"}
                isEditing={false}
                onAvatarUpdate={() => {}}
                size="sm"
              />
            )}
            <span>Message {friendUsername || "Friend"}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="h-[300px] overflow-y-auto py-2 space-y-2 mb-2 border-t border-b border-warcrow-gold/20">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-warcrow-gold/70 mr-2" />
              <p className="text-warcrow-gold/70">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-warcrow-gold/70">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-2 rounded ${
                  message.isCurrentUser 
                    ? 'bg-warcrow-gold/20 text-warcrow-text' 
                    : 'bg-black/40 border border-warcrow-gold/10'
                }`}>
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    message.isCurrentUser ? 'text-warcrow-gold/60' : 'text-warcrow-text/60'
                  }`}>
                    {new Date(message.sent_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !sendingMessage && sendMessage()}
            placeholder="Write your message..."
            className="flex-1 bg-black/30 text-warcrow-text border border-warcrow-gold/30 rounded p-2 outline-none focus:border-warcrow-gold/50"
            disabled={sendingMessage}
          />
          <Button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || sendingMessage}
            className="bg-warcrow-gold/80 text-black hover:bg-warcrow-gold"
          >
            {sendingMessage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-warcrow-gold/30 text-warcrow-gold hover:bg-black hover:text-warcrow-gold"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
