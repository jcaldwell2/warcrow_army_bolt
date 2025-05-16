
import { useState, useEffect } from 'react';
import { fetchListsByWabId } from '@/utils/profileUtils';
import { SavedList } from '@/types/army';
import { toast } from 'sonner';
import { Player } from '@/types/game';
import { supabase } from '@/integrations/supabase/client';

export const useSavedLists = (player?: Player) => {
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [isLoadingSavedLists, setIsLoadingSavedLists] = useState(false);
  const [lastFetchedWabId, setLastFetchedWabId] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  const fetchLists = async (wabId: string) => {
    if (!wabId) {
      console.log('No WAB ID provided, skipping fetch');
      return;
    }
    
    if (lastFetchedWabId === wabId && savedLists.length > 0 && Date.now() - lastRefresh < 30000) {
      console.log(`Already fetched lists for WAB ID: ${wabId} recently, using cached results`);
      return;
    }
    
    setIsLoadingSavedLists(true);
    try {
      setLastFetchedWabId(wabId);
      setLastRefresh(Date.now());
      console.log(`Fetching lists for WAB ID: ${wabId}`);
      
      // First try to get the user's own lists if they're logged in
      const { data: { session } } = await supabase.auth.getSession();
      let lists: SavedList[] = [];
      
      if (session?.user) {
        console.log('User is authenticated, fetching their lists');
        const { data, error } = await supabase
          .from('army_lists')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (error) {
          console.error('Error fetching user lists:', error);
          toast.error('Error loading your cloud lists');
        } else if (data) {
          console.log(`Found ${data.length} lists for authenticated user`);
          lists = data.map((list: any) => ({
            id: list.id,
            name: list.name,
            faction: list.faction,
            units: list.units,
            user_id: list.user_id,
            created_at: list.created_at,
            wab_id: list.wab_id
          }));
        }
      }
      
      // If we didn't find any lists, or we want to additionally fetch by WAB ID
      // Only fetch by WAB ID if it's different from the user's ID
      if ((lists.length === 0 || wabId !== session?.user?.id) && wabId !== 'preview-user-id') {
        try {
          const wabLists = await fetchListsByWabId(wabId);
          
          // Only add WAB lists that aren't already in the user's lists
          const existingIds = new Set(lists.map(list => list.id));
          const newWabLists = wabLists.filter(list => !existingIds.has(list.id));
          
          lists = [...lists, ...newWabLists];
          console.log(`Found ${newWabLists.length} additional lists by WAB ID`);
        } catch (wabErr) {
          console.error(`Error fetching lists by WAB ID: ${wabId}:`, wabErr);
        }
      }
      
      // Also get lists from localStorage as backup
      try {
        const localData = localStorage.getItem('armyLists');
        if (localData) {
          const localLists = JSON.parse(localData) as SavedList[];
          
          // Only add local lists if they're not already in our lists
          const existingIds = new Set(lists.map(list => list.id));
          const newLocalLists = localLists.filter(list => !existingIds.has(list.id));
          
          lists = [...lists, ...newLocalLists];
          console.log(`Found ${newLocalLists.length} additional lists from localStorage`);
        }
      } catch (localErr) {
        console.error('Error loading local lists:', localErr);
      }
      
      if (lists.length > 0) {
        console.log(`Total lists found: ${lists.length}`, lists);
        setSavedLists(lists);
        
        if (player?.verified && session?.user?.id) {
          toast.success(`Found ${lists.length} saved lists`, {
            id: `found-lists-${wabId}`
          });
        }
      } else {
        console.log(`No lists found for WAB ID: ${wabId}`);
        setSavedLists([]);
        if (player?.verified && session?.user?.id) {
          toast.info("No saved lists found for this WAB ID", {
            id: `no-lists-${wabId}`
          });
        }
      }
    } catch (err) {
      console.error(`Error fetching lists for WAB ID: ${wabId}:`, err);
      toast.error("Error loading saved lists");
    } finally {
      setIsLoadingSavedLists(false);
    }
  };

  // Auto-fetch lists when wab_id changes or player becomes verified
  useEffect(() => {
    if (player?.verified && player?.wab_id && !isLoadingSavedLists && lastFetchedWabId !== player.wab_id) {
      console.log("Player is verified, automatically fetching lists");
      fetchLists(player.wab_id);
    }
  }, [player?.verified, player?.wab_id, isLoadingSavedLists, lastFetchedWabId]);

  // Check auth status and user_id to fetch lists directly if logged in
  useEffect(() => {
    const checkAuthAndFetchLists = async () => {
      if (isLoadingSavedLists) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("User is authenticated, fetching lists directly");
        fetchLists(session.user.id);
      } else {
        console.log("User is not authenticated, loading local lists only");
        // If not logged in, load local lists from localStorage
        try {
          const localData = localStorage.getItem('armyLists');
          if (localData) {
            const localLists = JSON.parse(localData);
            setSavedLists(localLists);
            console.log(`Loaded ${localLists.length} local lists`);
          }
        } catch (e) {
          console.error('Error loading local lists:', e);
        }
      }
    };
    
    checkAuthAndFetchLists();
  }, []);

  return {
    savedLists,
    isLoadingSavedLists,
    fetchLists,
    refreshLists: () => {
      if (lastFetchedWabId) {
        fetchLists(lastFetchedWabId);
      } else {
        // If no WAB ID yet, try to get the user ID
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.id) {
            fetchLists(session.user.id);
          }
        });
      }
    }
  };
};
