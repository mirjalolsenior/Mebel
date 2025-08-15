import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dblskhfkqkiinjylnsyf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp...o4d81OgMTXNMbkF40t_nM1ZRAQsyeEp-iGgc2o89W4c';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing! Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
