Mebel — Polished (Netlify-ready)

Features:
- 4 sections: Tovarlar, Zakazlar, Doimiy mijozlar, Mijozlar
- Card-based UI, modern minimal design, stylish inputs
- Supabase CRUD + Realtime notifications
- PWA (manifest + service worker)
- .env.example included — use Netlify Environment Variables for production

How to run locally:
1. Copy .env.example -> .env and fill values OR set Netlify env variables
2. npm i
3. npm run dev

Netlify deploy:
- Build command: npm run build
- Publish dir: dist
- Ensure env vars set in Netlify