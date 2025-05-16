
import React, { useState } from 'react';
import { Player, GameState } from '@/types/game';
import { Button } from '@/components/ui/button';
import { FileText, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface FinalScoresProps {
  players: Player[];
  gameState: GameState;
  onEditRoundScore?: (roundNumber: number) => void;
}

const FinalScores: React.FC<FinalScoresProps> = ({ 
  players, 
  gameState,
  onEditRoundScore 
}) => {
  const orderedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const [viewingList, setViewingList] = useState<Player | null>(null);
  const isMobile = useIsMobile();
  
  // Helper function to safely get faction name
  const getFactionName = (player: Player): string => {
    if (!player.faction) return 'Unknown Faction';
    
    if (typeof player.faction === 'object' && player.faction !== null) {
      return player.faction.name || 'Unknown Faction';
    }
    
    return typeof player.faction === 'string' ? player.faction : 'Unknown Faction';
  };
  
  return (
    <motion.div>
      <Card className="p-4 sm:p-6 border border-warcrow-gold/40 shadow-sm bg-warcrow-background">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-warcrow-gold">Final Scores</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
              >
                <ListChecks className="mr-2 h-4 w-4" />
                View Army Lists
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] bg-warcrow-background border border-warcrow-gold/30">
              <DialogHeader>
                <DialogTitle className="text-warcrow-gold">Army Lists</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] mt-4">
                <Accordion type="single" collapsible className="w-full">
                  {orderedPlayers.map((player) => (
                    player.list && player.id && (
                      <AccordionItem key={player.id} value={player.id} className="border-warcrow-gold/20">
                        <AccordionTrigger className="font-medium text-warcrow-text hover:text-warcrow-gold">
                          {player.name}'s Army - {getFactionName(player)}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-warcrow-accent/30 rounded-md p-4 my-2 overflow-auto max-h-[400px]">
                            <pre className="whitespace-pre-wrap text-sm font-mono text-warcrow-text">{player.list}</pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  ))}
                </Accordion>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="overflow-auto">
          <Table className="w-full">
            <TableCaption className="text-warcrow-muted">A summary of the final scores for each player.</TableCaption>
            <TableHeader>
              <TableRow className="border-warcrow-gold/20">
                <TableHead className="text-warcrow-gold w-1/3">Player</TableHead>
                <TableHead className="text-warcrow-gold w-1/3">Faction</TableHead>
                <TableHead className="text-warcrow-gold w-1/3">Final VP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedPlayers.map((player) => (
                <TableRow key={player.id || player.name} className="border-warcrow-gold/20 hover:bg-warcrow-accent/20">
                  <TableCell className="font-medium text-warcrow-text p-3 sm:p-4">{player.name}</TableCell>
                  <TableCell className="text-warcrow-text p-3 sm:p-4 break-words">{getFactionName(player)}</TableCell>
                  <TableCell className="p-3 sm:p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-medium text-warcrow-gold">{player.score} VP</span>
                      {player.list && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setViewingList(player)}
                          className={`flex items-center text-xs text-warcrow-text hover:text-warcrow-gold ${isMobile ? 'px-1' : ''}`}
                        >
                          <FileText className="mr-1 w-3 h-3" />
                          <span>{isMobile ? '' : 'List'}</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      <Dialog open={!!viewingList} onOpenChange={(open) => !open && setViewingList(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] bg-warcrow-background border border-warcrow-gold/30">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">
              {viewingList?.name}'s Army List - {viewingList ? getFactionName(viewingList) : 'Unknown Faction'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] mt-4">
            {viewingList?.list && (
              <div className="bg-warcrow-accent/30 rounded-md p-4 my-2">
                <pre className="whitespace-pre-wrap text-sm font-mono text-warcrow-text">{viewingList.list}</pre>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FinalScores;
