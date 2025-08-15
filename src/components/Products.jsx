import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { num, fmt, requestNotificationPermission, showNotification } from '../utils/index'

export default function Products(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({type:'',purchase_price:'',paid_amount:'',quantity:'',description:'',size:'',color:'',image_url:''})
  const [totals,setTotals] = useState({qty:0,sum:0,paid:0,debt:0})
  const [toast,setToast] = useState(null)

  async function fetchItems(){
    const { data, error } = await supabase.from('products').select('*').order('created_at',{ascending:false})
    if(error) return console.error(error)
    setItems(data||[])
  }

  useEffect(()=>{
    fetchItems()
    requestNotificationPermission()
    const ch = supabase.channel('public:products')
      .on('postgres_changes',{event:'*',schema:'public',table:'products'}, ()=>fetchItems())
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
    setToast('Qo\'shildi'); setTimeout(()=>setToast(null),1500)
  }

  async function remove(id){ if(!confirm("O'chirishni tasdiqlaysizmi?")) return; const { error } = await supabase.from('products').delete().eq('id', id); if(error) alert(error.message); else fetchItems() }

  return (
    <div>
      <div className="card">
        <h3>Tovar qo'shish</h3>
        <form className="form-row" onSubmit={addItem}>
          <input placeholder="Nomi" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} required />
          <input placeholder="Olingan summa (so'm)" type="number" value={form.purchase_price} onChange={e=>setForm({...form,purchase_price:e.target.value})} />
          <input placeholder="Berilgan (so'm)" type="number" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})} />
          <input placeholder="Miqdor" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
          <input placeholder="Rasm URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
          <input placeholder="O'lcham" value={form.size} onChange={e=>setForm({...form,size:e.target.value})} />
          <input placeholder="Rang" value={form.color} onChange={e=>setForm({...form,color:e.target.value})} />
          <input placeholder="Tavsif" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <button className="btn primary" type="submit">Qo'shish</button>
        </form>
      </div>

      <div className="card">
        <div className="row"><strong>Tovarlar</strong></div>
        <div className="grid">
          {items.map(it=>(
            <div className="card" key={it.id}>
              <div style={{display:'flex',gap:12}}>
                <img src={it.image_url||'/icons/icon-192.png'} alt="" style={{width:80,height:80,objectFit:'cover',borderRadius:8}} />
                <div style={{flex:1}}>
                  <strong style={{fontSize:16}}>{it.type}</strong>
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
              </div>
              <div style={{marginTop:8,display:'flex',justifyContent:'flex-end',gap:8}}>
                <button className="btn" onClick={()=>{ navigator.clipboard?.writeText(it.id); alert('ID nusxalandi') }}>ID nusxa</button>
                <button className="btn" onClick={()=>{ if(confirm('O\'chirishni tasdiqlaysizmi?')){ supabase.from('products').delete().eq('id',it.id).then(()=>fetchItems()) } }}>O'chirish</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:12,display:'flex',gap:12,alignItems:'center'}}>
          <div className="card"><strong>Jami miqdor</strong><div style={{fontWeight:700}}>{fmt(totals.qty)}</div></div>
          <div className="card"><strong>Jami summa</strong><div style={{fontWeight:700}}>{fmt(totals.sum)} so'm</div></div>
          <div className="card"><strong>Jami to'langan</strong><div style={{fontWeight:700}}>{fmt(totals.paid)} so'm</div></div>
          <div className="card"><strong>Jami qarzdorlik</strong><div style={{fontWeight:700}}>{fmt(totals.debt)} so'm</div></div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}