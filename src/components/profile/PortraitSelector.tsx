
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { northernTribesHighCommand } from "@/data/factions/northern-tribes/high-command";
import { northernTribesTroops } from "@/data/factions/northern-tribes/troops";
import { northernTribesCharacters } from "@/data/factions/northern-tribes/characters";
import { syenannCharacters } from "@/data/factions/syenann/characters";
import { syenannTroops } from "@/data/factions/syenann/troops";
import { scionsOfYaldabaothUnits } from "@/data/factions/scions-of-yaldabaoth";
import { scionsOfYaldabaothCharacters } from "@/data/factions/scions-of-yaldabaoth/characters";
import { scionsOfYaldabaothHighCommand } from "@/data/factions/scions-of-yaldabaoth/high-command";
import { scionsOfYaldabaothTroops } from "@/data/factions/scions-of-yaldabaoth/troops";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { hegemonyHighCommand } from "@/data/factions/hegemony/high-command";
import { hegemonyTroops } from "@/data/factions/hegemony/troops";
import { hegemonyCharacters } from "@/data/factions/hegemony/characters";

// Combine all portrait sources
const getAllUnitPortraits = () => {
  const allUnits = [
    ...northernTribesHighCommand,
    ...northernTribesTroops,
    ...northernTribesCharacters,
    ...syenannCharacters,
    ...syenannTroops,
    ...scionsOfYaldabaothUnits,
    ...scionsOfYaldabaothCharacters,
    ...scionsOfYaldabaothHighCommand,
    ...scionsOfYaldabaothTroops,
    ...hegemonyHighCommand,
    ...hegemonyTroops,
    ...hegemonyCharacters,
  ];
  
  return allUnits
    .filter(unit => unit.imageUrl) // Only include units with images
    .map(unit => ({
      id: unit.id,
      name: unit.name,
      faction: unit.faction,
      imageUrl: unit.imageUrl?.replace('/art/card/', '/art/portrait/').replace('_card.jpg', '_portrait.jpg')
    }));
};

interface PortraitSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPortrait: (url: string) => void;
}

export const PortraitSelector = ({
  open,
  onOpenChange,
  onSelectPortrait,
}: PortraitSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allPortraits, setAllPortraits] = useState<Array<{id: string, name: string, faction: string, imageUrl: string}>>([]);
  
  useEffect(() => {
    // Initialize portraits on component mount
    setAllPortraits(getAllUnitPortraits());
  }, []);
  
  const filteredPortraits = searchQuery.trim() 
    ? allPortraits.filter(portrait => 
        portrait.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allPortraits;
  
  // Group portraits by faction
  const northernTribesPortraits = filteredPortraits.filter(p => p.faction === 'northern-tribes');
  const syenannPortraits = filteredPortraits.filter(p => p.faction === 'syenann');
  const scionsPortraits = filteredPortraits.filter(p => p.faction === 'scions-of-yaldabaoth');
  const hegemonyPortraits = filteredPortraits.filter(p => p.faction === 'hegemony-of-embersig');
  
  const handleSelectPortrait = (url: string) => {
    onSelectPortrait(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-warcrow-background border-warcrow-gold/30 text-warcrow-text">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">Select Character Portrait</DialogTitle>
          <DialogDescription className="text-warcrow-text/80">
            Choose a character portrait for your profile avatar
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-warcrow-text/50" />
          <Input
            placeholder="Search portraits..."
            className="pl-8 bg-black/40 border-warcrow-gold/30 text-warcrow-text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-black/40">
            <TabsTrigger className="data-[state=active]:text-warcrow-gold" value="all">All</TabsTrigger>
            <TabsTrigger className="data-[state=active]:text-warcrow-gold" value="northern-tribes">Northern Tribes</TabsTrigger>
            <TabsTrigger className="data-[state=active]:text-warcrow-gold" value="syenann">Syenann</TabsTrigger>
            <TabsTrigger className="data-[state=active]:text-warcrow-gold" value="scions-of-yaldabaoth">Scions</TabsTrigger>
            <TabsTrigger className="data-[state=active]:text-warcrow-gold" value="hegemony-of-embersig">Hegemony</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ScrollArea className="h-60">
              <div className="grid grid-cols-4 gap-2 p-2">
                {filteredPortraits.map(portrait => (
                  <Avatar
                    key={portrait.id}
                    className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-warcrow-gold transition-all"
                    onClick={() => handleSelectPortrait(portrait.imageUrl)}
                  >
                    <AvatarImage src={portrait.imageUrl} alt={portrait.name} />
                    <AvatarFallback className="bg-black text-warcrow-gold text-xs">
                      {portrait.name.split(' ').map(word => word[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="northern-tribes">
            <ScrollArea className="h-60">
              <div className="grid grid-cols-4 gap-2 p-2">
                {northernTribesPortraits.map(portrait => (
                  <Avatar
                    key={portrait.id}
                    className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-warcrow-gold transition-all"
                    onClick={() => handleSelectPortrait(portrait.imageUrl)}
                  >
                    <AvatarImage src={portrait.imageUrl} alt={portrait.name} />
                    <AvatarFallback className="bg-black text-warcrow-gold text-xs">
                      {portrait.name.split(' ').map(word => word[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="syenann">
            <ScrollArea className="h-60">
              <div className="grid grid-cols-4 gap-2 p-2">
                {syenannPortraits.map(portrait => (
                  <Avatar
                    key={portrait.id}
                    className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-warcrow-gold transition-all"
                    onClick={() => handleSelectPortrait(portrait.imageUrl)}
                  >
                    <AvatarImage src={portrait.imageUrl} alt={portrait.name} />
                    <AvatarFallback className="bg-black text-warcrow-gold text-xs">
                      {portrait.name.split(' ').map(word => word[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="scions-of-yaldabaoth">
            <ScrollArea className="h-60">
              <div className="grid grid-cols-4 gap-2 p-2">
                {scionsPortraits.map(portrait => (
                  <Avatar
                    key={portrait.id}
                    className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-warcrow-gold transition-all"
                    onClick={() => handleSelectPortrait(portrait.imageUrl)}
                  >
                    <AvatarImage src={portrait.imageUrl} alt={portrait.name} />
                    <AvatarFallback className="bg-black text-warcrow-gold text-xs">
                      {portrait.name.split(' ').map(word => word[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="hegemony-of-embersig">
            <ScrollArea className="h-60">
              <div className="grid grid-cols-4 gap-2 p-2">
                {hegemonyPortraits.map(portrait => (
                  <Avatar
                    key={portrait.id}
                    className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-warcrow-gold transition-all"
                    onClick={() => handleSelectPortrait(portrait.imageUrl)}
                  >
                    <AvatarImage src={portrait.imageUrl} alt={portrait.name} />
                    <AvatarFallback className="bg-black text-warcrow-gold text-xs">
                      {portrait.name.split(' ').map(word => word[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
