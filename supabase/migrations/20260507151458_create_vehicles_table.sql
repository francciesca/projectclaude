/*
  # Create vehicles table

  1. New Tables
    - `vehicles`
      - `id` (uuid, primary key)
      - `vin` (text)
      - `plate` (text, not null)
      - `brand` (text, not null)
      - `model` (text, not null)
      - `year` (integer)
      - `color` (text)
      - `vehicle_type` (text)
      - `purchase_date` (text)
      - `mileage` (integer, default 0)
      - `status` (text, default 'available')
      - `last_maintenance` (text)
      - `last_maintenance_mileage` (integer)
      - `next_maintenance` (text)
      - `next_maintenance_mileage` (integer)
      - `maintenance_interval` (integer, default 10000)
      - `technical_review_expiry` (text)
      - `current_client` (text)
      - `company_id` (uuid, references companies)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on vehicles table
    - Users can CRUD vehicles in their own company
*/

CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vin text NOT NULL DEFAULT '',
  plate text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL DEFAULT 2024,
  color text NOT NULL DEFAULT '',
  vehicle_type text NOT NULL DEFAULT 'camion',
  purchase_date text NOT NULL DEFAULT '',
  mileage integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'available',
  last_maintenance text,
  last_maintenance_mileage integer,
  next_maintenance text,
  next_maintenance_mileage integer,
  maintenance_interval integer NOT NULL DEFAULT 10000,
  technical_review_expiry text,
  current_client text,
  company_id uuid NOT NULL REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vehicles in their company"
  ON vehicles FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert vehicles in their company"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update vehicles in their company"
  ON vehicles FOR UPDATE
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

CREATE POLICY "Users can delete vehicles in their company"
  ON vehicles FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
