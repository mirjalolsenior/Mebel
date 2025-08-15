import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { num, fmt, showOSNotification } from '../utils'

export default function Products(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({type:'',purchase_price:'',paid_amount:'',quantity:'',delivery_date:''})
  const [totals,setTotals] = useState({total_purchase:0,total_paid:0,total_qty:0})
  const [toast,setToast] = useState(null)

  async function fetchItems(){
    const { data, error } = await supabase.from('products').select('*').order('created_at',{ascending:false})
    if(error) return console.error(error)
    setItems(data || [])
  }

  useEffect(()=>{
    fetchItems()
    const ch = supabase.channel('public:products')
      .on('postgres_changes', {event:'*', schema:'public', table:'products'}, (p)=>{
        fetchItems()
        if(p.eventType === 'INSERT'){
          showOSNotification('Yangi tovar qo\'shildi', `${p.new.type} (${p.new.quantity} dona)`)
        }
      })
      .subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  }, [])

  useEffect(()=>{
    let total_purchase=0, total_paid=0, total_qty=0
    for(const it of items){
      total_purchase += num(it.purchase_price)
      total_paid += num(it.paid_amount)
      total_qty += num(it.quantity)
    }
    setTotals({total_purchase, total_paid, total_qty})
  }, [items])

  async function addItem(e){
    e.preventDefault()
    const payload = {
      type: form.type?.trim(),
      purchase_price: num(form.purchase_price),
      paid_amount: num(form.paid_amount),
      quantity: num(form.quantity),
      delivery_date: form.delivery_date || null
    }
    const { error } = await supabase.from('products').insert(payload)
    if(error) return alert(error.message)
    setForm({type:'',purchase_price:'',paid_amount:'',quantity:'',delivery_date:''})
    setToast("Qo'shildi"); setTimeout(()=>setToast(null), 1500)
  }

  async function remove(id){
    if(!confirm("O'chirishni tasdiqlaysizmi?")) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if(error) alert(error.message)
  }

  return (
    <div>
      <div className="card">
        <form className="form-row" onSubmit={addItem}>
          <input placeholder="Turi" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} required />
          <input placeholder="Olingan (so'm)" type="number" value={form.purchase_price} onChange={e=>setForm({...form,purchase_price:e.target.value})} required />
          <input placeholder="Berilgan (so'm)" type="number" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})} />
          <input placeholder="Miqdor" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
          <input placeholder="Yetkazish sana" type="date" value={form.delivery_date} onChange={e=>setForm({...form,delivery_date:e.target.value})} />
          <button className="btn primary" type="submit">Qo'shish</button>
        </form>
      </div>

      <div className="card">
        <div className="row">
          <div className="badge">Jami olingan: {fmt(totals.total_purchase)} so'm</div>
          <div className="badge">Jami berilgan: {fmt(totals.total_paid)} so'm</div>
          <div className="badge">Jami miqdor: {fmt(totals.total_qty)}</div>
        </div>
      </div>

      <div className="grid">
        {items.map((it)=>(
          <div className="card" key={it.id}>
            <div className="row">
              <strong>{it.type}</strong>
              <button className="btn danger" onClick={()=>remove(it.id)}>O'chirish</button>
            </div>
            <div className="kv">
              <strong>Olingan:</strong><div>{fmt(it.purchase_price)} so'm</div>
              <strong>Berilgan:</strong><div>{fmt(it.paid_amount)} so'm</div>
              <strong>Miqdor:</strong><div>{fmt(it.quantity)}</div>
              <strong>Yetkazish:</strong><div>{it.delivery_date || '-'}</div>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}