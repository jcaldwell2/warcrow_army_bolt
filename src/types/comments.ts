
export interface ProfileComment {
  id: string;
  author_id: string;
  profile_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_username?: string;
  author_avatar_url?: string;
}

export interface ProfileCommentFormData {
  content: string;
}
