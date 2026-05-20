/*
  # Create maintenances table

  1. New Tables
    - `maintenances`
      - `id` (uuid, primary key)
      - `vehicle_id` (text, not null)
      - `type` (text, not null - preventive/corrective)
      - `priority` (text, default 'medium')
      - `scheduled_date` (text, not null)
      - `status` (text, default 'scheduled')
      - `progress` (integer, default 0)
      - `tasks` (jsonb, default '[]')
      - `cost` (numeric)
      - `workshop` (text)
      - `notes` (text)
      - `company_id` (uuid, references companies)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Users can CRUD maintenances in their own company
*/

CREATE TABLE IF NOT EXISTS maintenances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id text NOT NULL,
  type text NOT NULL DEFAULT 'preventive',
  priority text NOT NULL DEFAULT 'medium',
  scheduled_date text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  progress integer NOT NULL DEFAULT 0,
  tasks jsonb NOT NULL DEFAULT '[]'::jsonb,
  cost numeric,
  workshop text,
  notes text,
  company_id uuid NOT NULL REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE maintenances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view maintenances in their company"
  ON maintenances FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert maintenances in their company"
  ON maintenances FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update maintenances in their company"
  ON maintenances FOR UPDATE
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

CREATE POLICY "Users can delete maintenances in their company"
  ON maintenances FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX idx_maintenances_company_id ON maintenances(company_id);
CREATE INDEX idx_maintenances_status ON maintenances(status);
