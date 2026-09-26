export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      encounters: {
        Row: {
          age_years: number | null;
          created_at: string;
          id: string;
          observed_signs: string;
          patient_account: string;
          patient_reference: string;
          presenting_concern: string;
          recorded_by: string;
          recorded_by_label: string;
          speech_used: boolean;
          submission_source: string;
        };
        Insert: {
          age_years?: number | null;
          created_at?: string;
          id?: string;
          observed_signs?: string;
          patient_account?: string;
          patient_reference: string;
          presenting_concern: string;
          recorded_by?: string | null;
          recorded_by_label?: string;
          speech_used?: boolean;
          submission_source?: string;
        };
        Update: {
          age_years?: number | null;
          created_at?: string;
          id?: string;
          observed_signs?: string;
          patient_account?: string;
          patient_reference?: string;
          presenting_concern?: string;
          recorded_by?: string | null;
          recorded_by_label?: string;
          speech_used?: boolean;
          submission_source?: string;
        };
        Relationships: [];
      };
      triage_briefs: {
        Row: {
          approved_at: string | null;
          clinician_notes: string;
          concern_summary: string;
          drafted_at: string;
          drafted_by: string | null;
          drafted_from: string;
          encounter_id: string;
          id: string;
          items_to_check: string;
          next_step: string | null;
          open_questions: string;
          patient_reported: string;
          priority: string | null;
          reviewed_by: string | null;
          reviewed_by_label: string | null;
          staff_observed: string;
          status: string;
        };
        Insert: {
          approved_at?: string | null;
          clinician_notes?: string;
          concern_summary?: string;
          drafted_at?: string;
          drafted_by?: string | null;
          drafted_from?: string;
          encounter_id: string;
          id?: string;
          items_to_check?: string;
          next_step?: string | null;
          open_questions?: string;
          patient_reported?: string;
          priority?: string | null;
          reviewed_by?: string | null;
          staff_observed?: string;
          status?: string;
        };
        Update: {
          approved_at?: string | null;
          clinician_notes?: string;
          concern_summary?: string;
          drafted_at?: string;
          drafted_by?: string;
          drafted_from?: string;
          encounter_id?: string;
          id?: string;
          items_to_check?: string;
          next_step?: string | null;
          open_questions?: string;
          patient_reported?: string;
          priority?: string | null;
          reviewed_by?: string | null;
          reviewed_by_label?: string | null;
          staff_observed?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "triage_briefs_encounter_id_fkey";
            columns: ["encounter_id"];
            isOneToOne: true;
            referencedRelation: "encounters";
            referencedColumns: ["id"];
          },
        ];
      };
      staff_profiles: {
        Row: {
          created_at: string;
          role: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          role: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          role?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      staff_role_audit: {
        Row: {
          changed_at: string;
          changed_by: string | null;
          id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          changed_at?: string;
          changed_by?: string | null;
          id?: string;
          role: string;
          user_id: string;
        };
        Update: {
          changed_at?: string;
          changed_by?: string | null;
          id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      bootstrap_first_clinician: { Args: Record<PropertyKey, never>; Returns: string };
      capture_tablet_intake: {
        Args: {
          concern_summary_input: string;
          drafted_from_input: string;
          items_to_check_input: string;
          open_questions_input: string;
          patient_account_input: string;
          patient_reference_input: string;
          presenting_concern_input: string;
          speech_used_input: boolean;
        };
        Returns: string;
      };
      current_staff_role: { Args: Record<PropertyKey, never>; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
