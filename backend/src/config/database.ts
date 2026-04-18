import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn("⚠️  Supabase environment variables are missing! Make sure to add SUPABASE_URL and SUPABASE_KEY to your .env");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const connectDatabase = async (): Promise<void> => {
  console.log("Supabase client initialized.");
};

export const disconnectDatabase = async (): Promise<void> => {
  console.log("Supabase client does not need to disconnect.");
};

