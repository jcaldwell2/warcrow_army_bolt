
import React from 'react';
import { Target, Shield, Cloud, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Mission, Player } from '@/types/game';

interface MissionScoringProps {
  mission: Mission | null;
  players: Record<string, Player>;
  missionScoring: Record<string, Record<string, boolean>>;
  currentRound: number;
  toggleScoringCondition: (playerId: string, condition: string) => void;
  calculateVP: (playerId: string) => number;
  scoredFogMarkers?: Record<string, boolean>;
}

const MissionScoring: React.FC<MissionScoringProps> = ({
  mission,
  players,
  missionScoring,
  currentRound,
  toggleScoringCondition,
  calculateVP,
  scoredFogMarkers = {}
}) => {
  if (!mission) return null;

  if (mission.id === 'consolidated-progress') {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {Object.entries(players).map(([playerId, player], index) => {
            const isFirstPlayer = index === 0;
            const playerColor = isFirstPlayer ? "text-red-500" : "text-blue-500";
            const checkboxColor = isFirstPlayer 
              ? "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white" 
              : "border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white";
            const iconColor = isFirstPlayer ? "text-red-500" : "text-blue-500";
            
            return (
              <div key={playerId} className="p-3 border border-warcrow-gold/30 rounded-lg bg-warcrow-accent/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 bg-warcrow-accent rounded-full flex items-center justify-center ${isFirstPlayer ? "border-2 border-red-500/50" : "border-2 border-blue-500/50"}`}>
                    <Users className={`w-4 h-4 ${playerColor}`} />
                  </div>
                  <div>
                    <div className={`font-medium text-base ${playerColor}`}>{player.name}</div>
                    <div className="text-sm text-warcrow-muted">
                      <span className="text-right">Victory Points: {player.score || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${playerId}-central`} 
                      checked={missionScoring[playerId]?.central}
                      onCheckedChange={() => toggleScoringCondition(playerId, 'central')}
                      className={`${checkboxColor} h-5 w-5`}
                    />
                    <Label 
                      htmlFor={`${playerId}-central`}
                      className="text-base flex items-center gap-1 text-warcrow-text"
                    >
                      <img src="/art/icons/obj.png" alt="Neutral Flag" className="h-4 w-4" />
                      Control central objective (1 VP)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${playerId}-opponent1`} 
                      checked={missionScoring[playerId]?.opponent1}
                      onCheckedChange={() => toggleScoringCondition(playerId, 'opponent1')}
                      disabled={Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives}
                      className={`${checkboxColor} h-5 w-5`}
                    />
                    <Label 
                      htmlFor={`${playerId}-opponent1`}
                      className={cn(
                        "text-base flex items-center gap-1 text-warcrow-text",
                        Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives
                          ? "text-warcrow-muted" : ""
                      )}
                    >
                      <img 
                        src={isFirstPlayer ? "/art/icons/blue-obj.png" : "/art/icons/red-obj.png"} 
                        alt="Opponent Flag" 
                        className="h-4 w-4" 
                      />
                      Control opponent's objective 1 (1 VP)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${playerId}-opponent2`} 
                      checked={missionScoring[playerId]?.opponent2}
                      onCheckedChange={() => toggleScoringCondition(playerId, 'opponent2')}
                      disabled={Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives}
                      className={`${checkboxColor} h-5 w-5`}
                    />
                    <Label 
                      htmlFor={`${playerId}-opponent2`}
                      className={cn(
                        "text-base flex items-center gap-1 text-warcrow-text",
                        Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives
                          ? "text-warcrow-muted" : ""
                      )}
                    >
                      <img 
                        src={isFirstPlayer ? "/art/icons/blue-obj.png" : "/art/icons/red-obj.png"} 
                        alt="Opponent Flag" 
                        className="h-4 w-4" 
                      />
                      Control opponent's objective 2 (2 VP)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${playerId}-defend`} 
                      checked={missionScoring[playerId]?.defendObjectives}
                      onCheckedChange={() => toggleScoringCondition(playerId, 'defendObjectives')}
                      disabled={
                        Object.keys(players).find(id => id !== playerId) && (
                          missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent1 ||
                          missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent2
                        )
                      }
                      className={`${checkboxColor} h-5 w-5`}
                    />
                    <Label 
                      htmlFor={`${playerId}-defend`}
                      className={cn(
                        "text-base flex items-center gap-1 text-warcrow-text",
                        Object.keys(players).find(id => id !== playerId) && (
                          missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent1 ||
                          missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent2
                        ) ? "text-warcrow-muted" : ""
                      )}
                    >
                      <Shield className={`h-4 w-4 ${iconColor}`} />
                      Opponent controls neither of your objectives (1 VP)
                    </Label>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-warcrow-gold/20">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-medium text-warcrow-text">Round {currentRound}</div>
                      <div className={`text-2xl font-bold ${playerColor} text-right`}>
                        {calculateVP(playerId)} VP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  } else if (mission.id === 'take-positions') {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {Object.entries(players).map(([playerId, player], index) => {
            const isFirstPlayer = index === 0;
            const playerColor = isFirstPlayer ? "text-red-500" : "text-blue-500";
            const checkboxColor = isFirstPlayer 
              ? "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white" 
              : "border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white";
            const iconColor = isFirstPlayer ? "text-red-500" : "text-blue-500";
            
            return (
              <div key={playerId} className="p-3 border border-warcrow-gold/30 rounded-lg bg-warcrow-accent/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 bg-warcrow-accent rounded-full flex items-center justify-center ${isFirstPlayer ? "border-2 border-red-500/50" : "border-2 border-blue-500/50"}`}>
                    <Users className={`w-4 h-4 ${playerColor}`} />
                  </div>
                  <div>
                    <div className={`font-medium text-base ${playerColor}`}>{player.name}</div>
                    <div className="text-sm text-warcrow-muted">
                      <span className="text-right">Victory Points: {player.score || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${playerId}-opponent1`} 
                      checked={missionScoring[playerId]?.opponent1}
                      onCheckedChange={() => toggleScoringCondition(playerId, 'opponent1')}
                      disabled={Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives}
                      className={`${checkboxColor} h-5 w-5`}
                    />
                    <Label 
                      htmlFor={`${playerId}-opponent1`}
                      className={cn(
                        "text-base flex items-center gap-1 text-warcrow-text",
                        Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives
                          ? "text-warcrow-muted" : ""
                      )}
                    >
                      <img 
                        src={isFirstPlayer ? "/art/icons/blue-obj.png" : "/art/icons/red-obj.png"} 
                        alt="Opponent Flag" 
                        className="h-4 w-4" 
                      />
                      Control opponent's objective 1 (1 VP)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${playerId}-opponent2`} 
                      checked={missionScoring[playerId]?.opponent2}
                      onCheckedChange={() => toggleScoringCondition(playerId, 'opponent2')}
                      disabled={Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives}
                      className={`${checkboxColor} h-5 w-5`}
                    />
                    <Label 
                      htmlFor={`${playerId}-opponent2`}
                      className={cn(
                        "text-base flex items-center gap-1 text-warcrow-text",
                        Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives
                          ? "text-warcrow-muted" : ""
                      )}
                    >
                      <img 
                        src={isFirstPlayer ? "/art/icons/blue-obj.png" : "/art/icons/red-obj.png"} 
                        alt="Opponent Flag" 
                        className="h-4 w-4" 
                      />
                      Control opponent's objective 2 (1 VP)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${playerId}-defend`} 
                      checked={missionScoring[playerId]?.defendObjectives}
                      onCheckedChange={() => toggleScoringCondition(playerId, 'defendObjectives')}
                      disabled={
                        Object.keys(players).find(id => id !== playerId) && (
                          missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent1 ||
                          missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent2
                        )
                      }
                      className={`${checkboxColor} h-5 w-5`}
                    />
                    <Label 
                      htmlFor={`${playerId}-defend`}
                      className={cn(
                        "text-base flex items-center gap-1 text-warcrow-text",
                        Object.keys(players).find(id => id !== playerId) && (
                          missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent1 ||
                          missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent2
                        ) ? "text-warcrow-muted" : ""
                      )}
                    >
                      <Shield className={`h-4 w-4 ${iconColor}`} />
                      Opponent controls neither of your objectives (1 VP)
                    </Label>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-warcrow-gold/20">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-medium text-warcrow-text">Round {currentRound}</div>
                      <div className={`text-2xl font-bold ${playerColor} text-right`}>
                        {calculateVP(playerId)} VP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  } else if (mission.id === 'fog-of-death') {
    const availableFogMarkers = [
      { id: 'fogContact1', label: 'Fog Marker 1', available: !scoredFogMarkers.fogContact1 },
      { id: 'fogContact2', label: 'Fog Marker 2', available: !scoredFogMarkers.fogContact2 },
      { id: 'fogContact3', label: 'Fog Marker 3', available: !scoredFogMarkers.fogContact3 },
      { id: 'fogContact4', label: 'Fog Marker 4', available: !scoredFogMarkers.fogContact4 }
    ];
    
    const remainingMarkers = availableFogMarkers.filter(marker => marker.available).length;
    
    return (
      <>
        <div className="bg-warcrow-accent/30 p-3 rounded-md mb-3 text-sm flex items-center border border-warcrow-gold/20">
          <Cloud className="w-4 h-4 mr-2 text-warcrow-gold" />
          <span className="text-warcrow-text">
            {remainingMarkers} fog marker{remainingMarkers !== 1 ? 's' : ''} remaining 
            {scoredFogMarkers.fogContact1 || scoredFogMarkers.fogContact2 || 
             scoredFogMarkers.fogContact3 || scoredFogMarkers.fogContact4 ? 
              ' (used markers cannot be scored again)' : ''}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {Object.entries(players).map(([playerId, player], index) => {
            const isFirstPlayer = index === 0;
            const playerColor = isFirstPlayer ? "text-red-500" : "text-blue-500";
            const checkboxColor = isFirstPlayer 
              ? "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white" 
              : "border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white";
            const iconColor = isFirstPlayer ? "text-red-500" : "text-blue-500";
            
            return (
              <div key={playerId} className="p-3 border border-warcrow-gold/30 rounded-lg bg-warcrow-accent/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 bg-warcrow-accent rounded-full flex items-center justify-center ${isFirstPlayer ? "border-2 border-red-500/50" : "border-2 border-blue-500/50"}`}>
                    <Users className={`w-4 h-4 ${playerColor}`} />
                  </div>
                  <div>
                    <div className={`font-medium text-base ${playerColor}`}>{player.name}</div>
                    <div className="text-sm text-warcrow-muted">
                      <span className="text-right">Victory Points: {player.score || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-3">
                  <div className={`text-sm font-medium mb-1 text-warcrow-text`}>
                    Fog Marker Contact with Conquest Marker (1 VP each):
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {availableFogMarkers.map(marker => (
                      marker.available && missionScoring[playerId]?.[marker.id] !== undefined ? (
                        <div key={marker.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${playerId}-${marker.id}`} 
                            checked={missionScoring[playerId]?.[marker.id] || false}
                            onCheckedChange={() => toggleScoringCondition(playerId, marker.id)}
                            className={`${checkboxColor} h-5 w-5`}
                          />
                          <Label 
                            htmlFor={`${playerId}-${marker.id}`}
                            className="text-base text-warcrow-text"
                          >
                            {marker.label}
                          </Label>
                        </div>
                      ) : null
                    ))}
                  </div>
                  
                  {remainingMarkers === 0 && (
                    <div className="text-sm text-warcrow-muted mt-2 italic">
                      All fog markers have been used in previous rounds.
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Checkbox 
                      id={`${playerId}-control-artifact`} 
                      checked={missionScoring[playerId]?.controlArtifact || false}
                      onCheckedChange={() => toggleScoringCondition(playerId, 'controlArtifact')}
                      disabled={Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.controlArtifact}
                      className={`${checkboxColor} h-5 w-5`}
                    />
                    <Label 
                      htmlFor={`${playerId}-control-artifact`}
                      className={cn(
                        "text-base flex items-center gap-1 text-warcrow-text",
                        Object.keys(players).find(id => id !== playerId) && 
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.controlArtifact
                          ? "text-warcrow-muted" : ""
                      )}
                    >
                      <Target className={`h-4 w-4 ${iconColor}`} />
                      Control artifact at end of round (2 VP)
                    </Label>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-warcrow-gold/20">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-medium text-warcrow-text">Round {currentRound}</div>
                      <div className={`text-2xl font-bold ${playerColor} text-right`}>
                        {calculateVP(playerId)} VP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
  
  return null;
};

export default MissionScoring;
