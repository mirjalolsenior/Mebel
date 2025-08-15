import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { num, fmt, requestNotificationPermission, showNotification } from '../utils/index'

export default function Products(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({type:'',purchase_price:'',paid_amount:'',quantity:'',description:'',size:'',color:'',image_url:''})
  const [totals,setTotals] = useState({qty:0,sum:0,paid:0,debt:0})

  async function fetchItems(){
    const { data, error } = await supabase.from('products').select('*').order('created_at',{ascending:false})
    if(error) return console.error(error)
    setItems(data||[])
  }

  useEffect(()=>{
    fetchItems()
    requestNotificationPermission()
    const ch = supabase.channel('public:products')
      .on('postgres_changes',{event:'*',schema:'public',table:'products'}, (payload)=>{
        fetchItems()
        if(payload.eventType === 'INSERT') showNotification('Yangi tovar', { body: payload.new.type })
      })
      .subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[])

  useEffect(()=>{
    let qty=0,sum=0,paid=0
    for(const it of items){ qty+=num(it.quantity); sum+=num(it.purchase_price); paid+=num(it.paid_amount) }
    setTotals({qty,sum,paid,debt:sum-paid})
  },[items])

  async function addItem(e){
    e.preventDefault()
    const payload = {...form, purchase_price: num(form.purchase_price), paid_amount: num(form.paid_amount), quantity: parseInt(form.quantity)||0}
    const { error } = await supabase.from('products').insert(payload)
    if(error) return alert(error.message)
    setForm({type:'',purchase_price:'',paid_amount:'',quantity:'',description:'',size:'',color:'',image_url:''})
  }

  async function removeItem(id){ if(!confirm("O'chirishni tasdiqlaysizmi?")) return; const { error } = await supabase.from('products').delete().eq('id', id); if(error) alert(error.message); else fetchItems() }

  return (
    <div>
      <div className="card">
        <h3>Tovar qo'shish</h3>
        <form className="form-grid" onSubmit={addItem}>
          <input placeholder="Nomi" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} required />
          <input placeholder="Olingan summa (so'm)" type="number" value={form.purchase_price} onChange={e=>setForm({...form,purchase_price:e.target.value})} />
          <input placeholder="To'langan (so'm)" type="number" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})} />
          <input placeholder="Miqdor" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
          <input placeholder="Rasm URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
          <input placeholder="O'lcham" value={form.size} onChange={e=>setForm({...form,size:e.target.value})} />
          <input placeholder="Rang" value={form.color} onChange={e=>setForm({...form,color:e.target.value})} />
          <textarea placeholder="Tavsif" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <button className="btn primary" type="submit">Qo'shish</button>
          </div>
        </form>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>Tovarlar</h3>
        <div className="grid">
          {items.map(it=>(
            <article className="productCard" key={it.id}>
              <img src={it.image_url||'/icons/icon-192.png'} alt="" className="productImage" />
              <div className="productBody">
                <h4 className="productTitle">{it.type}</h4>
                <div className="notice">{it.description}</div>
                <div className="kv">
                  <strong>Narx:</strong><div>{fmt(it.purchase_price)} so'm</div>
                  <strong>To'langan:</strong><div>{fmt(it.paid_amount)} so'm</div>
                  <strong>Miqdor:</strong><div>{fmt(it.quantity)}</div>
                  <strong>O'lcham:</strong><div>{it.size||'-'}</div>
                  <strong>Rang:</strong><div>{it.color||'-'}</div>
                  <strong>Qo'shilgan:</strong><div>{new Date(it.created_at).toLocaleString()||'-'}</div>
                </div>
              </div>
              <div className="productActions">
                <button className="btn" onClick={()=>{ navigator.clipboard?.writeText(it.id); alert('ID nusxalandi') }}>ID</button>
                <button className="btn" onClick={()=>removeItem(it.id)}>O'chirish</button>
              </div>
            </article>
          ))}
        </div>

        <div className="summaryRow">
          <div className="statCard"><div className="statLabel">Jami miqdor</div><div className="statValue">{fmt(totals.qty)}</div></div>
          <div className="statCard"><div className="statLabel">Jami summa</div><div className="statValue">{fmt(totals.sum)} so'm</div></div>
          <div className="statCard"><div className="statLabel">Jami to'langan</div><div className="statValue">{fmt(totals.paid)} so'm</div></div>
          <div className="statCard"><div className="statLabel">Jami qarzdorlik</div><div className="statValue">{fmt(totals.debt)} so'm</div></div>
        </div>
      </div>
    </div>
  )
}