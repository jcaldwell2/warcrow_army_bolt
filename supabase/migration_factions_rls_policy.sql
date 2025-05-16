
-- This file contains SQL commands to create RLS policies for the factions table.
-- Run these commands in the Supabase SQL editor to apply the policies.

-- Create a policy that allows anyone to read factions data
CREATE POLICY "Allow public read access to factions" 
ON public.factions
FOR SELECT
USING (true);

-- Create policies for admin users to manage factions
CREATE POLICY "Allow admin users to insert factions"
ON public.factions
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT id FROM public.profiles WHERE wab_admin = true
));

CREATE POLICY "Allow admin users to update factions"
ON public.factions
FOR UPDATE
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE wab_admin = true
));

CREATE POLICY "Allow admin users to delete factions"
ON public.factions
FOR DELETE
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE wab_admin = true
));
