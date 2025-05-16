
import React, { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VerifiedPlayer {
  wab_id: string;
  name: string;
}

const GameResults = () => {
  const { state } = useGame();
  const [recordingResults, setRecordingResults] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [verifiedPlayers, setVerifiedPlayers] = useState<VerifiedPlayer[]>([]);
  
  useEffect(() => {
    // Retrieve verified players from localStorage
    const storedPlayers = localStorage.getItem('warcrow_verified_players');
    if (storedPlayers) {
      try {
        const parsedPlayers = JSON.parse(storedPlayers);
        setVerifiedPlayers(parsedPlayers);
      } catch (e) {
        console.error('Error parsing verified players:', e);
      }
    }
  }, []);
  
  // Find winners and losers based on final scores
  const determineResults = () => {
    const playerEntries = Object.entries(state.players);
    if (playerEntries.length < 2) return { winners: [], losers: [] };
    
    // Sort players by score (highest first)
    const sortedPlayers = playerEntries.sort((a, b) => {
      const scoreA = a[1].score || 0;
      const scoreB = b[1].score || 0;
      return scoreB - scoreA;
    });
    
    // The highest score is the winner(s)
    const highestScore = sortedPlayers[0][1].score || 0;
    
    // Players with the highest score are winners, others are losers
    const winners = sortedPlayers
      .filter(([_, player]) => (player.score || 0) === highestScore)
      .map(([id, player]) => ({ id, player }));
      
    const losers = sortedPlayers
      .filter(([_, player]) => (player.score || 0) < highestScore)
      .map(([id, player]) => ({ id, player }));
    
    return { winners, losers };
  };
  
  const { winners, losers } = determineResults();
  
  const recordResults = async () => {
    if (verifiedPlayers.length === 0) {
      toast.info("No verified players to record results for");
      return;
    }
    
    setRecordingResults(true);
    
    // For each verified player, update their record in the database
    const { winners, losers } = determineResults();
    const updatePromises = [];
    const { data: { session } } = await supabase.auth.getSession();
    
    try {
      // Record game for each verified player
      for (const verifiedPlayer of verifiedPlayers) {
        // Find this player in the game results
        const isWinner = winners.some(w => 
          state.players[w.id].wab_id === verifiedPlayer.wab_id);
        
        // Update the player's record
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('games_won, games_lost')
          .eq('wab_id', verifiedPlayer.wab_id)
          .single();
          
        if (profileError) {
          console.error(`Error getting profile for ${verifiedPlayer.wab_id}:`, profileError);
          continue;
        }
        
        // Increment the appropriate counter
        const updates = isWinner
          ? { games_won: (profile.games_won || 0) + 1 }
          : { games_lost: (profile.games_lost || 0) + 1 };
          
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('wab_id', verifiedPlayer.wab_id);
          
        if (updateError) {
          console.error(`Error updating profile for ${verifiedPlayer.wab_id}:`, updateError);
          continue;
        }
        
        // If the user is logged in, record the game history
        if (session && session.user) {
          // Record in game history only for the current user
          const userProfile = await supabase
            .from('profiles')
            .select('wab_id')
            .eq('id', session.user.id)
            .single();
            
          if (!userProfile.error && userProfile.data.wab_id === verifiedPlayer.wab_id) {
            // Find opponent name - assume 2 player game
            const playerIds = Object.keys(state.players);
            const opponentId = playerIds.find(id => 
              state.players[id].wab_id !== verifiedPlayer.wab_id);
            const opponentName = opponentId ? state.players[opponentId].name : 'Unknown';
            
            const { error: historyError } = await supabase
              .from('game_history')
              .insert({
                user_id: session.user.id,
                opponent_name: opponentName,
                won: isWinner,
                played_at: new Date().toISOString()
              });
              
            if (historyError) {
              console.error('Error recording game history:', historyError);
            }
          }
        }
      }
      
      toast.success('Game results recorded successfully');
      // Clear stored players after recording
      localStorage.removeItem('warcrow_verified_players');
      setRecordingComplete(true);
    } catch (error) {
      console.error('Error recording game results:', error);
      toast.error('Error recording game results');
    } finally {
      setRecordingResults(false);
    }
  };
  
  if (verifiedPlayers.length === 0) {
    return (
      <Card className="border border-warcrow-gold/40 bg-warcrow-background">
        <CardHeader>
          <CardTitle className="text-warcrow-gold">Game Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-warcrow-muted">No verified players in this game. Results will not be recorded.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border border-warcrow-gold/40 bg-warcrow-background">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">Game Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {winners.length > 0 && (
          <div>
            <h3 className="font-medium text-lg mb-2 text-warcrow-text">Winner{winners.length > 1 ? 's' : ''}</h3>
            {winners.map(({ id, player }) => {
              const isVerified = verifiedPlayers.some(vp => vp.wab_id === player.wab_id);
              return (
                <div key={id} className="flex items-center gap-2 mb-1">
                  <Check className="text-green-500 w-4 h-4" />
                  <span className="text-warcrow-text">{player.name} - <span className="text-warcrow-gold">{player.score} points</span></span>
                  {isVerified && (
                    <Badge className="bg-warcrow-gold text-warcrow-background text-xs font-medium">
                      Verified
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {losers.length > 0 && (
          <div>
            <h3 className="font-medium text-lg mb-2 text-warcrow-text">Loser{losers.length > 1 ? 's' : ''}</h3>
            {losers.map(({ id, player }) => {
              const isVerified = verifiedPlayers.some(vp => vp.wab_id === player.wab_id);
              return (
                <div key={id} className="flex items-center gap-2 mb-1">
                  <X className="text-red-500 w-4 h-4" />
                  <span className="text-warcrow-text">{player.name} - <span className="text-warcrow-text/80">{player.score} points</span></span>
                  {isVerified && (
                    <Badge className="bg-warcrow-gold text-warcrow-background text-xs font-medium">
                      Verified
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <Separator className="bg-warcrow-gold/20" />
        
        <div>
          <p className="mb-4 text-warcrow-text/80">
            Recording results will update the win/loss record for all verified players in this game.
          </p>
          
          <Button
            onClick={recordResults}
            disabled={recordingResults || recordingComplete}
            className="w-full bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90 disabled:opacity-50"
          >
            {recordingResults ? 'Recording...' : recordingComplete ? 'Results Recorded' : 'Record Results'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameResults;
