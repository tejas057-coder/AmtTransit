import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let SUPABASE_URL = process.env.SUPABASE_URL || "";
let SUPABASE_KEY = process.env.SUPABASE_KEY || "";

// Robust URL check to prevent Supabase Client crash
const isValidUrl = (url: string) => {
  try {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  } catch {
    return false;
  }
};

if (!isValidUrl(SUPABASE_URL)) {
  console.warn("⚠️  Invalid or missing SUPABASE_URL. Using placeholder to prevent crash.");
  SUPABASE_URL = "https://placeholder-url-fix.supabase.co";
}

if (!SUPABASE_KEY || SUPABASE_KEY === "") {
  console.warn("⚠️  Missing SUPABASE_KEY. Using fallback.");
  SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy";
}

console.log("Initializing Supabase with URL:", SUPABASE_URL);
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const connectDatabase = async (): Promise<void> => {
  console.log("Supabase client initialized.");
};

export const disconnectDatabase = async (): Promise<void> => {
  console.log("Supabase client does not need to disconnect.");
};

