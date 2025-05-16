
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon, Upload } from "lucide-react";
import { PortraitSelector } from "./PortraitSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  username: string | null;
  isEditing: boolean;
  onAvatarUpdate: (url: string) => void;
  size?: "default" | "sm" | "lg";
  isOnline?: boolean;
}

export const ProfileAvatar = ({
  avatarUrl,
  username,
  isEditing,
  onAvatarUpdate,
  size = "default",
  isOnline
}: ProfileAvatarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const getSize = () => {
    switch (size) {
      case "sm": return "h-10 w-10";
      case "lg": return "h-24 w-24";
      default: return "h-16 w-16";
    }
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        throw new Error('Please select an image file.');
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image size must be less than 2MB.');
      }
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the avatar URL in the profile
      onAvatarUpdate(publicUrl);
      
      toast.success("Avatar uploaded successfully!");
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error instanceof Error ? error.message : "Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  // Size the online status indicator based on avatar size
  const getStatusIndicatorSize = () => {
    switch (size) {
      case "sm": return "h-3 w-3";
      case "lg": return "h-5 w-5";
      default: return "h-4 w-4";
    }
  };

  return (
    <div className="relative">
      <Avatar className={`${getSize()} border-2 ${isOnline ? 'border-green-500/70' : 'border-warcrow-gold'}`}>
        <AvatarImage src={avatarUrl || undefined} alt={username || "User"} />
        <AvatarFallback className="bg-warcrow-gold/20 text-warcrow-gold">
          {getInitials(username)}
        </AvatarFallback>
      </Avatar>
      
      {isOnline !== undefined && (
        <span 
          className={`absolute bottom-0 right-0 ${getStatusIndicatorSize()} rounded-full border-2 border-black ${
            isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} 
          title={isOnline ? "Online" : "Offline"}
        />
      )}
      
      {isEditing && (
        <div className="absolute -bottom-1 -right-1 flex">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsUploadDialogOpen(true)}
            className="h-8 w-8 rounded-full border-warcrow-gold bg-black hover:bg-black mr-2"
            title="Upload an image"
          >
            <Upload className="h-3 w-3 text-warcrow-gold" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsDialogOpen(true)}
            className="h-8 w-8 rounded-full border-warcrow-gold bg-black hover:bg-black"
            title="Choose a character portrait"
          >
            <PencilIcon className="h-3 w-3 text-warcrow-gold" />
          </Button>
        </div>
      )}
      
      <PortraitSelector 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSelectPortrait={onAvatarUpdate}
      />

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="bg-warcrow-background border-warcrow-gold/30 text-warcrow-text">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-warcrow-gold">Upload Avatar</h2>
            <p className="text-sm text-warcrow-text/70">
              Select an image file from your device to use as your profile avatar.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-warcrow-gold/30 bg-black/40 hover:bg-black/60">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-warcrow-gold/70" />
                <p className="mb-2 text-sm text-warcrow-gold/90">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-warcrow-text/50">PNG, JPG or GIF (max. 2MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
            
            {uploading && (
              <div className="text-center py-2">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-warcrow-gold border-r-transparent"></div>
                <p className="mt-2 text-sm text-warcrow-gold">Uploading...</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
                className="border-warcrow-gold/50 text-warcrow-gold hover:bg-black/50"
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
