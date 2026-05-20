/*
  # Create documents table

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `type` (text, not null)
      - `expiry_date` (text, not null)
      - `status` (text, default 'valid')
      - `vehicle_id` (text)
      - `driver_id` (text)
      - `company_id` (uuid, references companies)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Users can CRUD documents in their own company
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'other',
  expiry_date text NOT NULL,
  status text NOT NULL DEFAULT 'valid',
  vehicle_id text,
  driver_id text,
  company_id uuid NOT NULL REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents in their company"
  ON documents FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents in their company"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update documents in their company"
  ON documents FOR UPDATE
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

CREATE POLICY "Users can delete documents in their company"
  ON documents FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE INDEX idx_documents_company_id ON documents(company_id);
CREATE INDEX idx_documents_type ON documents(type);
