/*
  # Create companies and profiles tables

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `created_at` (timestamptz)
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `role` (text, default 'user')
      - `company_id` (uuid, references companies)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Companies: authenticated users can read their own company
    - Profiles: users can read/update their own profile
*/

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  company_id uuid REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Companies policies
CREATE POLICY "Users can read their company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.company_id = companies.id
      AND profiles.id = auth.uid()
    )
  );

-- Insert default companies
INSERT INTO companies (name) VALUES
  ('Cabal'),
  ('TransFleet SA'),
  ('Logística Norte');
