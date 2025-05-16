
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatJoinCode } from '@/utils/joinCodeUtils';

interface JoinCodeShareProps {
  gameId: string;
  hostName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const JoinCodeShare = ({ gameId, hostName = "Host", isOpen, onClose }: JoinCodeShareProps) => {
  const [copied, setCopied] = useState(false);
  const gameCode = gameId.slice(0, 6).toUpperCase(); // Use the first 6 chars of gameId as code for simplicity
  const formattedCode = formatJoinCode(gameCode);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    toast.success('Game code copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const shareGame = () => {
    const shareText = `Join my Warcrow game! Use code: ${gameCode} hosted by ${hostName}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join my Warcrow game',
        text: shareText,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      copyToClipboard();
    }
  };

  // If component is used as a modal/dialog and isOpen is false, don't render anything
  if (isOpen === false) return null;

  return (
    <Card className="bg-warcrow-background border-warcrow-gold/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-warcrow-gold">Game Invite Code</CardTitle>
        <CardDescription>Share this code with friends so they can join your game</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center p-4 bg-warcrow-accent/20 rounded-lg border border-warcrow-gold/30">
          <div className="text-3xl font-bold tracking-wider text-warcrow-gold mb-2">
            {formattedCode}
          </div>
          <div className="text-sm text-warcrow-text/70">
            Game hosted by <span className="font-medium">{hostName}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={copyToClipboard} 
            variant="outline" 
            className="flex-1 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/10"
          >
            {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            {copied ? 'Copied' : 'Copy Code'}
          </Button>
          
          <Button 
            onClick={shareGame} 
            className="flex-1 bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share Invite
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-warcrow-text/60 pt-0">
        {onClose && (
          <Button 
            onClick={onClose} 
            variant="ghost" 
            className="w-full mt-2 text-warcrow-text/70 hover:text-warcrow-text"
          >
            Close
          </Button>
        )}
        {!onClose && (
          <div className="w-full">
            Players can enter this code in the "Join Game" section to join your game
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default JoinCodeShare;
