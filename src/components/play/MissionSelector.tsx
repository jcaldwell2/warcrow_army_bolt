
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Mission } from '@/types/game';

interface MissionSelectorProps {
  selectedMission?: Mission | null;
  onSelect?: (mission: Mission) => void; // Add this property to match the usage in Deployment.tsx
  onSelectMission?: (mission: Mission) => void; // Keep this for backward compatibility
}

const MissionSelector: React.FC<MissionSelectorProps> = ({ 
  selectedMission: externalSelectedMission, 
  onSelect,
  onSelectMission 
}) => {
  const { state, dispatch } = useGame();
  
  const missions: Mission[] = [
    {
      id: 'take-positions',
      title: 'Take Positions',
      name: 'Take Positions',
      description: 'Control key strategic locations on the battlefield.',
      objective: 'Control objectives',
      details: 'Players compete to control 5 objective markers placed across the battlefield. Points are awarded at the end of each round based on the number of objectives controlled.',
      objectiveDescription: 'Control the most objective markers',
      turnCount: 6,
      roundCount: 3,
      specialRules: ['Objectives are placed before deployment', 'Control is determined by unit proximity'],
      mapImage: '/art/missions/take_positions.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Alpha', value: 1 },
        { id: 'obj2', name: 'Bravo', value: 1 },
        { id: 'obj3', name: 'Charlie', value: 1 },
        { id: 'obj4', name: 'Delta', value: 1 },
        { id: 'obj5', name: 'Echo', value: 1 }
      ],
      isOfficial: true
    },
    {
      id: 'consolidated-progress',
      title: 'Consolidated Progress',
      name: 'Consolidated Progress',
      description: 'Maintain control of your territory while advancing into enemy territory.',
      objective: 'Control objectives in sequence',
      details: 'Players must hold their starting objectives while advancing to capture enemy objectives. Points are awarded for holding objectives in your zone and in the enemy zone.',
      objectiveDescription: 'Hold your objectives and capture enemy objectives',
      turnCount: 5,
      roundCount: 3,
      specialRules: ['Deployment zones determined before placement', 'Objectives must be captured in order'],
      mapImage: '/art/missions/consolidated_progress.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Home Base', value: 1 },
        { id: 'obj2', name: 'Forward Base', value: 2 },
        { id: 'obj3', name: 'Center', value: 3 },
        { id: 'obj4', name: 'Enemy Forward', value: 4 },
        { id: 'obj5', name: 'Enemy Base', value: 5 }
      ],
      isOfficial: true
    },
    {
      id: 'fog-of-death',
      title: 'Fog of Death',
      name: 'Fog of Death',
      description: 'Battle amid an unnatural fog that spreads death and confusion.',
      objective: 'Survive and eliminate',
      details: 'A deadly fog covers the battlefield, moving each round. Players score points for surviving units and eliminating enemy units while avoiding the fog.',
      objectiveDescription: 'Avoid the deadly fog while eliminating enemies',
      turnCount: 4,
      roundCount: 4,
      specialRules: ['Fog movement determined at start of each round', 'Units in fog take damage', 'Limited visibility'],
      mapImage: '/art/missions/fog_of_death.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Safe Zone Alpha', value: 2 },
        { id: 'obj2', name: 'Safe Zone Bravo', value: 2 },
        { id: 'obj3', name: 'Safe Zone Charlie', value: 2 }
      ],
      isOfficial: true
    },
    {
      id: 'tree-mother',
      title: 'Tree Mother',
      name: 'Tree Mother',
      description: 'Protect or destroy the sacred Tree Mother and her sprouts.',
      objective: 'Defend/Attack tree assets',
      details: 'Preparation\nThe battlefield is 60x60 strides in size.\nGame size: 205 points.\n• Blue deployment zone: Sÿenann (defending side)\n• Red deployment zone: Raiders (attacking side)\nBefore starting the game, randomly place one of the\nfollowing tokens on each of the objectives:\n• Tinge token.\n• Damage token.\n• Command token.\n• Activation token.\nPlace Event 1 token in position 1 on the turn counter.\n\nThe Tree Mother\nTo represent the Tree Mother, use a 60mm base.\n\nRounds\n• The first round lasts 5 turns.\n• The second round lasts 4 turns.\n• The third round lasts 3 turns.\n• The fourth round lasts 2 turns.\n\nEvent 1: The Tree Mother\nWhen this event is triggered do the following:\n• Forest Protectors. A Nemorous Sÿenann Character\ncan be stressed so that the Mother Tree is considered\nan ally of the Sÿenann during its activation.\n• The Tree Mother is activated (use the behavior on\nits profile).\n• Advance the Event 1 token 3 positions (Mother Tree\nhas INI 3).\n\nScoring\nAt the end of the scenario:\n• Sÿenann (defending side):\n» 1 VP for each sÿena sprout that isn\'t destroyed\n» 1 VP if the Tree Mother has not been destroyed\n• Raiders (attacking side):\n» 1 VP for each sÿena sprout destroyed\n» 1 VP if the Tree Mother has been destroyed\n\nEnd of the game\nThe game ends when any of the following conditions are\nmet; at the end of round 4, when one of the companies\nhas no units on the battlefield, when all units of one of\nthe companies are demoralized, or if the Mother Tree\nand all 4 sÿena sprouts have been destroyed.\n\nWoods\nWoods in the blue deployment zone have the keywords:\nBlock LoS and Cover (7).\n\nSÿena sprouts\nEach brown objective represents a sÿena sprout.\n\nDestroy a sprout\nAny unit of the raiding faction can destroy a sprout by\nperforming the simple action destroy sprout. To do so,\nthe unit must meet the following requirements:\n• The raiding unit must be adjacent to the sÿena sprout.\n• The raiding unit cannot be locked in combat.\n• The Tree Mother must not be adjacent to the sprout.\nTo resolve the action:\n• The raiding unit must face off its attack (without\nactivating switches or adding modifiers) at the defense\nvalue [d7][d7][d9] If the Sÿenann control the target\n(sprout), they add BLOCK,BLOCK to the defense roll.\n• If the raiding unit rolls at least 1 uncanceled [d1], during\nresolution, destroy the sprout (flip the objective\nmarker so its brown side is not showing).\n\nReturn home\nWhen a Sÿenann unit is required to flee, it will do so by\nmoving towards the nearest battlefield edge (ignoring\nthe deployment zone condition).',
      objectiveDescription: 'Protect or destroy the Tree Mother and her sprouts',
      turnCount: 5,
      roundCount: 4,
      specialRules: ['Tree Mother mechanics', 'Variable round lengths', 'Sprout destruction mechanics'],
      mapImage: '/art/missions/tree_mother.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Tree Mother', value: 1 },
        { id: 'obj2', name: 'Sÿena Sprout 1', value: 1 },
        { id: 'obj3', name: 'Sÿena Sprout 2', value: 1 },
        { id: 'obj4', name: 'Sÿena Sprout 3', value: 1 },
        { id: 'obj5', name: 'Sÿena Sprout 4', value: 1 }
      ],
      isOfficial: true
    },
    {
      id: 'community-breached-front',
      title: 'Breached Front',
      name: 'Breached Front',
      description: 'Control objectives of different colors, including your own and your opponent\'s.',
      objective: 'Control colored objectives',
      details: 'Preparation\nPlace 4 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\nEach round lasts 5 turns.\n\nScoring\nAt the end of each round, you obtain:\n• 2 VP for controlling the center neutral objective (1).\n• 1 VP for controlling East neutral objective (2).\n• 1 VP for controlling your color objective.\n• 1 VP for controlling your opponent\'s color objective.\n\nEnd of the game\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nThis mission was created by our Community member Anthony Pham, aka Viridian',
      objectiveDescription: 'Control colored objectives for points',
      turnCount: 5,
      roundCount: 3,
      specialRules: ['Colored objective markers', 'Higher value for center objective'],
      mapImage: '/art/missions/breached_front.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Center Neutral', value: 2 },
        { id: 'obj2', name: 'East Neutral', value: 1 },
        { id: 'obj3', name: 'Your Color', value: 1 },
        { id: 'obj4', name: 'Opponent Color', value: 1 }
      ],
      isHomebrew: true,
      communityCreator: 'Anthony Pham, aka Viridian'
    },
    {
      id: 'community-battle-lines',
      title: 'Battle Lines',
      name: 'Battle Lines',
      description: 'Strategic control of objectives with special Supply Chest mechanics.',
      objective: 'Control various objectives and maintain supply lines',
      details: 'Preparation\nPlace 6 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\nEach round lasts 5 turns.\n\nScoring\nAt the end of each round, you obtain:\n• 2 VP for controlling your opponent\'s color objective (A).\n• 1 VP for controlling your color objective (A).\n• 1 VP for controlling each neutral objective (B or C).\n• 1 VP for controlling both neutral objectives (B and C).\n\nEnd of game\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nSpecial Rules\nThe Supply Chest– Use a 30mm objective marker to represent the Supply Chest. Place the Supply chest as indicated by the Objective S on the map. The Supply Chest behaves like an objective, but the players start the game controlling their color supply chest. While you control your Supply Chest, once per Round after a unit activates, choose another unit within 20 strides of one of your color objectives that you control. This unit may activate and perform only one action, and it does not receive stress or an activation token. If your opponent controls a Supply Chest at the end of any round, remove the Supply Chest from the game.\n\nThis mission was created by our Community member Anthony Pham, aka Viridian',
      objectiveDescription: 'Control colored and neutral objectives with supply chest mechanics',
      turnCount: 5,
      roundCount: 3,
      specialRules: ['Colored objective markers', 'Supply Chest mechanics', 'Extra unit activation'],
      mapImage: '/art/missions/battle_lines.jpg',
      objectiveMarkers: [
        { id: 'objA1', name: 'Your Color A', value: 1 },
        { id: 'objA2', name: 'Opponent Color A', value: 2 },
        { id: 'objB', name: 'Neutral B', value: 1 },
        { id: 'objC', name: 'Neutral C', value: 1 },
        { id: 'objS', name: 'Supply Chest', value: 0 }
      ],
      isHomebrew: true,
      communityCreator: 'Anthony Pham, aka Viridian'
    },
    {
      id: 'community-ghosts-from-mist',
      title: 'Ghosts from the Mist',
      name: 'Ghosts from the Mist',
      description: 'Control fog ghosts to gain advantages and score points.',
      objective: 'Control fog ghost markers',
      details: 'Preparation\n\nPlace 4 fog ghosts (represented by generic objective markers) at centerline of the battlefield, also place 2 coloured objective markers on each half of the battlefield as shown in the diagram.\nPlace an event marker on position 2 on a dial.\n\nRounds\n\nEach round lasts 4 turns\n\nEvent\n\nWhen event is activated do the following:\n\nStarting with a player who has the initiative, whoever controls fog ghost markers can place them 5 strides from their current position. \nIf fog ghost marker player controls is placed adjusted to enemy unit- that unit must roll defence roll at **** and takes as much damage as * is not blocked.\nIf fog ghost marker player controls is placed adjusted to allied unit- that unit may clear 1 stress.\nAdvance event token 2 positions on the turn counter.\n\nScoring\n\nAt the end of each round you score:\n\n- 1 VP if more fog ghosts are fully on the opponent\'s half of the board than on your side of a board.\n- 1 VP if you control 3 fog ghosts or more\n- 1 VP if you control at least 1 fog ghost\n- 3 VP if fog ghost under your control is within 3 of the objective marker of your colour for each fog ghost marker within 3 of the objective marker of your colour. After scoring VPs this way, remove every fog ghost marker under your control within 3 of the objective marker of your colour from the game.\n\nEnd of the Game\n\nThe game ends at the end of round 3 or when one company has no units left on the battlefield.\n\nThis Homebrew mission was created by our Community member Vladimir Sagalov aka FinalForm',
      objectiveDescription: 'Control fog ghosts and position them strategically',
      turnCount: 4,
      roundCount: 3,
      specialRules: ['Fog ghost movement', 'Ghost damage mechanics', 'Stress clearing'],
      mapImage: '/art/missions/ghosts_from_the_mist.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Fog Ghost 1', value: 1 },
        { id: 'obj2', name: 'Fog Ghost 2', value: 1 },
        { id: 'obj3', name: 'Fog Ghost 3', value: 1 },
        { id: 'obj4', name: 'Fog Ghost 4', value: 1 },
        { id: 'obj5', name: 'Objective 1', value: 3 },
        { id: 'obj6', name: 'Objective 2', value: 3 }
      ],
      isHomebrew: true,
      communityCreator: 'Vladimir Sagalov aka FinalForm'
    },
    {
      id: 'community-sacred-land',
      title: 'Sacred Land',
      name: 'Sacred Land',
      description: 'Control altars and perform prayers and offerings to gain advantages.',
      objective: 'Control sacred and lesser altars',
      details: 'Preparation\n\nPlace 2 sacred altars and 3 lesser altars objective markers as shown in the diagram.\n\nRounds\n\nFirst round lasts 2 turns, Second round lasts 3 turns, Third round lasts 4 turns and Fourth round lasts 5 turns\n\nPrayers and Offerings\n\nIn this mission any unit may use special simple action Pray and special command ability Deity Offering\n\nPray: when your unit is within 3 from the lesser altar - you can use this action. Mark the unit that took this action with a Prayer token, it gets +1 to the conquest characteristic until the end of the game. This action can be used multiple times, to get multiple +1 conquest.\n\nDeity Offering: when your unit is within 3 from the sacred altar - you can use this command ability during the unit\'s activation. \n\nScoring\n\nAt the end of each round you score:\n\n- 1 VP if you control 2 or more lesser altars\n- 1 VP if you control 1 or more sacred altars\n- 1 VP if one or more units of your units with Prayer token is within 3 of lesser altar\n- 2 VP if one or more of your units with Prayer token are within 3 of sacred altar and they have High command characteristic or Spellcaster characteristic\n- 3 VP if you used Deity Offering on both sacred altars. You can score this 3 VPs only once per game.\n\nEnd of the Game\n\nThe game ends at the end of round 4 or when one company has no units left on the battlefield.\n\nThis Homebrew mission was created by our Community member Vladimir Sagalov aka FinalForm',
      objectiveDescription: 'Control altars and perform prayers for bonuses',
      turnCount: 5,
      roundCount: 4,
      specialRules: ['Variable round length', 'Prayer action', 'Deity Offering', 'Conquest bonuses'],
      mapImage: '/art/missions/sacred_lands.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Sacred Altar 1', value: 2 },
        { id: 'obj2', name: 'Sacred Altar 2', value: 2 },
        { id: 'obj3', name: 'Lesser Altar 1', value: 1 },
        { id: 'obj4', name: 'Lesser Altar 2', value: 1 },
        { id: 'obj5', name: 'Lesser Altar 3', value: 1 }
      ],
      isHomebrew: true,
      communityCreator: 'Vladimir Sagalov aka FinalForm'
    },
    {
      id: 'community-rescue-mission',
      title: 'Rescue Mission',
      name: 'Rescue Mission',
      description: 'Rescue fallen comrades and avenge them in battle.',
      objective: 'Rescue and avenge fallen comrades',
      details: 'Preparation\n\nPlace 6 Fallen comrade markers(represented by coloured objective markers) as shown in the diagram.\nPlace an event marker on position 5 on a dial.\n\nRounds\n\nEach round lasts 4 turns\n\nEvent\n\nWhen event is activated do the following:\n\nReplace all Fallen comrade markers with Mournful sights markers (represented by coloured objective markers of the same colour).\n\nRemove the event marker from the dial.\n\nRescuing the wounded\n\nIn this mission any unit may use special simple action Ensure survival: when your unit is within 3 from the Fallen comrade marker of your colour - you can use this action. \nYou can choose to place Survivor token on this unit or on any allied unit within 8. You can recover 1 trooper model in that unit. Remove that Fallen comrade marker from the game. \n\nIf unit with Survivor token is destroyed - discard Survivor token.\nIf an officer or support leaves the unit, you can choose which of them retains the Survivor token.\n\nAvenge the fallen\n\nIn this mission after your unit inficts any amount of damage to an enemy unit- place 1 vengeance token on that unit (you can represent it by d6 dice)\nIf your unit destroys an enemy unit - place 3 vengeance tokens on that unit instead. Your unit can never have more than 6 vengeance tokens. If you have to place any excessive vengeance tokens on a unit- discard them so there are no more than 6 vengeance tokens on your unit.\nUnit can repeat the number of dice on your attack rolls up to the number of vengeance tokens on it.\n\nScoring\n\nAt the end of each round you score:\n\n- 1 VP for each Fallen comrade token you control\n- 1 VP for each Survivor token on your units that are on the battlefield and are not engaged.\n- 1 VP for each 2 vengeance tokens on your units within 3 of Mournful sights markers of your colour. After scoring VPs this way, remove all the vengeance tokens from your units within 3 of Mournful sights markers of your colour. \n\nEnd of the Game\n\nThe game ends at the end of round 3 or when one company has no units left on the battlefield.\n\nThis Homebrew mission was created by our Community member Vladimir Sagalov aka FinalForm',
      objectiveDescription: 'Rescue fallen comrades and gain vengeance bonuses',
      turnCount: 4,
      roundCount: 3,
      specialRules: ['Fallen comrade mechanics', 'Survivor tokens', 'Vengeance tokens', 'Attack roll repeats'],
      mapImage: '/art/missions/rescue_mission.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Fallen Comrade 1', value: 1 },
        { id: 'obj2', name: 'Fallen Comrade 2', value: 1 },
        { id: 'obj3', name: 'Fallen Comrade 3', value: 1 },
        { id: 'obj4', name: 'Fallen Comrade 4', value: 1 },
        { id: 'obj5', name: 'Fallen Comrade 5', value: 1 },
        { id: 'obj6', name: 'Fallen Comrade 6', value: 1 }
      ],
      isHomebrew: true,
      communityCreator: 'Vladimir Sagalov aka FinalForm'
    }
  ];

  const handleMissionSelect = (mission: Mission) => {
    // Call either onSelect or onSelectMission (or both if provided)
    if (onSelect) {
      onSelect(mission);
    } 
    else if (onSelectMission) {
      onSelectMission(mission);
    } 
    else {
      dispatch({ type: 'SET_MISSION', payload: mission });
    }
  };

  // Use either the external selected mission (from props) or the one from context
  const activeMissionId = externalSelectedMission?.id || state.mission?.id;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {missions.map((mission) => {
        const isCommunityMission = mission.isHomebrew;
        const isOfficialMission = mission.isOfficial;
        
        return (
          <Card 
            key={mission.id}
            className={`cursor-pointer transition-all h-full flex flex-col hover:border-warcrow-gold ${
              activeMissionId === mission.id ? 'border-warcrow-gold bg-warcrow-gold/10' : 'border-transparent'
            }`}
            onClick={() => handleMissionSelect(mission)}
          >
            <CardContent className="p-0 flex-1 flex flex-col bg-black/70 rounded-lg overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={mission.mapImage || '/placeholder.svg'} 
                  alt={mission.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col bg-black/90">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-warcrow-gold">{mission.title}</h3>
                  <div className="flex gap-1">
                    {isOfficialMission && (
                      <Badge variant="secondary" className="bg-warcrow-gold/20 text-warcrow-gold border-warcrow-gold/40 text-xs">
                        Official
                      </Badge>
                    )}
                    {isCommunityMission && (
                      <Badge variant="outline" className="bg-purple-800/40 text-purple-200 border-purple-600 text-xs">
                        Community
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm mt-1 text-warcrow-text/80">{mission.description}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
};

export default MissionSelector;
