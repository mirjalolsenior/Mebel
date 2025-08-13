
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://dblskhfkqkiinjylnsyf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibHNraGZrcWtpaW5qeWxuc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjIzMTIsImV4cCI6MjA3MDU5ODMxMn0.o4d81OgMTXNMbkF40t_nM1ZRAQsyeEp-iGgc2o89W4c')

const $ = s=>document.querySelector(s)
const $$ = s=>document.querySelectorAll(s)
const toast = (m)=>{const t=$('#toast'); t.textContent=m; t.classList.remove('hidden'); setTimeout(()=>t.classList.add('hidden'),2500)}

// PWA init
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(()=>console.log('SW registered'))
    .catch(console.error)
}

// Notification permission UI
const btnPerm = document.getElementById('btn-ask-permission')
const permStatus = document.getElementById('perm-status')
function syncPerm(){
  permStatus.textContent = 'Holat: ' + (Notification?.permission || 'unsupported')
}
syncPerm()
btnPerm?.addEventListener('click', async ()=>{
  try {
    const res = await Notification.requestPermission()
    syncPerm()
    if(res==='granted') toast('Bildirishnoma yoqildi')
  } catch(e){ console.error(e) }
})

function showSWNotification(title, options={}) {
  if (!('serviceWorker' in navigator)) return
  navigator.serviceWorker.getRegistration().then(reg=>{
    if(reg) reg.showNotification(title, options)
  })
}

// Sidebar / tabs navigation
function wireNav(){
  const sections=$$('.section')
  const navBtns=$$('#sidebar-nav .nav-btn')
  const tabBtns=$$('#mobile-tabs .tab-btn')
  function activate(i){
    sections.forEach((sec,idx)=>sec.classList.toggle('hidden', idx!==i))
    navBtns.forEach((b,idx)=>b.classList.toggle('active', idx===i))
    tabBtns.forEach((b,idx)=>b.classList.toggle('active', idx===i))
  }
  navBtns.forEach((btn,i)=>btn.addEventListener('click',()=>activate(i)))
  tabBtns.forEach((btn,i)=>btn.addEventListener('click',()=>activate(i)))
  activate(0)
}
wireNav()

// Render table helper
function renderTable(el, rows, fields){
  if(!rows || !rows.length){ el.innerHTML="<div class='p-3 text-white/70'>Ma'lumot yo'q</div>"; return; }
  const thead = '<tr><th class="text-left">#</th>'+fields.map(f=>`<th class="text-left">${f}</th>`).join('')+'<th class="text-left">Sana</th></tr>'
  const body = rows.map((r,i)=>{
    const tds = fields.map(f=>`<td>${r[f] ?? ''}</td>`).join('')
    const date = r.created_at ? new Date(r.created_at).toLocaleString() : ''
    return `<tr class="hover:bg-white/5"><td>${i+1}</td>${tds}<td>${date}</td></tr>`
  }).join('')
  el.innerHTML = `<div class="overflow-x-auto"><table><thead>${thead}</thead><tbody>${body}</tbody></table></div>`
}

// PRODUCTS
const productsTable = $('#products-table')
const productsTotals = $('#products-totals')
$('#product-form').addEventListener('submit', async (e)=>{
  e.preventDefault()
  const fd = new FormData(e.target)
  const payload = {
    type: fd.get('type'),
    model: fd.get('model'),
    purchase_price: Number(fd.get('purchase_price')||0),
    paid_amount: Number(fd.get('paid_amount')||0),
    quantity: Number(fd.get('quantity')||0),
    delivery_date: fd.get('delivery_date')||null
  }
  const { error } = await supabase.from('products').insert(payload)
  if(error) return alert(error.message)
  e.target.reset(); toast("Tovar qo'shildi")
})
async function fetchProducts(){
  const { data, error } = await supabase.from('products').select('*').order('created_at',{ascending:false})
  if(error) return console.error(error)
  renderTable(productsTable, data, ['type','model','purchase_price','paid_amount','quantity','delivery_date'])
  const tp = data.reduce((s,i)=>s+Number(i.purchase_price||0),0)
  const paid = data.reduce((s,i)=>s+Number(i.paid_amount||0),0)
  const qty = data.reduce((s,i)=>s+Number(i.quantity||0),0)
  productsTotals.innerHTML = `<div class='px-3 py-2 rounded-lg bg-white/10'>Jami olingan: ${tp} so'm</div>
  <div class='px-3 py-2 rounded-lg bg-white/10'>Jami berilgan: ${paid} so'm</div>
  <div class='px-3 py-2 rounded-lg bg-white/10'>Jami miqdor: ${qty}</div>`
}

