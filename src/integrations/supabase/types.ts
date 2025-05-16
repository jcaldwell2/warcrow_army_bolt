export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      army_lists: {
        Row: {
          created_at: string
          faction: string
          id: string
          name: string
          units: Json
          updated_at: string
          user_id: string | null
          wab_id: string | null
        }
        Insert: {
          created_at?: string
          faction: string
          id?: string
          name: string
          units: Json
          updated_at?: string
          user_id?: string | null
          wab_id?: string | null
        }
        Update: {
          created_at?: string
          faction?: string
          id?: string
          name?: string
          units?: Json
          updated_at?: string
          user_id?: string | null
          wab_id?: string | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          sender_id: string
          sent_at: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          sender_id: string
          sent_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
          sent_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      factions: {
        Row: {
          created_at: string
          id: string
          name: string
          name_es: string | null
          name_fr: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          name_es?: string | null
          name_fr?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_es?: string | null
          name_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      faq_sections: {
        Row: {
          content: string
          content_es: string | null
          content_fr: string | null
          created_at: string
          id: string
          order_index: number
          section: string
          section_es: string | null
          section_fr: string | null
          updated_at: string
        }
        Insert: {
          content: string
          content_es?: string | null
          content_fr?: string | null
          created_at?: string
          id?: string
          order_index: number
          section: string
          section_es?: string | null
          section_fr?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          content_es?: string | null
          content_fr?: string | null
          created_at?: string
          id?: string
          order_index?: number
          section?: string
          section_es?: string | null
          section_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          content: string
          content_es: string | null
          content_fr: string | null
          created_at: string | null
          id: string
          question: string
          updated_at: string | null
        }
        Insert: {
          content: string
          content_es?: string | null
          content_fr?: string | null
          created_at?: string | null
          id?: string
          question: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_es?: string | null
          content_fr?: string | null
          created_at?: string | null
          id?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      friend_activities: {
        Row: {
          activity_data: Json
          activity_type: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_data?: Json
          activity_type: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          id: string
          recipient_id: string
          sender_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_id: string
          sender_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_id?: string
          sender_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_history: {
        Row: {
          created_at: string | null
          id: string
          opponent_name: string | null
          played_at: string | null
          updated_at: string | null
          user_id: string | null
          won: boolean
        }
        Insert: {
          created_at?: string | null
          id?: string
          opponent_name?: string | null
          played_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          won: boolean
        }
        Update: {
          created_at?: string | null
          id?: string
          opponent_name?: string | null
          played_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          won?: boolean
        }
        Relationships: []
      }
      game_join_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          game_id: string
          id: string
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          game_id: string
          id?: string
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          game_id?: string
          id?: string
          used?: boolean
        }
        Relationships: []
      }
      image_validations: {
        Row: {
          created_at: string
          id: string
          missing_units: number
          results: Json
          total_units: number
          updated_at: string
          user_id: string
          validation_date: string
          validation_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          missing_units: number
          results: Json
          total_units: number
          updated_at?: string
          user_id: string
          validation_date?: string
          validation_type: string
        }
        Update: {
          created_at?: string
          id?: string
          missing_units?: number
          results?: Json
          total_units?: number
          updated_at?: string
          user_id?: string
          validation_date?: string
          validation_type?: string
        }
        Relationships: []
      }
      news_items: {
        Row: {
          content_en: string
          content_es: string
          content_fr: string | null
          created_at: string
          date: string
          id: string
          news_id: string
          translation_key: string
          updated_at: string
        }
        Insert: {
          content_en: string
          content_es: string
          content_fr?: string | null
          created_at?: string
          date: string
          id?: string
          news_id: string
          translation_key: string
          updated_at?: string
        }
        Update: {
          content_en?: string
          content_es?: string
          content_fr?: string | null
          created_at?: string
          date?: string
          id?: string
          news_id?: string
          translation_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banned: boolean | null
          bio: string | null
          created_at: string
          deactivated: boolean | null
          favorite_faction: string | null
          games_lost: number | null
          games_won: number | null
          id: string
          location: string | null
          social_discord: string | null
          social_instagram: string | null
          social_twitch: string | null
          social_twitter: string | null
          social_youtube: string | null
          tester: boolean
          updated_at: string
          username: string | null
          wab_admin: boolean | null
          wab_id: string
        }
        Insert: {
          avatar_url?: string | null
          banned?: boolean | null
          bio?: string | null
          created_at?: string
          deactivated?: boolean | null
          favorite_faction?: string | null
          games_lost?: number | null
          games_won?: number | null
          id: string
          location?: string | null
          social_discord?: string | null
          social_instagram?: string | null
          social_twitch?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tester?: boolean
          updated_at?: string
          username?: string | null
          wab_admin?: boolean | null
          wab_id: string
        }
        Update: {
          avatar_url?: string | null
          banned?: boolean | null
          bio?: string | null
          created_at?: string
          deactivated?: boolean | null
          favorite_faction?: string | null
          games_lost?: number | null
          games_won?: number | null
          id?: string
          location?: string | null
          social_discord?: string | null
          social_instagram?: string | null
          social_twitch?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tester?: boolean
          updated_at?: string
          username?: string | null
          wab_admin?: boolean | null
          wab_id?: string
        }
        Relationships: []
      }
      rules_chapters: {
        Row: {
          created_at: string
          id: string
          order_index: number
          title: string
          title_es: string | null
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index: number
          title: string
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          title?: string
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rules_sections: {
        Row: {
          chapter_id: string
          content: string
          content_es: string | null
          content_fr: string | null
          created_at: string
          id: string
          mission_details: string | null
          order_index: number
          title: string
          title_es: string | null
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          chapter_id: string
          content: string
          content_es?: string | null
          content_fr?: string | null
          created_at?: string
          id?: string
          mission_details?: string | null
          order_index: number
          title: string
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          content?: string
          content_es?: string | null
          content_fr?: string | null
          created_at?: string
          id?: string
          mission_details?: string | null
          order_index?: number
          title?: string
          title_es?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rules_sections_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "rules_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      special_rules: {
        Row: {
          created_at: string | null
          description: string
          description_es: string | null
          description_fr: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          description_es?: string | null
          description_fr?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          description_es?: string | null
          description_fr?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      unit_characteristics: {
        Row: {
          created_at: string | null
          description: string
          description_es: string | null
          description_fr: string | null
          id: string
          name: string
          name_es: string | null
          name_fr: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          description_es?: string | null
          description_fr?: string | null
          id?: string
          name: string
          name_es?: string | null
          name_fr?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          description_es?: string | null
          description_fr?: string | null
          id?: string
          name?: string
          name_es?: string | null
          name_fr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      unit_data: {
        Row: {
          characteristics: Json
          created_at: string | null
          description: string
          description_es: string | null
          description_fr: string | null
          faction: string
          id: string
          keywords: string[]
          name: string
          name_es: string | null
          name_fr: string | null
          options: Json
          points: number
          special_rules: string[]
          type: string
          updated_at: string | null
        }
        Insert: {
          characteristics?: Json
          created_at?: string | null
          description: string
          description_es?: string | null
          description_fr?: string | null
          faction: string
          id?: string
          keywords?: string[]
          name: string
          name_es?: string | null
          name_fr?: string | null
          options?: Json
          points?: number
          special_rules?: string[]
          type: string
          updated_at?: string | null
        }
        Update: {
          characteristics?: Json
          created_at?: string | null
          description?: string
          description_es?: string | null
          description_fr?: string | null
          faction?: string
          id?: string
          keywords?: string[]
          name?: string
          name_es?: string | null
          name_fr?: string | null
          options?: Json
          points?: number
          special_rules?: string[]
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      unit_keywords: {
        Row: {
          created_at: string | null
          description: string
          description_es: string | null
          description_fr: string | null
          id: string
          name: string
          name_es: string | null
          name_fr: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          description_es?: string | null
          description_fr?: string | null
          id?: string
          name: string
          name_es?: string | null
          name_fr?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          description_es?: string | null
          description_fr?: string | null
          id?: string
          name?: string
          name_es?: string | null
          name_fr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_name_translation_columns: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_rules_translations_completeness: {
        Args: Record<PropertyKey, never>
        Returns: {
          content_type: string
          item_id: string
          english_title: string
          spanish_title: string
          has_spanish_title: boolean
          has_spanish_content: boolean
        }[]
      }
      check_username_exists: {
        Args: { username_to_check: string }
        Returns: boolean
      }
      delete_faction_cascade: {
        Args: { faction_id: string }
        Returns: undefined
      }
      generate_wab_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_wap_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_email: {
        Args: { user_id: string }
        Returns: {
          email: string
        }[]
      }
      is_wab_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
