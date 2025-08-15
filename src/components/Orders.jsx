import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { num, fmt, requestNotificationPermission, showNotification } from '../utils/index'

export default function Orders(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({client_name:'',client_phone:'',product:'',quantity:'',total_price:'',paid_amount:'',status:'yangi',note:''})
  const [totals,setTotals] = useState({count:0,sum:0,paid:0,debt:0})

  async function fetchItems(){
    const { data, error } = await supabase.from('orders').select('*').order('created_at',{ascending:false})
    if(error) return console.error(error)
    setItems(data||[])
  }

  useEffect(()=>{
    fetchItems()
    requestNotificationPermission()
    const ch = supabase.channel('public:orders')
      .on('postgres_changes',{event:'*',schema:'public',table:'orders'}, ()=>fetchItems())
      .subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[])

  useEffect(()=>{
    let count = items.length, sum=0, paid=0
    for(const it of items){ sum+=num(it.total_price); paid+=num(it.paid_amount) }
    setTotals({count,sum,paid,debt:sum-paid})
  },[items])

  async function addItem(e){
    e.preventDefault()
    const payload = {...form, quantity: parseInt(form.quantity)||0, total_price: num(form.total_price), paid_amount: num(form.paid_amount)}
    const { error } = await supabase.from('orders').insert(payload)
    if(error) return alert(error.message)
    setForm({client_name:'',client_phone:'',product:'',quantity:'',total_price:'',paid_amount:'',status:'yangi',note:''})
  }

  async function remove(id){ if(!confirm("O'chirishni tasdiqlaysizmi?")) return; const { error } = await supabase.from('orders').delete().eq('id', id); if(error) alert(error.message); else fetchItems() }

  return (
    <div>
      <div className="card">
        <h3>Buyurtma qo'shish</h3>
        <form className="form-row" onSubmit={addItem}>
          <input placeholder="Mijoz ismi" value={form.client_name} onChange={e=>setForm({...form,client_name:e.target.value})} required />
          <input placeholder="Telefon" value={form.client_phone} onChange={e=>setForm({...form,client_phone:e.target.value})} />
          <input placeholder="Mahsulot" value={form.product} onChange={e=>setForm({...form,product:e.target.value})} />
          <input placeholder="Miqdor" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
          <input placeholder="Jami summa (so'm)" type="number" value={form.total_price} onChange={e=>setForm({...form,total_price:e.target.value})} />
          <input placeholder="To'langan (so'm)" type="number" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})} />
          <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
            <option value="yangi">Yangi</option>
            <option value="jarayon">Jarayonda</option>
            <option value="tugallangan">Tugallangan</option>
          </select>
          <input placeholder="Izoh" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
          <button className="btn primary" type="submit">Qo'shish</button>
        </form>
      </div>

      <div className="card">
        <h3>Zakazlar</h3>
        <div className="grid">
          {items.map(it=>(
            <div className="card" key={it.id}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <strong>{it.product}</strong>
                <span className="badge">{it.status}</span>
              </div>
              <div className="kv">
                <strong>Mijoz:</strong><div>{it.client_name} — {it.client_phone}</div>
                <strong>Miqdor:</strong><div>{fmt(it.quantity)}</div>
                <strong>Jami:</strong><div>{fmt(it.total_price)} so'm</div>
                <strong>To'langan:</strong><div>{fmt(it.paid_amount)} so'm</div>
                <strong>Izoh:</strong><div>{it.note||'-'}</div>
                <strong>Sana:</strong><div>{new Date(it.created_at).toLocaleString()||'-'}</div>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8}}>
                <button className="btn" onClick={()=>{ if(confirm('O\'chirishni tasdiqlaysizmi?')){ supabase.from('orders').delete().eq('id',it.id).then(()=>fetchItems()) } }}>O'chirish</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:12,display:'flex',gap:12}}>
          <div className="card"><strong>Jami zakazlar</strong><div style={{fontWeight:700}}>{fmt(totals.count)}</div></div>
          <div className="card"><strong>Jami summa</strong><div style={{fontWeight:700}}>{fmt(totals.sum)} so'm</div></div>
          <div className="card"><strong>Jami to'langan</strong><div style={{fontWeight:700}}>{fmt(totals.paid)} so'm</div></div>
          <div className="card"><strong>Jami qarzdorlik</strong><div style={{fontWeight:700}}>{fmt(totals.debt)} so'm</div></div>
        </div>
      </div>
    </div>
  )
}