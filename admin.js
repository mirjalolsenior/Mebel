
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://dblskhfkqkiinjylnsyf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibHNraGZrcWtpaW5qeWxuc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjIzMTIsImV4cCI6MjA3MDU5ODMxMn0.o4d81OgMTXNMbkF40t_nM1ZRAQsyeEp-iGgc2o89W4c')

const loginForm = document.getElementById('admin-login-form')
const controls = document.getElementById('admin-controls')
const toast = (m)=>{const t=document.getElementById('toast'); t.textContent=m; t.classList.remove('hidden'); setTimeout(()=>t.classList.add('hidden'),2500)}

loginForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  const pw = loginForm.password.value
  if(pw !== 'sherzod') return alert("Parol noto'g'ri")
  loginForm.classList.add('hidden')
  controls.classList.remove('hidden')
  loadAll()
})

document.getElementById('logout-btn').addEventListener('click', ()=>{ controls.classList.add('hidden'); loginForm.classList.remove('hidden') })

async function loadAll(){
  const p = (await supabase.from('products').select('*').order('created_at',{ascending:false})).data || []
  render('admin-products', p, 'products')
  const o = (await supabase.from('orders').select('*').order('created_at',{ascending:false})).data || []
  render('admin-orders', o, 'orders')
  const c = (await supabase.from('clients').select('*').order('created_at',{ascending:false})).data || []
  render('admin-clients', c, 'clients')
  const cs = (await supabase.from('custom_section').select('*').order('created_at',{ascending:false})).data || []
  render('admin-custom', cs, 'custom_section')
}

function render(id, rows, table){
  const el = document.getElementById(id)
  if(!rows.length){ el.innerHTML = "<div class='p-2 text-white/70'>Bo'sh</div>"; return }
  const body = rows.map((r,i)=>`<tr class="hover:bg-white/5">
    <td class="py-2 px-2">${i+1}</td>
    <td class="py-2 px-2 text-xs md:text-sm">${escapeHtml(JSON.stringify(r))}</td>
    <td class="py-2 px-2"><button class="btn-del" data-id="${r.id}" data-table="${table}">O'chirish</button></td>
  </tr>`).join('')
  el.innerHTML = `<div class="overflow-x-auto"><table><thead><tr><th>#</th><th>Ma'lumot</th><th></th></tr></thead><tbody>${body}</tbody></table></div>`
  el.querySelectorAll('.btn-del').forEach(b=>b.addEventListener('click', async ()=>{
    if(!confirm("O'chirsinmi?")) return
    const id=b.dataset.id, t=b.dataset.table
    const { error } = await supabase.from(t).delete().eq('id', id)
    if(error) return alert(error.message)
    toast("O'chirildi"); loadAll()
  }))
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'})[s]))
}
