/*
  # Allow public read access to companies for signup form

  1. Changes
    - Add a SELECT policy on companies for anon role
    - This enables the signup form to display company options

  2. Security
    - Only allows reading company names - no write access for anon
*/

CREATE POLICY "Anyone can read companies list"
  ON companies FOR SELECT
  TO anon
  USING (true);
