/*
  # Create Vehicle Search Functions

  1. New Functions
    - `search_patentes(org_id uuid, term text)`
      - Returns matching vehicle plates (patentes) for the given organization
      - Filters by ILIKE pattern on the plate column
      - Limited to 10 results
    - `search_marcas(org_id uuid, term text)`
      - Returns distinct matching vehicle brands (marcas) for the given organization
      - Filters by ILIKE pattern on the brand column
      - Limited to 10 results

  2. Security
    - SECURITY DEFINER to allow controlled access
    - Scoped to organization via org_id parameter
*/

CREATE OR REPLACE FUNCTION search_patentes(org_id uuid, term text DEFAULT '')
RETURNS TABLE(plate text, brand text, model text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT v.plate, v.brand, v.model
  FROM vehicles v
  WHERE v.company_id = org_id
    AND v.plate ILIKE '%' || term || '%'
  ORDER BY v.plate
  LIMIT 10;
END;
$$;

CREATE OR REPLACE FUNCTION search_marcas(org_id uuid, term text DEFAULT '')
RETURNS TABLE(brand text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT v.brand
  FROM vehicles v
  WHERE v.company_id = org_id
    AND v.brand ILIKE '%' || term || '%'
  ORDER BY v.brand
  LIMIT 10;
END;
$$;
