import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'

export default function CustomSection(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({name:'',brought_quantity:'',tape_used:'',paid_amount:'',remaining_amount:''})
  const [totals,setTotals] = useState({paid:0,remaining:0})
  const [toast,setToast] = useState(null)

  async function fetchItems(){
    const { data, error } = await supabase.from('custom_section').select('*').order('created_at',{ascending:false})
    if(!error) setItems(data)
  }

  useEffect(()=>{ fetchItems()
    const sub = supabase.channel('public:custom_section')
      .on('postgres_changes',{event:'*',schema:'public',table:'custom_section'},()=>fetchItems())
      .subscribe()
    return ()=> supabase.removeChannel(sub)
  },[])

  useEffect(()=>{
    const paid = items.reduce((s,i)=>s+Number(i.paid_amount||0),0)
    const rem = items.reduce((s,i)=>s+Number(i.remaining_amount||0),0)
    setTotals({paid,remaining:rem})
  },[items])

  const handleChange = e=> setForm({...form,[e.target.name]:e.target.value})

  async function addItem(e){
    e.preventDefault()
    const payload = {
      name: form.name || '',
      brought_quantity: Number(form.brought_quantity||0),
      tape_used: Number(form.tape_used||0),
      paid_amount: Number(form.paid_amount||0),
      remaining_amount: Number(form.remaining_amount||0)
    }
    const { error } = await supabase.from('custom_section').insert(payload)
    if(!error){
      setForm({name:'',brought_quantity:'',tape_used:'',paid_amount:'',remaining_amount:''})
      setToast('Qo\'shildi')
      setTimeout(()=>setToast(null),3000)
    } else alert('Insert error: '+error.message)
  }

  return (
    <div>
      <div className="card">
        <h3>Yangi bo'lim - Mijoz qo'shish</h3>
        <form onSubmit={addItem}>
          <div className="form-row">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nomi / Mijoz nomi" />
            <input name="brought_quantity" value={form.brought_quantity} onChange={handleChange} placeholder="Olib kelgan tovar" />
            <input name="tape_used" value={form.tape_used} onChange={handleChange} placeholder="Lenta urilgan" />
            <input name="paid_amount" value={form.paid_amount} onChange={handleChange} placeholder="Berilgan pul" />
            <input name="remaining_amount" value={form.remaining_amount} onChange={handleChange} placeholder="Qolgan pul" />
          </div>
          <div style={{marginTop:8}}><button type="submit">Qo'shish</button></div>
        </form>
      </div>

      <div className="card">
        <h3>Yangi bo'lim</h3>
        <table>
          <thead><tr><th>#</th><th>Nomi</th><th>Olib kelgan</th><th>Lenta</th><th>Berilgan</th><th>Qolgan</th></tr></thead>
          <tbody>
            {items.map((it, idx)=>(
              <tr key={it.id}>
                <td>{idx+1}</td>
                <td>{it.name}</td>
                <td>{it.brought_quantity}</td>
                <td>{it.tape_used}</td>
                <td>{it.paid_amount}</td>
                <td>{it.remaining_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals card" style={{marginTop:8}}>
          <div className="card">Jami to'langan: {totals.paid} so'm</div>
          <div className="card">Jami qolgan: {totals.remaining} so'm</div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
