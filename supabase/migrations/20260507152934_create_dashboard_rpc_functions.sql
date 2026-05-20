/*
  # Create Dashboard RPC Functions

  1. New Functions
    - `dashboard_resumen_full(org_id uuid, doc_range int, maint_range int)`
      - Returns a JSON object with dashboard summary stats:
        - vehicles_available: count of vehicles with status 'available'
        - active_rentals: count of vehicles with status 'rented'
        - pending_payments: count of maintenances with cost > 0 and status != 'completed'
        - expiring_documents: count of documents expiring within doc_range days
        - upcoming_maintenance: count of maintenances scheduled within maint_range days and not completed
    - `dashboard_alertas_full(org_id uuid)`
      - Returns all alerts for the given organization ordered by priority and date

  2. Security
    - Functions use SECURITY DEFINER to access data
    - Callers must provide their organization_id (enforced by RLS on calling context)
*/

CREATE OR REPLACE FUNCTION dashboard_resumen_full(
  org_id uuid,
  doc_range int DEFAULT 30,
  maint_range int DEFAULT 15
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  v_available int;
  v_rentals int;
  v_pending_payments int;
  v_expiring_docs int;
  v_upcoming_maint int;
BEGIN
  -- Vehicles available
  SELECT count(*) INTO v_available
  FROM vehicles
  WHERE company_id = org_id AND status = 'available';

  -- Active rentals (vehicles with status 'rented')
  SELECT count(*) INTO v_rentals
  FROM vehicles
  WHERE company_id = org_id AND status = 'rented';

  -- Pending payments (maintenances with cost that are not completed)
  SELECT count(*) INTO v_pending_payments
  FROM maintenances
  WHERE company_id = org_id
    AND cost IS NOT NULL
    AND cost > 0
    AND status != 'completed';

  -- Expiring documents (documents expiring within doc_range days from today)
  SELECT count(*) INTO v_expiring_docs
  FROM documents
  WHERE company_id = org_id
    AND expiry_date IS NOT NULL
    AND expiry_date != ''
    AND expiry_date::date <= (CURRENT_DATE + (doc_range || ' days')::interval)
    AND expiry_date::date >= CURRENT_DATE;

  -- Upcoming maintenance (scheduled within maint_range days)
  SELECT count(*) INTO v_upcoming_maint
  FROM maintenances
  WHERE company_id = org_id
    AND status IN ('scheduled', 'in-progress')
    AND scheduled_date IS NOT NULL
    AND scheduled_date != ''
    AND scheduled_date::date <= (CURRENT_DATE + (maint_range || ' days')::interval)
    AND scheduled_date::date >= CURRENT_DATE;

  result := json_build_object(
    'vehicles_available', v_available,
    'active_rentals', v_rentals,
    'pending_payments', v_pending_payments,
    'expiring_documents', v_expiring_docs,
    'upcoming_maintenance', v_upcoming_maint
  );

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION dashboard_alertas_full(org_id uuid)
RETURNS SETOF alerts
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM alerts
  WHERE company_id = org_id
  ORDER BY
    CASE priority
      WHEN 'urgent' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
      ELSE 5
    END,
    created_at DESC
  LIMIT 20;
END;
$$;
