
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mission } from "./types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { GameSymbol } from "@/components/stats/GameSymbol";
import { useLanguage } from "@/contexts/LanguageContext";

const MISSION_IMAGES: Record<string, string> = {
  'Consolidated Progress': '/art/missions/consolidated_progress.jpg',
  'Take Positions': '/art/missions/take_positions.jpg',
  'Fog of Death': '/art/missions/fog_of_death.jpg',
  'Tree Mother': '/art/missions/tree_mother.jpg',
  'Breached Front': '/art/missions/breached_front.jpg',
  'Battle Lines': '/art/missions/battle_lines.jpg',
  'Ghosts from the Mist': '/art/missions/ghosts_from_the_mist.jpg',
  'Sacred Land': '/art/missions/sacred_lands.jpg',
  'Rescue Mission': '/art/missions/rescue_mission.jpg',
};

// Special card images for missions that have them
const MISSION_CARD_IMAGES: Record<string, string> = {
  'Tree Mother': '/art/missions/tree_mother_card.jpg',
};

// Map dice symbols to character codes for the Warcrow font and their colors
const DICE_CODES: Record<string, { code: number; color: string; bgColor: string }> = {
  '[d1]': { code: 49, color: '#FCD34D', bgColor: '#433519' }, // Yellow star/success with dark brown bg
  '[d7]': { code: 55, color: '#000000', bgColor: '#d1d1d1' }, // Black shield/defense with light gray bg
  '[d9]': { code: 57, color: '#22C55E', bgColor: '#1a3a28' }, // Green shield with dark green bg
};

const HIGHLIGHTED_WORDS = [
  'Preparation',
  'Event',
  'Rounds',
  'Scoring',
  'Arcane artefact',
  'Fog effects',
  'End of the game',
  'End of game',
  'Special Rules',
  'The Tree Mother',
  'Event 1: The Tree Mother',
  'Woods',
  'Sÿena sprouts',
  'Destroy a sprout',
  'Return home',
  'Prayers and Offerings',
  'Pray',
  'Deity Offering',
  'Rescuing the wounded',
  'Ensure survival',
  'Avenge the fallen'
];

interface MissionDetailsProps {
  mission: Mission | null;
  isLoading: boolean;
  language?: string;
}

export const MissionDetails = ({ mission, isLoading }: MissionDetailsProps) => {
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const { t } = useLanguage();

  if (!mission) {
    return (
      <div className="text-warcrow-text text-center py-8 bg-black/50 rounded-md border border-warcrow-gold/10">
        {isLoading ? t('loadingMissionDetails') : t('selectMissionToView')}
      </div>
    );
  }

  const isCommunityMission = mission.isHomebrew;
  const isOfficialMission = !mission.isHomebrew;
  const hasCardImage = MISSION_CARD_IMAGES[mission.title] !== undefined;

  const formatText = (text: string) => {
    let formattedText = text;
    
    // First replace dice placeholders with temporary markers
    Object.keys(DICE_CODES).forEach(diceKey => {
      const regex = new RegExp(`\\${diceKey}`, 'g');
      formattedText = formattedText.replace(regex, `###DICE${diceKey}###`);
    });

    // Then handle regular highlighted words
    HIGHLIGHTED_WORDS.forEach(word => {
      const regex = new RegExp(`(${word})`, 'g');
      formattedText = formattedText.replace(regex, `<span class="font-bold text-[1.125em]">$1</span>`);
    });

    return formattedText;
  };

  const renderTextWithDice = (text: string) => {
    // Update the "Woods" section with the new text
    let updatedText = text;
    const woodsSectionOld = "Woods\nWoods in the blue deployment zone have the keywords:\nBlock LoS and Cover (7).";
    const woodsSectionNew = "Woods\nWoods in the blue deployment zone have the keywords:\nBlock LoS and Cover (BLK).";
    
    if (updatedText.includes(woodsSectionOld)) {
      updatedText = updatedText.replace(woodsSectionOld, woodsSectionNew);
    }
    
    const formattedText = formatText(updatedText);
    const parts = formattedText.split(/(###DICE\[d[1-9]\]###)/g);

    return parts.map((part, index) => {
      const diceMatch = part.match(/###DICE\[d([1-9])\]###/);
      if (diceMatch) {
        const diceType = `[d${diceMatch[1]}]`;
        const diceInfo = DICE_CODES[diceType];
        
        return (
          <GameSymbol 
            key={index}
            code={diceInfo.code}
            size="xl" // Increased from "md" to "xl"
            className="inline-block mx-1 rounded px-1"
            style={{ 
              color: diceInfo.color,
              backgroundColor: diceInfo.bgColor
            }}
          />
        );
      }
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    });
  };

  return (
    <div className="space-y-6 bg-black/70 p-6 rounded-lg border border-warcrow-gold/20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
          {mission.title}
        </h2>
        <div className="flex gap-2">
          {isOfficialMission && (
            <Badge variant="secondary" className="bg-warcrow-gold/20 text-warcrow-gold border-warcrow-gold/40">
              {t('official')}
            </Badge>
          )}
          {isCommunityMission && (
            <Badge variant="outline" className="bg-purple-800/40 text-purple-200 border-purple-600">
              {t('community')}
            </Badge>
          )}
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-32rem)] pr-4">
        <div className="text-warcrow-text whitespace-pre-wrap">
          {renderTextWithDice(mission.details)}
        </div>
      </ScrollArea>
      <div className="w-full mt-6">
        {/* Display card image if available */}
        {hasCardImage && (
          <div className="mb-4">
            <button 
              onClick={() => setIsCardDialogOpen(true)}
              className="relative group w-full cursor-pointer"
            >
              <img
                src={MISSION_CARD_IMAGES[mission.title]}
                alt={`${mission.title} ${t('missionCard')}`}
                className="w-full rounded-lg shadow-lg object-contain max-h-[300px] transition-opacity group-hover:opacity-90"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/70 p-3 rounded-full">
                  <ZoomIn className="h-6 w-6 text-warcrow-gold" />
                </div>
              </div>
            </button>
          </div>
        )}
        {/* Display mission image */}
        <img
          src={MISSION_IMAGES[mission.title] || '/placeholder.svg'}
          alt={`${mission.title} ${t('mission')}`}
          className="w-full rounded-lg shadow-lg object-contain max-h-[400px]"
        />
        {isCommunityMission && mission.communityCreator && (
          <div className="mt-2 text-center italic text-purple-300/80 text-sm">
            {t('missionCreatedBy')} {mission.communityCreator}
          </div>
        )}
      </div>
      
      {/* Dialog for enlarged card image */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent className="max-w-4xl p-1 bg-black border-warcrow-gold/30">
          <img
            src={hasCardImage ? MISSION_CARD_IMAGES[mission.title] : ''}
            alt={`${mission.title} ${t('missionCardEnlarged')}`}
            className="w-full object-contain max-h-[80vh]"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
