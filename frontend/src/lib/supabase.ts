import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vcahhbylqrlqntnibjzt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PwxcutOw2EqEC5pY3c0JcA_Ae17iVNc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
