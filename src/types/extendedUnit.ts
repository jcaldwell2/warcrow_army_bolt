
export interface ExtendedStats {
  MOV: string;
  W: number;
  WP: string;
  MOR: string | number;
  AVB: number;
}

export interface Switch {
  value: string;
  effect: string;
}

export interface RangedAttack {
  range?: number;
  modifier?: string;
  dice: string[];
  switches?: Switch[];
}

export interface MeleeAttack {
  members: string;
  modifier?: string;
  dice: string[];
  switches?: Switch[];
}

export interface Defense {
  modifier?: string;
  dice: string[];
  switches?: Switch[];
  conquest?: number;
}

export interface AbilityEntry {
  name?: string;
  description: string;
}

export interface Abilities {
  skill?: AbilityEntry[];
  command?: AbilityEntry[];
  passive?: AbilityEntry[];
}

export interface UnitProfile {
  members: string;
  ranged?: RangedAttack;
  attack: MeleeAttack;
  defense: Defense;
}

export interface ExtendedUnit {
  id: string;
  name: string;
  cost: number;
  stats: ExtendedStats;
  type: string;
  keywords?: string[];
  profiles: UnitProfile[];
  abilities: Abilities;
  imageUrl?: string;
  
  // Adding properties used in UnitStatCard.tsx
  command?: number;
  deploymentMin?: number;
  deploymentMax?: number;
  availability?: number;
  points?: number;
  resolve?: any;
  movement?: string;
  melee?: any;
  ranged?: any;
  defense?: any;
  wounds?: number;
  actions?: number;
  specialRules?: string[];
}

export interface AttachedCharacter {
  id: string;
  name: string;
  wpModifier: string;
  commandModifier?: number;
  attackModifier?: string;
  defenseModifier?: string;
  attackBonus?: string;
  defenseBonus?: string;
  conquestModifier?: number;
  abilities: Abilities;
}

