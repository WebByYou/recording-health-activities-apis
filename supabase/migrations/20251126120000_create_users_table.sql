CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS but allow public insert for registration (since we don't have a logged-in user yet)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (register)
CREATE POLICY "Allow public registration" ON public.users FOR INSERT WITH CHECK (true);

-- Allow users to read their own data (placeholder for future auth)
-- This assumes we will eventually have some way to identify the user, 
-- but for now, we just need to store the data.
