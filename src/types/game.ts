
export interface GameState {
  id: string;
  players: { [playerId: string]: Player };
  mission: Mission | null;
  currentPhase: GamePhase;
  rollOffWinner: string | null;
  firstToDeployPlayerId: string | null;
  initialInitiativePlayerId: string | null;
  currentTurn: number;
  units: Unit[];
  turns: Turn[];
  gameEvents: GameEvent[];
  gameStartTime: number | undefined;
  gameEndTime: number | undefined;
}

export type GamePhase = 'setup' | 'deployment' | 'game' | 'scoring' | 'summary';

export interface Player {
  id: string;
  name: string;
  faction?: Faction;
  units?: Unit[];
  list?: string;
  wab_id?: string;
  avatar_url?: string;
  verified?: boolean;
  user_profile_id?: string;
  score?: number;
  roundScores?: Record<string, number>;
  points?: number;
  objectivePoints?: number;
}

export interface Faction {
  name: string;
  icon?: string;
  id?: string; // Adding id property to match FactionSelector implementation
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  objective: string;
  // Add properties needed by components
  title?: string;
  details?: string; // Adding details property for MissionSelector
  objectiveDescription?: string;
  mapImage?: string;
  specialRules?: string[];
  objectiveMarkers?: any[];
  turnCount?: number;
  roundCount?: number; // Adding roundCount property
  isOfficial?: boolean; // Add isOfficial flag
  isHomebrew?: boolean; // Add isHomebrew flag
  communityCreator?: string; // Add communityCreator for attribution
}

export interface Unit {
  id: string;
  name: string;
  player: string;
  status?: 'alive' | 'wounded' | 'destroyed';
  keywords?: string[];
  pointsCost?: number;
  quantity?: number;
  faction?: string;
  highCommand?: boolean;
  availability?: number;
  specialRules?: string[];
}

export interface Turn {
  number: number;
  roundNumber?: number;
  activePlayer: string | null;
  alternatingPlayer?: string;
  activationsCompleted: Record<string, number>;
  completed?: boolean;
  events?: GameEvent[];
  scores?: Record<string, number>;
}

export interface GameEvent {
  id: string;
  type: 'score' | 'kill' | 'objective' | 'initiative' | 'mission' | 'casualty' | 'note';
  description: string;
  playerId: string;
  roundNumber?: number;
  timestamp?: number;
  objectiveType?: string;
  value?: number;
  unitId?: string; // Adding unitId for CasualtyRecord component
  objectiveId?: string; // Adding objectiveId for ObjectiveUpdate component
}
