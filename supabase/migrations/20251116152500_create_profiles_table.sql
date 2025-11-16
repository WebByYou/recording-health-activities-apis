CREATE TABLE
  public.profiles (
    id uuid NOT NULL PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    avatar_url text,
    created_at timestamptz DEFAULT now () NOT NULL,
    -- 2. "เชื่อม" ID นี้กับตาราง auth.users (ถ้า user ถูกลบ, profile ก็ถูกลบตาม)
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
  );

-- 3. เปิด RLS (Row Level Security) - โคตรสำคัญ!!
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. ตั้ง Policy (กฎ)
--  - ให้ทุกคนอ่าน profile ได้
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR
SELECT
  USING (true);

--  - ให้ user สร้าง profile ของ "ตัวเอง" ได้
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT
WITH
  CHECK (auth.uid () = id);

--  - ให้ user แก้ไข profile ของ "ตัวเอง" ได้
CREATE POLICY "Users can update their own profile." ON public.profiles FOR
UPDATE USING (auth.uid () = id);