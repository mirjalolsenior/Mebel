import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'

export default function Products(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({type:'',model:'',purchase_price:'',paid_amount:'',quantity:'',delivery_date:''})
  const [totals,setTotals] = useState({total_purchase:0,total_paid:0,total_qty:0})
  const [toast,setToast] = useState(null)

  async function fetchItems(){
    const { data, error } = await supabase.from('products').select('*').order('created_at',{ascending:false})
    if(!error) setItems(data)
  }

  useEffect(()=>{ fetchItems()
    const sub = supabase.channel('public:products')
      .on('postgres_changes',{event:'*',schema:'public',table:'products'},()=>fetchItems())
      .subscribe()
    return ()=> supabase.removeChannel(sub)
  },[])

  useEffect(()=>{
    const tp = items.reduce((s,i)=>s+Number(i.purchase_price||0),0)
    const paid = items.reduce((s,i)=>s+Number(i.paid_amount||0),0)
    const qty = items.reduce((s,i)=>s+Number(i.quantity||0),0)
    setTotals({total_purchase:tp,total_paid:paid,total_qty:qty})
  },[items])

  const handleChange = e=> setForm({...form,[e.target.name]:e.target.value})

  async function addItem(e){
    e.preventDefault()
    const payload = {
      type: form.type || '—',
      model: form.model || '',
      purchase_price: Number(form.purchase_price||0),
      paid_amount: Number(form.paid_amount||0),
      quantity: Number(form.quantity||0),
      delivery_date: form.delivery_date || null
    }
    const { error } = await supabase.from('products').insert(payload)
    if(!error){
      setForm({type:'',model:'',purchase_price:'',paid_amount:'',quantity:'',delivery_date:''})
      setToast('Tovar qo\'shildi')
      setTimeout(()=>setToast(null),3000)
    } else {
      alert('Insert error: '+error.message)
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Tovar qo'shish</h3>
        <form onSubmit={addItem}>
          <div className="form-row">
            <input name="type" value={form.type} onChange={handleChange} placeholder="Tovar turi" />
            <input name="model" value={form.model} onChange={handleChange} placeholder="Nomeri/model" />
            <input name="purchase_price" value={form.purchase_price} onChange={handleChange} placeholder="Olingan narx" />
            <input name="paid_amount" value={form.paid_amount} onChange={handleChange} placeholder="Berilgan pul" />
            <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Qolgan miqdor" />
            <input type="date" name="delivery_date" value={form.delivery_date} onChange={handleChange} />
          </div>
          <div style={{marginTop:8}}><button type="submit">Qo'shish</button></div>
        </form>
      </div>

      <div className="card">
        <h3>Tovarlar</h3>
        <table>
          <thead><tr><th>#</th><th>Turi</th><th>Model</th><th>Olingan</th><th>Berilgan</th><th>Qolgan</th><th>Sana</th></tr></thead>
          <tbody>
            {items.map((it, idx)=>(
              <tr key={it.id}>
                <td>{idx+1}</td>
                <td>{it.type}</td>
                <td>{it.model}</td>
                <td>{it.purchase_price}</td>
                <td>{it.paid_amount}</td>
                <td>{it.quantity}</td>
                <td>{it.delivery_date ? new Date(it.delivery_date).toLocaleDateString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals card" style={{marginTop:8}}>
          <div className="card">Jami olingan: {totals.total_purchase} so'm</div>
          <div className="card">Jami berilgan: {totals.total_paid} so'm</div>
          <div className="card">Jami miqdor: {totals.total_qty}</div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
