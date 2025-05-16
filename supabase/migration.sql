
-- Create unit_characteristics table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.unit_characteristics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  description_es TEXT,
  description_fr TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add row level security
ALTER TABLE public.unit_characteristics ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage unit_characteristics
CREATE POLICY "Allow admin access to unit characteristics" 
  ON public.unit_characteristics 
  FOR ALL 
  TO authenticated 
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE wab_admin = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE wab_admin = true));
