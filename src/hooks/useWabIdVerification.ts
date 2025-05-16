
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Player } from '@/types/game';

interface PlayerProfileData {
  username?: string;
  avatar_url?: string;
  favorite_faction?: string;
  id?: string;
}

export const useWabIdVerification = (
  playerId: string,
  player: Player | undefined,
  setPlayerName: (name: string) => void,
  dispatch: any
) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyWabId = async (playerWabId: string) => {
    if (!playerWabId) return;
    
    setIsVerifying(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, favorite_faction, id')
        .eq('wab_id', playerWabId)
        .single();
      
      if (error) {
        console.error("WAB ID verification error:", error);
        toast.error("WAB ID not found");
      } else if (data) {
        const profileData: PlayerProfileData = data;
        console.log("Profile data found:", profileData);
        
        const updates: Partial<Player> = {
          name: profileData.username || player?.name || '',
          wab_id: playerWabId,
          verified: true
        };
        
        if (profileData.id) {
          updates.user_profile_id = profileData.id;
        }
        
        if (profileData.favorite_faction) {
          updates.faction = {
            name: profileData.favorite_faction
          };
        }
        
        if (profileData.avatar_url) {
          updates.avatar_url = profileData.avatar_url;
        }
        
        dispatch({
          type: 'UPDATE_PLAYER',
          payload: {
            id: playerId,
            updates
          }
        });
        
        setPlayerName(profileData.username || player?.name || '');
        toast.success("WAB ID verified");
      }
    } catch (err) {
      console.error("Error verifying WAB ID:", err);
      toast.error("Error verifying WAB ID");
    } finally {
      setIsVerifying(false);
    }
  };

  return { isVerifying, verifyWabId };
};
