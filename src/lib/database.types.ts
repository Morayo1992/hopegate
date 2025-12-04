export type UserRole = 'donor' | 'project_creator' | 'admin';
export type ProjectStatus = 'draft' | 'pending_review' | 'active' | 'fully_funded' | 'completed' | 'cancelled';
export type DonationStatus = 'pending' | 'completed' | 'refunded';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          bio: string;
          avatar_url: string | null;
          location: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          bio?: string;
          avatar_url?: string | null;
          location?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          bio?: string;
          avatar_url?: string | null;
          location?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          icon?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string;
          goal_amount: number;
          raised_amount: number;
          status: ProjectStatus;
          category_id: string | null;
          location: string;
          start_date: string | null;
          end_date: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description: string;
          goal_amount: number;
          raised_amount?: number;
          status?: ProjectStatus;
          category_id?: string | null;
          location: string;
          start_date?: string | null;
          end_date?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string;
          goal_amount?: number;
          raised_amount?: number;
          status?: ProjectStatus;
          category_id?: string | null;
          location?: string;
          start_date?: string | null;
          end_date?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_id: string | null;
          project_id: string;
          amount: number;
          transaction_id: string | null;
          status: DonationStatus;
          message: string;
          is_anonymous: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          donor_id?: string | null;
          project_id: string;
          amount: number;
          transaction_id?: string | null;
          status?: DonationStatus;
          message?: string;
          is_anonymous?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string | null;
          project_id?: string;
          amount?: number;
          transaction_id?: string | null;
          status?: DonationStatus;
          message?: string;
          is_anonymous?: boolean;
          created_at?: string;
        };
      };
      project_updates: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          content?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
    };
  };
}
