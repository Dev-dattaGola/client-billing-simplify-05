
-- Create court_dates table for storing upcoming court appearances
CREATE TABLE IF NOT EXISTS public.court_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  clientId UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  caseId UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create billing_summaries table for client billing information
CREATE TABLE IF NOT EXISTS public.billing_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clientId UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  totalHours NUMERIC(10, 2) NOT NULL DEFAULT 0,
  totalAmount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  pendingAmount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  lastBilledDate TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.court_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_summaries ENABLE ROW LEVEL SECURITY;

-- Create policy for court_dates - only allow clients to see their own dates
CREATE POLICY "Clients can view their own court dates"
ON public.court_dates
FOR SELECT
USING (clientId = (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- Create policy for billing_summaries - only allow clients to see their own billing info
CREATE POLICY "Clients can view their own billing summaries"
ON public.billing_summaries
FOR SELECT
USING (clientId = (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- Create policy for attorneys to manage court dates
CREATE POLICY "Attorneys can manage court dates"
ON public.court_dates
FOR ALL
USING (auth.uid() IN (
  SELECT a.user_id FROM public.attorneys a
  JOIN public.clients c ON c.assigned_attorney_id = a.id
  WHERE c.id = court_dates.clientId
));

-- Create policy for attorneys to manage billing summaries
CREATE POLICY "Attorneys can manage billing summaries"
ON public.billing_summaries
FOR ALL
USING (auth.uid() IN (
  SELECT a.user_id FROM public.attorneys a
  JOIN public.clients c ON c.assigned_attorney_id = a.id
  WHERE c.id = billing_summaries.clientId
));

-- Allow admins and superadmins to manage all data
CREATE POLICY "Admins can manage all court dates"
ON public.court_dates
FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'superadmin'));

CREATE POLICY "Admins can manage all billing summaries"
ON public.billing_summaries
FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'superadmin'));

-- Add sample data for testing
INSERT INTO public.court_dates (title, date, time, location, clientId, caseId, notes)
SELECT
  'Initial Hearing',
  (now() + interval '14 days')::date,
  '10:00 AM',
  'County Courthouse, Room 302',
  c.id,
  cs.id,
  'Be prepared to discuss settlement options'
FROM
  public.clients c
  JOIN public.cases cs ON cs.clientId = c.id
LIMIT 1;

INSERT INTO public.court_dates (title, date, time, location, clientId, caseId, notes)
SELECT
  'Deposition',
  (now() + interval '7 days')::date,
  '2:30 PM',
  'Law Offices of Smith & Jones, 123 Main St',
  c.id,
  cs.id,
  'Witness deposition'
FROM
  public.clients c
  JOIN public.cases cs ON cs.clientId = c.id
LIMIT 1;

INSERT INTO public.billing_summaries (clientId, totalHours, totalAmount, pendingAmount, lastBilledDate)
SELECT
  c.id,
  45.5,
  11375.00,
  2250.00,
  now()
FROM
  public.clients c
LIMIT 1;
