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
      meal_plans: {
        Row: {
          created_at: string
          daily_calories: number | null
          id: string
          overview: string | null
          plan_data: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_calories?: number | null
          id?: string
          overview?: string | null
          plan_data: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_calories?: number | null
          id?: string
          overview?: string | null
          plan_data?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          dietary_preference: string | null
          fitness_goal: string | null
          full_name: string | null
          height: number | null
          id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          dietary_preference?: string | null
          fitness_goal?: string | null
          full_name?: string | null
          height?: number | null
          id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          dietary_preference?: string | null
          fitness_goal?: string | null
          full_name?: string | null
          height?: number | null
          id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      regeneration_purchases: {
        Row: {
          amount_paid: number
          id: string
          purchase_date: string
          regenerations_added: number
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number
          id?: string
          purchase_date?: string
          regenerations_added?: number
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          id?: string
          purchase_date?: string
          regenerations_added?: number
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          free_meal_plan_used: boolean
          free_workout_plan_used: boolean
          id: string
          last_reset_date: string | null
          regenerations_limit: number
          regenerations_used: number
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          free_meal_plan_used?: boolean
          free_workout_plan_used?: boolean
          id?: string
          last_reset_date?: string | null
          regenerations_limit?: number
          regenerations_used?: number
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          free_meal_plan_used?: boolean
          free_workout_plan_used?: boolean
          id?: string
          last_reset_date?: string | null
          regenerations_limit?: number
          regenerations_used?: number
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string
          date: string
          id: string
          meals_completed: string[] | null
          updated_at: string
          user_id: string
          water_glasses: number | null
          weight: number | null
          workouts_completed: string[] | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          meals_completed?: string[] | null
          updated_at?: string
          user_id: string
          water_glasses?: number | null
          weight?: number | null
          workouts_completed?: string[] | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          meals_completed?: string[] | null
          updated_at?: string
          user_id?: string
          water_glasses?: number | null
          weight?: number | null
          workouts_completed?: string[] | null
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          id: string
          overview: string | null
          plan_data: Json
          title: string
          updated_at: string
          user_id: string
          weekly_goal: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          overview?: string | null
          plan_data: Json
          title: string
          updated_at?: string
          user_id: string
          weekly_goal?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          overview?: string | null
          plan_data?: Json
          title?: string
          updated_at?: string
          user_id?: string
          weekly_goal?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_type: "basic" | "pro"
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
    Enums: {
      subscription_type: ["basic", "pro"],
    },
  },
} as const
