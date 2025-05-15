
-- Function to get cases by client ID
CREATE OR REPLACE FUNCTION public.get_cases_by_client_id(client_id uuid)
RETURNS TABLE (
  id uuid,
  title text,
  caseNumber text, 
  status text,
  description text,
  openDate timestamptz,
  courtDate timestamptz,
  caseType text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    title,
    caseNumber,
    status,
    description,
    openDate,
    courtDate,
    caseType
  FROM public.cases
  WHERE clientId = client_id
  ORDER BY openDate DESC;
$$;

-- Function to get court dates by client ID
CREATE OR REPLACE FUNCTION public.get_court_dates_by_client_id(client_id uuid)
RETURNS TABLE (
  id uuid,
  title text,
  date text,
  time text,
  location text,
  caseId uuid,
  caseTitle text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    cd.id,
    cd.title,
    cd.date::text,
    cd.time,
    cd.location,
    cd.caseId,
    c.title as caseTitle
  FROM public.court_dates cd
  LEFT JOIN public.cases c ON cd.caseId = c.id
  WHERE cd.clientId = client_id
  ORDER BY cd.date ASC
  LIMIT 5;
$$;

-- Function to get billing summary by client ID
CREATE OR REPLACE FUNCTION public.get_billing_summary_by_client_id(client_id uuid)
RETURNS TABLE (
  totalHours numeric,
  totalAmount numeric,
  lastBilledDate timestamptz,
  pendingAmount numeric
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    totalHours,
    totalAmount,
    lastBilledDate,
    pendingAmount
  FROM public.billing_summaries
  WHERE clientId = client_id
  LIMIT 1;
$$;
