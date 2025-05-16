
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import JoinCodeShare from './JoinCodeShare';
import { Mission, Player } from '@/types/game';

interface UserProfile {
  id: string;
  username: string;
  wab_id: string;
  avatar_url?: string;
}

interface GamePlayer {
  id: string;
  name: string;
  faction: {
    id: string;
    name: string;
    icon?: string;
  } | null;
  list: string | null;
  wab_id?: string;
  verified?: boolean;
  avatar_url?: string;
}

interface GameSetupProps {
  onStartGame: () => void;
  onComplete?: (players: GamePlayer[], mission: Mission) => Promise<void>;
  currentUser?: UserProfile | null;
  isLoading?: boolean;
}

const GameSetup: React.FC<GameSetupProps> = ({
  onStartGame,
  onComplete,
  currentUser,
  isLoading = false
}) => {
  const [playerName, setPlayerName] = useState<string>('');
  const [player2Name, setPlayer2Name] = useState<string>('Player 2');
  const [showJoinCodeDialog, setShowJoinCodeDialog] = useState(false);
  const [gameId] = useState<string>(`game-${Date.now()}`);

  useEffect(() => {
    if (currentUser && !isLoading) {
      setPlayerName(currentUser.username);
    }
  }, [currentUser, isLoading]);

  const handleStartGame = () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name before starting');
      return;
    }
    
    // Store player names in local storage for use in deployment
    localStorage.setItem('warcrow_host_name', playerName);
    localStorage.setItem('warcrow_player2_name', player2Name);
    
    if (onComplete) {
      const players: GamePlayer[] = [
        {
          id: 'player-1',
          name: playerName,
          faction: null,
          list: null,
          verified: currentUser ? true : false,
          wab_id: currentUser?.wab_id,
          avatar_url: currentUser?.avatar_url
        },
        {
          id: 'player-2',
          name: player2Name,
          faction: null,
          list: null
        }
      ];
      
      // Use a default mission if none is selected yet
      const defaultMission: Mission = {
        id: 'take-positions',
        name: 'Take Positions',
        description: 'Control key strategic locations on the battlefield.',
        objective: 'Control objectives',
        objectiveDescription: 'Control the most objective markers'
      };
      
      onComplete(players, defaultMission).catch(error => {
        console.error('Error completing setup:', error);
        toast.error('Failed to complete setup');
      });
    } else {
      onStartGame();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-8 min-h-[200px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-pulse text-warcrow-gold">Loading user data...</div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-warcrow-gold mb-4">Host New Game</h2>
            
            <div className="space-y-4">
              <Label htmlFor="player-name" className="text-base font-medium flex items-center gap-2 text-warcrow-text">
                <User className="w-5 h-5 text-warcrow-gold" />
                <span>Your Name {currentUser ? '(Signed In)' : ''}</span>
              </Label>
              <Input
                id="player-name"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="h-12 bg-warcrow-accent border-warcrow-gold/40 text-warcrow-text focus-visible:ring-warcrow-gold"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="player2-name" className="text-base font-medium flex items-center gap-2 text-warcrow-text">
                <User className="w-5 h-5 text-warcrow-gold" />
                <span>Player 2 Name</span>
              </Label>
              <Input
                id="player2-name"
                placeholder="Enter player 2 name"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="h-12 bg-warcrow-accent border-warcrow-gold/40 text-warcrow-text focus-visible:ring-warcrow-gold"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowJoinCodeDialog(true)}
          className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/10 disabled:opacity-50"
        >
          Share Invite Code
        </Button>
        
        <Button
          onClick={handleStartGame}
          className="w-32 bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
          disabled={isLoading || !playerName.trim()}
        >
          Start Game
        </Button>
      </div>

      <JoinCodeShare 
        gameId={gameId} 
        hostName={playerName}
        isOpen={showJoinCodeDialog} 
        onClose={() => setShowJoinCodeDialog(false)}
      />
    </div>
  );
};

export default GameSetup;
