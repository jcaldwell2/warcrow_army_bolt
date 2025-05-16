
export interface SelectedUnit {
  id: string;
  name: string;
  pointsCost: number;
  quantity: number;
  faction: string; 
  keywords: string[]; // SelectedUnit uses string[] for keywords
  highCommand?: boolean;
  availability: number;
  imageUrl?: string;
  specialRules?: string[];
  command?: number;
}

export interface SavedList {
  id: string;
  name: string;
  faction: string;
  units: SelectedUnit[];
  created_at: string;
  user_id?: string;
  wab_id?: string;
}

export interface Unit {
  id: string;
  name: string;
  faction: string;
  pointsCost: number;
  availability: number;
  command?: number;
  keywords: Keyword[];
  specialRules?: string[];
  highCommand?: boolean;
  imageUrl?: string;
}

// Add this interface for unit data from API
export interface ApiUnit {
  id: string;
  name: string;
  name_es?: string | null;
  name_fr?: string | null;
  description?: string | null;
  description_es?: string | null;
  description_fr?: string | null;
  faction: string;
  faction_display?: string;
  type: string;
  points: number;
  keywords?: string[];
  special_rules?: string[];
  characteristics?: Record<string, any>;
}

export interface Keyword {
  name: string;
  description?: string;
}

// Add missing SortOption type
export type SortOption = "points-asc" | "points-desc" | "name-asc" | "name-desc";

// Add missing Faction type
export interface Faction {
  id: string;
  name: string;
  name_es?: string;
  name_fr?: string;
}