// ORDERS
const ordersTable = $('#orders-table')
const ordersTotals = $('#orders-totals')
$('#order-form').addEventListener('submit', async (e)=>{
  e.preventDefault()
  const fd = new FormData(e.target)
  const q = Number(fd.get('quantity')||0)
  const paid = Number(fd.get('paid_amount')||0)
  const payload = {
    customer_name: fd.get('customer_name'),
    product_type: fd.get('product_type'),
    model: fd.get('model'),
    quantity: q,
    paid_amount: paid,
    remaining: q - paid,
    delivery_date: fd.get('delivery_date')||null
  }
  const { error } = await supabase.from('orders').insert(payload)
  if(error) return alert(error.message)
  e.target.reset(); toast("Zakaz qo'shildi")
})
async function fetchOrders(){
  const { data, error } = await supabase.from('orders').select('*').order('created_at',{ascending:false})
  if(error) return console.error(error)
  renderTable(ordersTable, data, ['customer_name','product_type','model','quantity','paid_amount','remaining','delivery_date'])
  const total = data.reduce((s,i)=>s+Number(i.quantity||0),0)
  const paid = data.reduce((s,i)=>s+Number(i.paid_amount||0),0)
  const rem = data.reduce((s,i)=>s+Number(i.remaining||0),0)
  ordersTotals.innerHTML = `<div class='px-3 py-2 rounded-lg bg-white/10'>Jami oldi: ${total}</div>
  <div class='px-3 py-2 rounded-lg bg-white/10'>Jami berildi: ${paid}</div>
  <div class='px-3 py-2 rounded-lg bg-white/10'>Jami qoldi: ${rem}</div>`
}

// REGULAR (Doimiy mijozlar) -> uses custom_section table
const regularTable = $('#regular-table')
const regularTotals = $('#regular-totals')
$('#regular-form').addEventListener('submit', async (e)=>{
  e.preventDefault()
  const fd = new FormData(e.target)
  const payload = {
    name: fd.get('name'),
    brought_quantity: Number(fd.get('brought_quantity')||0),
    tape_used: Number(fd.get('tape_used')||0),
    paid_amount: Number(fd.get('paid_amount')||0),
    remaining_amount: Number(fd.get('remaining_amount')||0)
  }
  const { error } = await supabase.from('custom_section').insert(payload)
  if(error) return alert(error.message)
  e.target.reset(); toast("Doimiy mijoz qo'shildi")
})
async function fetchRegular(){
  const { data, error } = await supabase.from('custom_section').select('*').order('created_at',{ascending:false})
  if(error) return console.error(error)
  renderTable(regularTable, data, ['name','brought_quantity','tape_used','paid_amount','remaining_amount'])
  const paid = data.reduce((s,i)=>s+Number(i.paid_amount||0),0)
  const rem = data.reduce((s,i)=>s+Number(i.remaining_amount||0),0)
  regularTotals.innerHTML = `<div class='px-3 py-2 rounded-lg bg-white/10'>Jami to'langan: ${paid} so'm</div>
  <div class='px-3 py-2 rounded-lg bg-white/10'>Jami qolgan: ${rem} so'm</div>`
}

