ALTER TABLE profiles
DROP CONSTRAINT profiles_id_fkey;

ALTER TABLE profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id)
REFERENCES public.users (id)
ON DELETE CASCADE;
