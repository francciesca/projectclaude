/*
  # Create Services Resumen Function

  1. New Functions
    - `services_resumen(org_id uuid)`
      - Returns all services for the given organization
      - Ordered by service_date descending (most recent first)
      - Used by the frontend services list view
*/

CREATE OR REPLACE FUNCTION services_resumen(org_id uuid)
RETURNS SETOF services
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM services
  WHERE company_id = org_id
  ORDER BY service_date DESC, created_at DESC;
END;
$$;
