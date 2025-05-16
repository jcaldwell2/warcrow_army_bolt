
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileFormData {
  username: string | null;
  bio: string | null;
  location: string | null;
  favorite_faction: string | null;
  avatar_url: string | null;
  wab_id?: string | null;
}

interface ProfileFormProps {
  formData: ProfileFormData;
  isEditing: boolean;
  isPending: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ProfileForm = ({
  formData,
  isEditing,
  isPending,
  onInputChange,
  onSubmit,
  onCancel
}: ProfileFormProps) => {
  const isMobile = useIsMobile();
  
  return (
    <form onSubmit={onSubmit} className="space-y-3 md:space-y-4">
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="username" className="text-warcrow-gold flex items-center gap-1 text-sm md:text-base">
          Username
          {isEditing && <span className="text-[10px] md:text-xs text-warcrow-gold/70 ml-1">(must be unique)</span>}
        </Label>
        <Input
          id="username"
          name="username"
          value={formData.username || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          className={`bg-black/50 text-sm md:text-base h-8 md:h-10 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
          placeholder={isEditing ? "Enter a unique username" : ""}
        />
        {isEditing && (
          <p className="text-[10px] md:text-xs flex items-center gap-1 text-warcrow-gold/70">
            <AlertCircle className="h-3 w-3" />
            Usernames must be unique across all users
          </p>
        )}
      </div>

      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="bio" className="text-warcrow-gold text-sm md:text-base">Bio</Label>
        <Input
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          className={`bg-black/50 text-sm md:text-base h-8 md:h-10 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>

      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="location" className="text-warcrow-gold text-sm md:text-base">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          className={`bg-black/50 text-sm md:text-base h-8 md:h-10 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>

      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="favorite_faction" className="text-warcrow-gold text-sm md:text-base">Favorite Faction</Label>
        <Input
          id="favorite_faction"
          name="favorite_faction"
          value={formData.favorite_faction || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          className={`bg-black/50 text-sm md:text-base h-8 md:h-10 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>

      {isEditing && (
        <div className="flex gap-2 md:gap-4 justify-end pt-3 md:pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-warcrow-gold text-black bg-warcrow-gold hover:bg-warcrow-gold/80 hover:border-warcrow-gold/80 transition-colors text-xs md:text-sm h-8 md:h-10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80 text-xs md:text-sm h-8 md:h-10"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                {isMobile ? 'Saving' : 'Saving Changes'}
              </>
            ) : (
              isMobile ? 'Save' : 'Save Changes'
            )}
          </Button>
        </div>
      )}
    </form>
  );
};
