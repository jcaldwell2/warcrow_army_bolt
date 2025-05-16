
export interface ProfileFormData {
  username: string | null;
  bio: string | null;
  location: string | null;
  favorite_faction: string | null;
  social_discord: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_twitch: string | null;
  avatar_url: string | null;
  wab_id?: string | null;
}

export interface Profile {
  id: string;
  username: string | null;
  bio: string | null;
  location: string | null;
  favorite_faction: string | null;
  social_discord: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_twitch: string | null;
  avatar_url: string | null;
  wab_id: string | null;
  games_won: number;
  games_lost: number;
  tester?: boolean; // Added this field to match database schema
}
