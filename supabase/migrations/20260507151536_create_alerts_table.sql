/*
  # Create alerts table

  1. New Tables
    - `alerts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `priority` (text, default 'medium')
      - `type` (text, not null)
      - `date` (text, not null)
      - `company_id` (uuid, references companies)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Users can read/insert/delete alerts in their company
*/

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'medium',
  type text NOT NULL,
  date text NOT NULL,
  company_id uuid NOT NULL REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view alerts in their company"
  ON alerts FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert alerts in their company"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete alerts in their company"
  ON alerts FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX idx_alerts_company_id ON alerts(company_id);
CREATE INDEX idx_alerts_priority ON alerts(priority);
