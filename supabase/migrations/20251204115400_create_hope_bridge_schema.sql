/*
  # Hope Bridge - Poverty Alleviation Crowdfunding Platform Schema

  ## Overview
  This migration creates the complete database schema for Hope Bridge, a transparent
  crowdfunding platform connecting verified NGOs and individuals with donors to fund
  poverty-related projects.

  ## New Tables

  ### 1. profiles
  Extended user information beyond Supabase Auth
  - `id` (uuid, FK to auth.users) - User identifier
  - `role` (text) - User role: 'donor', 'project_creator', 'admin'
  - `full_name` (text) - User's full name
  - `bio` (text) - User biography
  - `avatar_url` (text) - Profile picture URL
  - `location` (text) - User's location
  - `is_verified` (boolean) - NGO/Creator verification status
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. categories
  Project categorization for filtering and organization
  - `id` (uuid) - Category identifier
  - `name` (text) - Category name (Education, Healthcare, etc.)
  - `description` (text) - Category description
  - `icon` (text) - Icon identifier for UI
  - `created_at` (timestamptz)

  ### 3. projects
  Core crowdfunding project data
  - `id` (uuid) - Project identifier
  - `creator_id` (uuid, FK) - Project creator reference
  - `title` (text) - Project title
  - `description` (text) - Detailed project description
  - `goal_amount` (decimal) - Target funding amount
  - `raised_amount` (decimal) - Current amount raised
  - `status` (text) - Project status: draft, pending_review, active, fully_funded, completed, cancelled
  - `category_id` (uuid, FK) - Category reference
  - `location` (text) - Project location
  - `start_date` (timestamptz) - Campaign start date
  - `end_date` (timestamptz) - Campaign end date
  - `image_url` (text) - Main project image
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. donations
  Transaction records for all donations
  - `id` (uuid) - Donation identifier
  - `donor_id` (uuid, FK) - Donor reference
  - `project_id` (uuid, FK) - Project reference
  - `amount` (decimal) - Donation amount
  - `transaction_id` (text) - Stripe transaction ID
  - `status` (text) - Transaction status: pending, completed, refunded
  - `message` (text) - Optional donor message
  - `is_anonymous` (boolean) - Hide donor identity
  - `created_at` (timestamptz)

  ### 5. project_updates
  Creator updates and progress reports
  - `id` (uuid) - Update identifier
  - `project_id` (uuid, FK) - Project reference
  - `title` (text) - Update title
  - `content` (text) - Update content
  - `created_at` (timestamptz)

  ### 6. comments
  Community engagement and feedback
  - `id` (uuid) - Comment identifier
  - `project_id` (uuid, FK) - Project reference
  - `user_id` (uuid, FK) - Commenter reference
  - `content` (text) - Comment content
  - `created_at` (timestamptz)

  ## Security
  Row Level Security (RLS) is enabled on all tables with role-based policies:
  - Public read access for active projects and approved content
  - Authenticated write access with ownership/role validation
  - Admin-only access for project approval workflow
  - Creator-only access for project management

  ## Indexes
  Performance indexes on frequently queried columns:
  - Projects: status, category_id, creator_id, end_date
  - Donations: project_id, donor_id, status
  - Foreign key relationships
*/

-- Create enum types for better type safety
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('donor', 'project_creator', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('draft', 'pending_review', 'active', 'fully_funded', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'donor',
  full_name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  location text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'folder',
  created_at timestamptz DEFAULT now()
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  goal_amount decimal(12, 2) NOT NULL CHECK (goal_amount > 0),
  raised_amount decimal(12, 2) DEFAULT 0 CHECK (raised_amount >= 0),
  status project_status DEFAULT 'draft',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  location text NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR start_date IS NULL OR end_date > start_date)
);

-- 4. Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount decimal(12, 2) NOT NULL CHECK (amount > 0),
  transaction_id text UNIQUE,
  status donation_status DEFAULT 'pending',
  message text DEFAULT '',
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 5. Project Updates Table
CREATE TABLE IF NOT EXISTS project_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 6. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);
CREATE INDEX IF NOT EXISTS idx_donations_project ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_project_updates_project ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON comments(project_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Categories Policies (Public read, admin write)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Projects Policies
CREATE POLICY "Active projects are viewable by everyone"
  ON projects FOR SELECT
  TO authenticated
  USING (
    status IN ('active', 'fully_funded', 'completed')
    OR creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Project creators can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    creator_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('project_creator', 'admin')
    )
  );

CREATE POLICY "Creators can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Donations Policies
CREATE POLICY "Donors can view own donations"
  ON donations FOR SELECT
  TO authenticated
  USING (
    donor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = donations.project_id
      AND projects.creator_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (donor_id = auth.uid());

-- Project Updates Policies
CREATE POLICY "Project updates are viewable by everyone"
  ON project_updates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
      AND projects.status IN ('active', 'fully_funded', 'completed')
    )
    OR EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
      AND projects.creator_id = auth.uid()
    )
  );

CREATE POLICY "Project creators can add updates"
  ON project_updates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_updates.project_id
      AND projects.creator_id = auth.uid()
    )
  );

-- Comments Policies
CREATE POLICY "Comments are viewable on active projects"
  ON comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = comments.project_id
      AND projects.status IN ('active', 'fully_funded', 'completed')
    )
  );

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert Default Categories
INSERT INTO categories (name, description, icon) VALUES
  ('Education', 'Educational programs, schools, scholarships', 'book-open'),
  ('Healthcare', 'Medical care, clinics, health programs', 'heart-pulse'),
  ('Clean Water', 'Water wells, sanitation, hygiene', 'droplet'),
  ('Food Security', 'Food programs, agriculture, nutrition', 'apple'),
  ('Housing', 'Shelter, housing construction, repairs', 'home'),
  ('Skills Training', 'Vocational training, job skills', 'briefcase')
ON CONFLICT (name) DO NOTHING;

-- Function to update raised_amount when donation is completed
CREATE OR REPLACE FUNCTION update_project_raised_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE projects
    SET raised_amount = raised_amount + NEW.amount,
        status = CASE
          WHEN raised_amount + NEW.amount >= goal_amount THEN 'fully_funded'::project_status
          ELSE status
        END,
        updated_at = now()
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update raised_amount
CREATE TRIGGER on_donation_completed
  AFTER UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_project_raised_amount();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();