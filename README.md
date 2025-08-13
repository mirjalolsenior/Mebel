Mebel Dashboard (PWA) — Netlify-ready
=====================================

🚀 Nimalar bor:
- 4 bo‘lim: Tovarlar, Zakazlar, Doimiy mijozlar, Mijozlar
- Supabase real-time (INSERT paytida avtomatik yangilanish)
- PWA: `manifest.json`, `service-worker.js` (offline cache, homescreen install)
- Bildirishnoma: 
  - Zakaz (orders.delivery_date) bo‘yicha **ertasi kuni** va **o‘sha kuni** eslatadi
  - Yangi yozuv qo‘shilganda real-time xabar
- Admin panel (parol: `sherzod`): ma’lumotlarni o‘chirish

🧩 Muhim:
- `orders` jadvalida `customer_name` ustuni bo‘lsa yaxshi. Bo‘lmasa, SQL bilan qo‘shing:
  ```sql
  alter table public.orders add column if not exists customer_name text;
  ```
- `products`, `orders`, `clients`, `custom_section` jadvallari mavjud bo‘lishi kerak.

📦 Deploy (Netlify Drop):
1) https://app.netlify.com/drop → ushbu ZIP faylni tashlang.
2) Sayt ochiladi: /
3) Admin: /admin.html

🔔 Bildirishnomalar qanday ishlaydi?
- Birinchi kirganda ruxsat so‘raydi (Allow bosish kerak).
- Sahifa ochiq yoki PWA o‘rnatilgan holda backgound’da bo‘lsa — service worker `showNotification` qiladi.
- **To‘liq push server** kerak bo‘lmasa — shu yetarli. To‘liq push (yopiq holatda ham schedule) uchun keyingi bosqichda Netlify Functions + Web Push (VAPID) qo‘shamiz.

🗂 Jadval maydonlari (minimal):
- products: id, created_at, type, model, purchase_price, paid_amount, quantity, delivery_date
- orders: id, created_at, customer_name, product_type, model, quantity, paid_amount, remaining, delivery_date
- clients: id, created_at, name, brought_quantity, tape_used, paid_amount, remaining_amount
- custom_section: id, created_at, name, brought_quantity, tape_used, paid_amount, remaining_amount
