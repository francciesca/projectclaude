/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `client_id` (text) - client identifier
      - `vehicle_id` (text) - vehicle plate/identifier
      - `service_date` (text) - date of service
      - `service_type` (text) - type of service performed
      - `chofer_nombre` (text) - driver/operator name
      - `chofer_telefono` (text) - driver/operator phone
      - `origen` (text) - origin location
      - `destino` (text) - destination location
      - `trabajo_realizado` (text) - description of work performed
      - `valor_cobrado` (numeric) - amount charged
      - `payment_status` (text) - pending, partial, paid
      - `payment_date` (text) - date of payment
      - `observaciones` (text) - additional observations
      - `company_id` (uuid, FK to companies)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `services` table
    - Add policies for authenticated users scoped to their company

  3. Notes
    - Services represent operational jobs (transport, machinery work, etc.)
    - Separate from rentals which are vehicle-only without driver
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL DEFAULT '',
  vehicle_id text NOT NULL DEFAULT '',
  service_date text NOT NULL DEFAULT '',
  service_type text NOT NULL DEFAULT 'transport',
  chofer_nombre text NOT NULL DEFAULT '',
  chofer_telefono text NOT NULL DEFAULT '',
  origen text NOT NULL DEFAULT '',
  destino text NOT NULL DEFAULT '',
  trabajo_realizado text NOT NULL DEFAULT '',
  valor_cobrado numeric DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_date text DEFAULT '',
  observaciones text DEFAULT '',
  company_id uuid NOT NULL REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view services for their company"
  ON services
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert services for their company"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can update services for their company"
  ON services
  FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete services for their company"
  ON services
  FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()
    )
  );
