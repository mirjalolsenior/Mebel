import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { num, fmt, showOSNotification } from '../utils'

export default function Orders(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({product_type:'',quantity:'',paid_amount:'',delivery_date:''})
  const [totals,setTotals] = useState({paid:0,remaining:0})
  const [toast,setToast] = useState(null)

  async function fetchItems(){
    const { data, error } = await supabase.from('orders').select('*').order('created_at',{ascending:false})
    if(error) return console.error(error)
    setItems(data || [])
  }

  useEffect(()=>{
    fetchItems()
    const ch = supabase.channel('public:orders')
      .on('postgres_changes', {event:'*', schema:'public', table:'orders'}, (p)=>{
        fetchItems()
        if(p.eventType === 'INSERT'){
          showOSNotification('Yangi buyurtma', `${p.new.product_type} — ${p.new.quantity} dona`)
        }
      })
      .subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  }, [])

  useEffect(()=>{
    let paid=0, remaining=0
    for(const it of items){
      paid += num(it.paid_amount)
      remaining += num(it.remaining_amount)
    }
    setTotals({paid, remaining})
  }, [items])

  async function addItem(e){
    e.preventDefault()
    const payload = {
      product_type: form.product_type?.trim(),
      quantity: num(form.quantity),
      paid_amount: num(form.paid_amount),
      remaining_amount: Math.max(0, num(form.quantity) - num(form.paid_amount)),
      delivery_date: form.delivery_date || null
    }
    const { error } = await supabase.from('orders').insert(payload)
    if(error) return alert(error.message)
    setForm({product_type:'',quantity:'',paid_amount:'',delivery_date:''})
    setToast("Qo'shildi"); setTimeout(()=>setToast(null), 1500)
  }

  async function remove(id){
    if(!confirm("O'chirishni tasdiqlaysizmi?")) return
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if(error) alert(error.message)
  }

  return (
    <div>
      <div className="card">
        <form className="form-row" onSubmit={addItem}>
          <input placeholder="Mahsulot turi" value={form.product_type} onChange={e=>setForm({...form,product_type:e.target.value})} required />
          <input placeholder="Miqdor" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
          <input placeholder="Berilgan (so'm)" type="number" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})} />
          <input placeholder="Yetkazish sana" type="date" value={form.delivery_date} onChange={e=>setForm({...form,delivery_date:e.target.value})} />
          <button className="btn primary" type="submit">Qo'shish</button>
        </form>
      </div>

      <div className="card">
        <div className="row">
          <div className="badge">Jami berildi: {fmt(totals.paid)} so'm</div>
          <div className="badge">Jami qolgan: {fmt(totals.remaining)} so'm</div>
        </div>
      </div>

      <div className="grid">
        {items.map((it)=>(
          <div className="card" key={it.id}>
            <div className="row">
              <strong>{it.product_type}</strong>
              <button className="btn danger" onClick={()=>remove(it.id)}>O'chirish</button>
            </div>
            <div className="kv">
              <strong>Miqdor:</strong><div>{fmt(it.quantity)}</div>
              <strong>Berilgan:</strong><div>{fmt(it.paid_amount)} so'm</div>
              <strong>Qolgan:</strong><div>{fmt(it.remaining_amount)} so'm</div>
              <strong>Yetkazish:</strong><div>{it.delivery_date || '-'}</div>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}