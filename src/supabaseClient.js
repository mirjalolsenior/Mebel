import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dblskhfkqkiinjylnsyf.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibHNraGZrcWtpaW5qeWxuc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjIzMTIsImV4cCI6MjA3MDU5ODMxMn0.o4d81OgMTXNMbkF40t_nM1ZRAQsyeEp-iGgc2o89W4c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
