export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password_hash: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password_hash: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password_hash?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      course_assignments: {
        Row: {
          academic_year: string
          course_id: string
          created_at: string
          faculty_id: string
          id: string
          section: string
          semester: string
          updated_at: string
        }
        Insert: {
          academic_year?: string
          course_id: string
          created_at?: string
          faculty_id: string
          id?: string
          section: string
          semester?: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          course_id?: string
          created_at?: string
          faculty_id?: string
          id?: string
          section?: string
          semester?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_assignments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["faculty_id"]
          },
        ]
      }
      courses: {
        Row: {
          course_id: string
          course_name: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          course_id: string
          course_name: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          course_name?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      faculty: {
        Row: {
          created_at: string
          designation: string
          experience: string
          faculty_id: string
          id: string
          name: string
          qualification: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          designation: string
          experience: string
          faculty_id: string
          id?: string
          name: string
          qualification: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          designation?: string
          experience?: string
          faculty_id?: string
          id?: string
          name?: string
          qualification?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          academic_year: string
          additional_comments: string | null
          communication_skills: number | null
          course_content: number | null
          faculty_id: string
          id: string
          is_anonymous: boolean | null
          overall_rating: number | null
          positive_feedback: string | null
          punctuality: number | null
          semester: string
          student_id: string
          student_interaction: number | null
          subject_name: string
          submitted_at: string
          suggestions_for_improvement: string | null
          teaching_effectiveness: number | null
        }
        Insert: {
          academic_year: string
          additional_comments?: string | null
          communication_skills?: number | null
          course_content?: number | null
          faculty_id: string
          id?: string
          is_anonymous?: boolean | null
          overall_rating?: number | null
          positive_feedback?: string | null
          punctuality?: number | null
          semester: string
          student_id: string
          student_interaction?: number | null
          subject_name: string
          submitted_at?: string
          suggestions_for_improvement?: string | null
          teaching_effectiveness?: number | null
        }
        Update: {
          academic_year?: string
          additional_comments?: string | null
          communication_skills?: number | null
          course_content?: number | null
          faculty_id?: string
          id?: string
          is_anonymous?: boolean | null
          overall_rating?: number | null
          positive_feedback?: string | null
          punctuality?: number | null
          semester?: string
          student_id?: string
          student_interaction?: number | null
          subject_name?: string
          submitted_at?: string
          suggestions_for_improvement?: string | null
          teaching_effectiveness?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["faculty_id"]
          },
        ]
      }
      profiles: {
        Row: {
          college_email: string
          created_at: string
          date_of_birth: string
          gender: string | null
          inter_cgpa: string | null
          mobile_primary: string | null
          mobile_secondary: string | null
          name: string
          roll_number: string
          section: string | null
          ssc_cgpa: string | null
          updated_at: string
        }
        Insert: {
          college_email: string
          created_at?: string
          date_of_birth: string
          gender?: string | null
          inter_cgpa?: string | null
          mobile_primary?: string | null
          mobile_secondary?: string | null
          name: string
          roll_number: string
          section?: string | null
          ssc_cgpa?: string | null
          updated_at?: string
        }
        Update: {
          college_email?: string
          created_at?: string
          date_of_birth?: string
          gender?: string | null
          inter_cgpa?: string | null
          mobile_primary?: string | null
          mobile_secondary?: string | null
          name?: string
          roll_number?: string
          section?: string | null
          ssc_cgpa?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_feedback_analytics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      verify_admin_credentials: {
        Args: { p_email: string; p_password: string }
        Returns: {
          is_valid: boolean
          admin_data: Json
        }[]
      }
      verify_student_credentials: {
        Args: {
          p_college_email: string
          p_date_of_birth?: string
          p_roll_number?: string
        }
        Returns: {
          is_valid: boolean
          student_data: Json
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
