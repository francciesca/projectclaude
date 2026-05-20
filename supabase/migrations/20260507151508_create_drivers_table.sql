/*
  # Create drivers table

  1. New Tables
    - `drivers`
      - `id` (uuid, primary key)
      - `rut` (text, not null)
      - `name` (text, not null)
      - `phone` (text)
      - `email` (text)
      - `address` (text)
      - `license_number` (text)
      - `license_expiry` (text)
      - `rating` (numeric, default 5)
      - `monthly_hours` (integer, default 0)
      - `assigned_vehicle` (text)
      - `company_id` (uuid, references companies)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Users can CRUD drivers in their own company
*/

CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rut text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  license_number text NOT NULL DEFAULT '',
  license_expiry text NOT NULL DEFAULT '',
  rating numeric NOT NULL DEFAULT 5,
  monthly_hours integer NOT NULL DEFAULT 0,
  assigned_vehicle text,
  company_id uuid NOT NULL REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view drivers in their company"
  ON drivers FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert drivers in their company"
  ON drivers FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update drivers in their company"
  ON drivers FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete drivers in their company"
  ON drivers FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX idx_drivers_company_id ON drivers(company_id);
