import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'

export default function Orders(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({product_type:'',model:'',quantity:'',paid_amount:'',delivery_date:''})
  const [totals,setTotals] = useState({total:0,paid:0,remaining:0})
  const [toast,setToast] = useState(null)

  async function fetchItems(){
    const { data, error } = await supabase.from('orders').select('*').order('created_at',{ascending:false})
    if(!error) setItems(data)
  }

  useEffect(()=>{ fetchItems()
    const sub = supabase.channel('public:orders')
      .on('postgres_changes',{event:'*',schema:'public',table:'orders'},()=>fetchItems())
      .subscribe()
    return ()=> supabase.removeChannel(sub)
  },[])

  useEffect(()=>{
    const total = items.reduce((s,i)=>s+Number(i.quantity||0),0)
    const paid = items.reduce((s,i)=>s+Number(i.paid_amount||0),0)
    const rem = items.reduce((s,i)=>s+Number(i.remaining||0),0)
    setTotals({total,paid,remaining:rem})
  },[items])

  const handleChange = e=> setForm({...form,[e.target.name]:e.target.value})

  async function addItem(e){
    e.preventDefault()
    const payload = {
      product_type: form.product_type || '',
      model: form.model || '',
      quantity: Number(form.quantity||0),
      paid_amount: Number(form.paid_amount||0),
      remaining: Number(form.quantity||0) - Number(form.paid_amount||0),
      delivery_date: form.delivery_date || null
    }
    const { error } = await supabase.from('orders').insert(payload)
    if(!error){
      setForm({product_type:'',model:'',quantity:'',paid_amount:'',delivery_date:''})
      setToast('Zakaz qo\'shildi')
      setTimeout(()=>setToast(null),3000)
    } else alert('Insert error: '+error.message)
  }

  return (
    <div>
      <div className="card">
        <h3>Zakaz qo'shish</h3>
        <form onSubmit={addItem}>
          <div className="form-row">
            <input name="product_type" value={form.product_type} onChange={handleChange} placeholder="Tovar turi" />
            <input name="model" value={form.model} onChange={handleChange} placeholder="Raqami/model" />
            <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Qancha oldi" />
            <input name="paid_amount" value={form.paid_amount} onChange={handleChange} placeholder="Qancha berdi" />
            <input type="date" name="delivery_date" value={form.delivery_date} onChange={handleChange} />
          </div>
          <div style={{marginTop:8}}><button type="submit">Qo'shish</button></div>
        </form>
      </div>

      <div className="card">
        <h3>Zakazlar</h3>
        <table>
          <thead><tr><th>#</th><th>Turi</th><th>Raqam</th><th>Oldi</th><th>Berildi</th><th>Qoldi</th><th>Sana</th></tr></thead>
          <tbody>
            {items.map((it, idx)=>(
              <tr key={it.id}>
                <td>{idx+1}</td>
                <td>{it.product_type}</td>
                <td>{it.model}</td>
                <td>{it.quantity}</td>
                <td>{it.paid_amount}</td>
                <td>{it.remaining}</td>
                <td>{it.delivery_date ? new Date(it.delivery_date).toLocaleDateString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals card" style={{marginTop:8}}>
          <div className="card">Jami oldi: {totals.total}</div>
          <div className="card">Jami berildi: {totals.paid}</div>
          <div className="card">Jami qoldi: {totals.remaining}</div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
