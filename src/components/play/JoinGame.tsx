
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from "sonner";
import { ArrowRight, Search, Users, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useGame } from '@/context/GameContext';
import { validateJoinCode } from '@/utils/joinCodeUtils';

interface GameInfo {
  id: string;
  code: string;
  host_name: string;
  mission_name: string;
  created_at: string;
  player_count: number;
}

const JoinGame = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [gameCode, setGameCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recentGames, setRecentGames] = useState<GameInfo[]>([]);
  const [isLoadingRecentGames, setIsLoadingRecentGames] = useState(true);

  useEffect(() => {
    const fetchRecentGames = async () => {
      setIsLoadingRecentGames(true);
      try {
        // For now, just show an empty list since we don't have an actual games table
        // In a real implementation, we would fetch from game_join_codes table
        setRecentGames([]);
      } catch (err) {
        console.error('Unexpected error fetching games:', err);
      } finally {
        setIsLoadingRecentGames(false);
      }
    };

    fetchRecentGames();
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip spaces and convert to uppercase
    const formattedCode = e.target.value.replace(/\s/g, '').toUpperCase();
    setGameCode(formattedCode);
  };

  const joinGameByCode = async () => {
    if (!validateJoinCode(gameCode)) {
      toast.error('Please enter a valid game code');
      return;
    }

    setIsSearching(true);
    try {
      // In a real implementation, we would:
      // 1. Look up the code in the game_join_codes table
      // 2. Get the game_id and fetch the associated game data
      
      // For now, we'll simulate joining a game
      const mockGameData = {
        id: `game-${Date.now()}`,
        host_name: 'Sample Host',
        current_phase: 'deployment'
      };
      
      // Store the game info in local storage
      localStorage.setItem('warcrow_joined_game', JSON.stringify(mockGameData));
      
      // Reset current game state
      dispatch({ type: 'RESET_GAME' });
      
      // Navigate to the game's deployment phase
      toast.success(`Joining game hosted by ${mockGameData.host_name}`);
      navigate(`/deployment/${mockGameData.id}`);
      
    } catch (err) {
      console.error('Error joining game:', err);
      toast.error('Failed to join game. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  const joinRecentGame = (game: GameInfo) => {
    localStorage.setItem('warcrow_joined_game', JSON.stringify(game));
    dispatch({ type: 'RESET_GAME' });
    toast.success(`Joining game hosted by ${game.host_name}`);
    navigate(`/deployment/${game.id}`);
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="bg-warcrow-background border-warcrow-gold/30">
        <CardHeader>
          <CardTitle className="text-warcrow-gold text-xl">Join Game</CardTitle>
          <CardDescription>
            Enter a game code or select from recent public games to join
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-warcrow-gold font-medium mb-2 flex items-center">
                <KeyRound className="mr-2 h-4 w-4" />
                Enter Game Code
              </h3>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={gameCode}
                  onChange={handleCodeChange}
                  placeholder="Enter 6-digit code"
                  className="bg-warcrow-background border-warcrow-gold/50 text-warcrow-text"
                  maxLength={6}
                />
                <Button 
                  onClick={joinGameByCode}
                  disabled={isSearching || gameCode.length < 6}
                  className="bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
                >
                  {isSearching ? 'Searching...' : (
                    <>
                      <Search className="mr-1 h-4 w-4" />
                      Find
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-warcrow-gold font-medium mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Recent Public Games
              </h3>
              
              {isLoadingRecentGames ? (
                <div className="text-center py-8">
                  <div className="animate-pulse text-warcrow-gold/50">Loading games...</div>
                </div>
              ) : recentGames.length > 0 ? (
                <div className="space-y-2">
                  {recentGames.map(game => (
                    <div 
                      key={game.id}
                      className="p-3 border border-warcrow-gold/30 rounded-md flex justify-between items-center hover:bg-warcrow-gold/5 cursor-pointer transition-colors"
                      onClick={() => joinRecentGame(game)}
                    >
                      <div>
                        <div className="font-medium text-warcrow-text">Hosted by {game.host_name}</div>
                        <div className="text-sm text-warcrow-text/70">
                          Mission: {game.mission_name || 'Custom Mission'}
                        </div>
                        <div className="text-xs text-warcrow-text/50 mt-1">
                          Players: {game.player_count || 2} • Code: {game.code}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-warcrow-gold"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-warcrow-gold/20 rounded-md bg-warcrow-background/30">
                  <div className="text-warcrow-text/60">No public games found</div>
                  <div className="text-xs text-warcrow-text/40 mt-1">Try entering a game code instead</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-warcrow-gold/20 pt-4">
          <div className="text-sm text-warcrow-text/60">
            Game codes are provided by your friend or host when they create a game
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JoinGame;
