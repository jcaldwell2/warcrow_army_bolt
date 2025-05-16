
import React from 'react';
import { format } from 'date-fns';
import { Player, GameState } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface GameSummaryHeaderProps {
  gameState: GameState;
  winner: Player | undefined;
}

const GameSummaryHeader: React.FC<GameSummaryHeaderProps> = ({ gameState, winner }) => {
  const players = Object.values(gameState.players) as Player[];
  const orderedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM dd, yyyy hh:mm a');
  };

  // Helper function to safely get faction name
  const getFactionName = (player?: Player): string => {
    if (!player || !player.faction) return 'Unknown';
    
    if (typeof player.faction === 'object' && player.faction !== null) {
      return player.faction.name || 'Unknown';
    }
    
    return typeof player.faction === 'string' ? player.faction : 'Unknown';
  };

  const handleShare = async () => {
    try {
      const shareText = `Game Summary
Mission: ${gameState.mission?.name || gameState.mission?.title || 'Custom Mission'}
Winner: ${winner?.name || 'No winner'} (${getFactionName(winner)})
Final Scores: ${orderedPlayers.map(p => `${p.name}: ${p.score} VP`).join(', ')}
`;

      if (navigator.share) {
        await navigator.share({
          title: 'Warcrow Companion Game Summary',
          text: shareText,
        });
        toast.success('Game summary shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Game summary copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing game summary:', error);
      toast.error('Failed to share game summary');
    }
  };

  return (
    <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-warcrow-background">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-center text-warcrow-gold">Game Summary</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShare}
          className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
        >
          <Share2 className="mr-2 w-4 h-4" />
          Share
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-warcrow-gold">Mission</h3>
          <p className="text-warcrow-text">{gameState.mission?.name || gameState.mission?.title || 'No mission selected'}</p>
          {gameState.mission?.description && (
            <p className="text-sm text-warcrow-muted italic">{gameState.mission.description}</p>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-warcrow-gold">Winner</h3>
          <p className="text-warcrow-text">
            {winner?.name || 'No winner'} 
            {winner?.score !== undefined && ` (${winner.score} VP)`}
          </p>
          <p className="text-sm text-warcrow-muted">
            {getFactionName(winner)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-warcrow-gold">Game Start</h3>
          <p className="text-warcrow-text">
            {gameState.gameStartTime ? formatDate(gameState.gameStartTime) : 'Not available'}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-warcrow-gold">Game End</h3>
          <p className="text-warcrow-text">
            {gameState.gameEndTime ? formatDate(gameState.gameEndTime) : 'Not available'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-warcrow-gold">First to Deploy</h3>
          <p className="text-warcrow-text">
            {gameState.firstToDeployPlayerId 
              ? players.find(p => p.id === gameState.firstToDeployPlayerId)?.name || 'Unknown' 
              : 'Not recorded'}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-warcrow-gold">Initial Initiative</h3>
          <p className="text-warcrow-text">
            {gameState.initialInitiativePlayerId 
              ? players.find(p => p.id === gameState.initialInitiativePlayerId)?.name || 'Unknown' 
              : 'Not recorded'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default GameSummaryHeader;
