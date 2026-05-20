/*
  # Create trigger for auto-creating profiles on signup

  1. Changes
    - Function `handle_new_user` creates a profile entry automatically
    - Trigger fires on insert to auth.users
    - Reads company_id from user metadata

  2. Notes
    - When signing up, pass company_id in user_metadata
    - Profile is auto-populated with the user's name and company
*/

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, name, role, company_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    (NEW.raw_user_meta_data->>'company_id')::uuid
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
