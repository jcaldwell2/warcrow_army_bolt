
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mission } from "./types";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface MissionListProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onSelectMission: (mission: Mission) => void;
  isLoading: boolean;
  language: string;
}

export const MissionList = ({ 
  missions, 
  selectedMission, 
  onSelectMission, 
  isLoading 
}: MissionListProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="bg-warcrow-accent p-6">
      <h2 className="text-xl font-bold text-warcrow-gold mb-4">{t('missions')}</h2>
      {isLoading ? (
        <div className="text-warcrow-text text-center py-4">{t('loadingMissions')}</div>
      ) : (
        <div className="space-y-2">
          {missions.map((mission) => {
            const isCommunityMission = mission.isHomebrew;
            const isOfficialMission = !mission.isHomebrew;
            
            return (
              <Button
                key={mission.id}
                variant="ghost"
                className={`w-full justify-start text-lg font-medium ${
                  selectedMission?.id === mission.id
                    ? "text-warcrow-gold bg-black/20"
                    : "text-warcrow-text hover:text-warcrow-gold hover:bg-black/20"
                } ${isCommunityMission ? "border-l-4 border-purple-600" : ""}`}
                onClick={() => onSelectMission(mission)}
              >
                {mission.title}
                <div className="ml-auto flex gap-2">
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
              </Button>
            );
          })}
        </div>
      )}
    </Card>
  );
};
