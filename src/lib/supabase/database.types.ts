/**
 * Hand-written until the schema is applied. Run `npm run db:types` after
 * `npx supabase link --project-ref <ref>` to replace this file with
 * generated types that mirror the live database.
 */
export type Json = string | number | boolean | null | { [k: string]: Json | undefined } | Json[];

export type HouseholdRole = "owner" | "admin" | "adult" | "teen" | "child" | "guest";
export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";
export type TaskStatus = "pending" | "completed" | "skipped";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      households: {
        Row: {
          id: string;
          name: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["households"]["Insert"]>;
        Relationships: [];
      };
      household_members: {
        Row: {
          household_id: string;
          user_id: string;
          role: HouseholdRole;
          joined_at: string;
        };
        Insert: {
          household_id: string;
          user_id: string;
          role?: HouseholdRole;
          joined_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["household_members"]["Insert"]>;
        Relationships: [];
      };
      household_invitations: {
        Row: {
          id: string;
          household_id: string;
          email: string;
          role: HouseholdRole;
          token_hash: string;
          invited_by: string;
          status: InvitationStatus;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          email: string;
          role?: HouseholdRole;
          token_hash: string;
          invited_by: string;
          status?: InvitationStatus;
          expires_at: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["household_invitations"]["Insert"]>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          household_id: string;
          parent_task_id: string | null;
          series_id: string;
          title: string;
          notes: string | null;
          status: TaskStatus;
          due_at: string | null;
          completed_at: string | null;
          completed_by: string | null;
          assigned_to: string | null;
          created_by: string;
          rrule: string | null;
          tags: string[];
          position: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          parent_task_id?: string | null;
          series_id?: string;
          title: string;
          notes?: string | null;
          status?: TaskStatus;
          due_at?: string | null;
          completed_at?: string | null;
          completed_by?: string | null;
          assigned_to?: string | null;
          created_by: string;
          rrule?: string | null;
          tags?: string[];
          position?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_household_member: { Args: { hid: string }; Returns: boolean };
      is_household_admin: { Args: { hid: string }; Returns: boolean };
    };
    Enums: {
      household_role: HouseholdRole;
      invitation_status: InvitationStatus;
      task_status: TaskStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
