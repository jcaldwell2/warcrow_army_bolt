
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageSquare, Fingerprint } from "lucide-react";
import { useEffect, useState } from "react";
import { SocialMediaLinks } from "./SocialMediaLinks";
import { useFriendProfileFetch } from "@/hooks/useFriendProfileFetch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileComments } from "./ProfileComments";

interface FriendProfileDialogProps {
  friendId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FriendProfileDialog = ({
  friendId,
  isOpen,
  onClose,
}: FriendProfileDialogProps) => {
  const { profile: friendProfile, isLoading, isError, error } = useFriendProfileFetch(friendId);
  const [activeTab, setActiveTab] = useState<string>("info");

  useEffect(() => {
    if (isError && error) {
      console.error("Error loading friend profile:", error);
    }
    
    // Log the profile data to verify WAB_ID is present
    if (friendProfile) {
      console.log("Friend profile loaded:", friendProfile);
      console.log("Friend WAB_ID:", friendProfile.wab_id);
    }
  }, [isError, error, friendProfile]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-black/90 border-warcrow-gold/30 text-warcrow-text">
        <DialogHeader className="border-b border-warcrow-gold/20 pb-4">
          <DialogTitle className="flex items-center gap-4 text-warcrow-gold">
            <Avatar>
              {friendProfile?.avatar_url ? (
                <AvatarImage src={friendProfile.avatar_url} alt={friendProfile.username || "Friend Avatar"} />
              ) : (
                <AvatarFallback className="bg-black/50 text-warcrow-gold">{friendProfile?.username?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
              )}
            </Avatar>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-warcrow-gold" />
            ) : (
              <div>
                <div>{friendProfile?.username || "Unnamed User"}</div>
                {friendProfile?.wab_id && (
                  <div className="text-xs flex items-center text-warcrow-gold/80">
                    <Fingerprint className="h-3 w-3 mr-1" /> 
                    {friendProfile.wab_id}
                  </div>
                )}
              </div>
            )}
          </DialogTitle>
          <DialogDescription className="text-warcrow-text/80">
            {friendProfile?.bio || "No bio available"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 text-warcrow-gold animate-spin" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4 bg-black/70 border border-warcrow-gold/20">
              <TabsTrigger 
                value="info" 
                className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold text-warcrow-text/80"
              >
                Profile Info
              </TabsTrigger>
              <TabsTrigger 
                value="comments" 
                className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold text-warcrow-text/80"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="username" className="text-right text-sm font-medium leading-none text-warcrow-gold">
                  Username
                </label>
                <div className="col-span-3">
                  <input
                    type="text"
                    id="username"
                    value={friendProfile?.username || "N/A"}
                    className="flex h-10 w-full rounded-md border border-warcrow-gold/30 bg-black/50 px-3 py-2 text-sm text-warcrow-text placeholder:text-warcrow-text/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="wabid" className="text-right text-sm font-medium leading-none text-warcrow-gold">
                  WAB ID
                </label>
                <div className="col-span-3">
                  <input
                    type="text"
                    id="wabid"
                    value={friendProfile?.wab_id || "N/A"}
                    className="flex h-10 w-full font-mono rounded-md border border-warcrow-gold/30 bg-black/50 px-3 py-2 text-sm text-warcrow-text placeholder:text-warcrow-text/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="location" className="text-right text-sm font-medium leading-none text-warcrow-gold">
                  Location
                </label>
                <div className="col-span-3">
                  <input
                    type="text"
                    id="location"
                    value={friendProfile?.location || "N/A"}
                    className="flex h-10 w-full rounded-md border border-warcrow-gold/30 bg-black/50 px-3 py-2 text-sm text-warcrow-text placeholder:text-warcrow-text/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="faction" className="text-right text-sm font-medium leading-none text-warcrow-gold">
                  Faction
                </label>
                <div className="col-span-3">
                  <input
                    type="text"
                    id="faction"
                    value={friendProfile?.favorite_faction || "N/A"}
                    className="flex h-10 w-full rounded-md border border-warcrow-gold/30 bg-black/50 px-3 py-2 text-sm text-warcrow-text placeholder:text-warcrow-text/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                  />
                </div>
              </div>
              
              {/* Game Stats */}
              <div className="mt-4 pt-4 border-t border-warcrow-gold/20">
                <h3 className="text-warcrow-gold font-medium mb-2 text-sm">Game Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-black/50 p-2 rounded-md border border-warcrow-gold/20 backdrop-blur-sm">
                    <div className="text-lg font-bold text-warcrow-gold">{friendProfile?.games_won || 0}</div>
                    <div className="text-[10px] text-warcrow-text/70">Games Won</div>
                  </div>
                  <div className="bg-black/50 p-2 rounded-md border border-warcrow-gold/20 backdrop-blur-sm">
                    <div className="text-lg font-bold text-warcrow-text/80">{friendProfile?.games_lost || 0}</div>
                    <div className="text-[10px] text-warcrow-text/70">Games Lost</div>
                  </div>
                  <div className="bg-black/50 p-2 rounded-md border border-warcrow-gold/20 backdrop-blur-sm">
                    <div className="text-lg font-bold text-green-500">
                      {friendProfile && (friendProfile.games_won + friendProfile.games_lost > 0) 
                        ? Math.round((friendProfile.games_won / (friendProfile.games_won + friendProfile.games_lost)) * 100) 
                        : 0}%
                    </div>
                    <div className="text-[10px] text-warcrow-text/70">Win Rate</div>
                  </div>
                  <div className="bg-black/50 p-2 rounded-md border border-warcrow-gold/20 backdrop-blur-sm">
                    <div className="text-lg font-bold text-blue-400">
                      {friendProfile ? (friendProfile.games_won + friendProfile.games_lost) : 0}
                    </div>
                    <div className="text-[10px] text-warcrow-text/70">Total Games</div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              {friendProfile && (friendProfile.social_discord || friendProfile.social_twitter ||
                friendProfile.social_instagram || friendProfile.social_youtube ||
                friendProfile.social_twitch) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-warcrow-gold">Social Platforms</h3>
                  <SocialMediaLinks
                    social_discord={friendProfile.social_discord}
                    social_twitter={friendProfile.social_twitter}
                    social_instagram={friendProfile.social_instagram}
                    social_youtube={friendProfile.social_youtube}
                    social_twitch={friendProfile.social_twitch}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="comments" className="bg-black/50 p-4 rounded-md border border-warcrow-gold/20 backdrop-blur-sm">
              {friendId && <ProfileComments profileId={friendId} />}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
