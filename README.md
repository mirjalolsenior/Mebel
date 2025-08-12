# Mebel Dashboard - Vite + React + Supabase (v3)
Features:
- 4 sections: Products, Orders, Clients, CustomSection
- Separate Admin page at /admin (password: sherzod)
- Supabase realtime subscriptions for each table
- Totals shown under each table
- Responsive layout and PWA service-worker skeleton

Quick start:
1. unzip the project
2. cd mebel-supabase-project-v3
3. npm install
4. Run SQL in Supabase from sql/schema.sql to create tables
5. npm run dev
6. Open http://localhost:5173 (or the URL shown by Vite)

Admin:
- Visit /admin or click Admin in the navbar
- Enter password: sherzod
- In admin mode you can delete rows from all tables

Notes:
- Replace Supabase URL / ANON KEY in src/supabaseClient.js if you want to use different credentials.
- For production, add proper Auth & RLS in Supabase and secure keys.
# Mebel
# Mebel
# Mebel
