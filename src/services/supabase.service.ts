import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Database } from "../types/supabase"; // 👈 Import Type ที่เรา Gen มา

dotenv.config(); // โหลด .env เผื่อไว้

// 1. ดึงค่าจาก .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// 2. เช็คว่ามีค่ามั้ย
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing in .env file");
}

// 3. สร้าง Client (แบบรู้จัก Type ของเรา)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
