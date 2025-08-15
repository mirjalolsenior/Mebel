# Mebel Dashboard — Deluxe (Attractive + PWA + Notifications)

- Jozibador **Landing** (hero, gradient, animatsiya)
- **Card-based** responsiv UI (telefon/desktop)
- Supabase **Realtime** + OS **bildirishnoma** (permission berilganda)
- To'liq **PWA** (offline cache, A2HS)
- **Netlify** uchun `_redirects` (SPA router)

## O'rnatish
```
npm i
cp .env.example .env  # va qiymatlarni to'ldiring
npm run dev
```

## PWA
- `manifest.json` + `sw.js` mavjud
- HTTPSda (Netlify) o'rnatish va offline ishlash avtomatik

## Bildirishnoma
- Brauzer ruxsat berganida, yangi **tovar** yoki **zakaz** qo'shilsa OS notification ko'rinadi.
- Push (FCM/OneSignal) qo'shmoqchi bo'lsangiz keyin integratsiya qilamiz.

## Netlify
- `public/_redirects` fayli bor → SPA yo'llari `/index.html`ga tushadi
- Deploy: `npm run build` va `dist/`ni Netlifyga yuboring