// CLIENTS
const clientsTable = $('#clients-table')
const clientsTotals = $('#clients-totals')
$('#client-form').addEventListener('submit', async (e)=>{
  e.preventDefault()
  const fd = new FormData(e.target)
  const payload = {
    name: fd.get('name'),
    brought_quantity: Number(fd.get('brought_quantity')||0),
    tape_used: Number(fd.get('tape_used')||0),
    paid_amount: Number(fd.get('paid_amount')||0),
    remaining_amount: Number(fd.get('remaining_amount')||0)
  }
  const { error } = await supabase.from('clients').insert(payload)
  if(error) return alert(error.message)
  e.target.reset(); toast("Mijoz qo'shildi")
})
async function fetchClients(){
  const { data, error } = await supabase.from('clients').select('*').order('created_at',{ascending:false})
  if(error) return console.error(error)
  renderTable(clientsTable, data, ['name','brought_quantity','tape_used','paid_amount','remaining_amount'])
  const paid = data.reduce((s,i)=>s+Number(i.paid_amount||0),0)
  const rem = data.reduce((s,i)=>s+Number(i.remaining_amount||0),0)
  clientsTotals.innerHTML = `<div class='px-3 py-2 rounded-lg bg-white/10'>Jami to'langan: ${paid} so'm</div>
  <div class='px-3 py-2 rounded-lg bg-white/10'>Jami qolgan: ${rem} so'm</div>`
}

// Realtime subscriptions + notifications for inserts
function subscribeAll(){
  supabase.channel('public:orders')
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'orders'},(payload)=>{
      const r = payload.new
      toast("Yangi zakaz")
      const name = r.customer_name || 'Mijoz'
      const d = r.delivery_date
      if (d) {
        const msg = `Yangi zakaz: ${name} — yetkazish: ${d}`
        showSWNotification('Yangi zakaz', { body: msg, icon: '/icons/icon-192.png' })
      }
      fetchOrders(); // refresh
    }).subscribe()

  supabase.channel('public:products').on('postgres_changes',{event:'INSERT',schema:'public',table:'products'},()=>{toast("Yangi tovar"); fetchProducts()}).subscribe()
  supabase.channel('public:custom_section').on('postgres_changes',{event:'INSERT',schema:'public',table:'custom_section'},()=>{toast("Doimiy mijoz yangilandi"); fetchRegular()}).subscribe()
  supabase.channel('public:clients').on('postgres_changes',{event:'INSERT',schema:'public',table:'clients'},()=>{toast("Mijoz yangilandi"); fetchClients()}).subscribe()
}

// Due date checker — Asia/Tashkent logic
function ymd(d){ return d.toISOString().slice(0,10) }
function todayTashkent(){
  // emulate Asia/Tashkent by offsetting using Intl
  const now = new Date()
  const s = new Intl.DateTimeFormat('uz-UZ', { timeZone: 'Asia/Tashkent', year:'numeric', month:'2-digit', day:'2-digit' }).format(now)
  const [d,m,y] = s.split('.')
  return new Date(`${y}-${m}-${d}T00:00:00`)
}
function addDays(d, n){ const x=new Date(d); x.setDate(x.getDate()+n); return x }

async function checkDueOrders(showAll=false){
  const base = todayTashkent()
  const tomorrow = addDays(base, 1)
  const todayStr = ymd(base)
  const tomorrowStr = ymd(tomorrow)
  const { data, error } = await supabase.from('orders').select('id,customer_name,delivery_date')
  if(error) return console.error(error)
  for (const r of (data||[])) {
    if(!r.delivery_date) continue
    const d = new Date(r.delivery_date)
    const dStr = ymd(d)
    const name = r.customer_name || 'Mijoz'
    if (dStr === todayStr) {
      showSWNotification('Bugun zakaz kuni!', { body: `Bugun ${name} zakazi kuni!`, icon:'/icons/icon-192.png' })
    } else if (dStr === tomorrowStr) {
      showSWNotification('Ertangi eslatma', { body: `Eslatma: Ertaga ${name} zakazi tayyor bo'lishi kerak!`, icon:'/icons/icon-192.png' })
    } else if (showAll) {
      // nothing
    }
  }
}

// initial loads
fetchProducts(); fetchOrders(); fetchRegular(); fetchClients(); subscribeAll();
checkDueOrders(true)
setInterval(()=>checkDueOrders(false), 60*60*1000) // har soat tekshirish
