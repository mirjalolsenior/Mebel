import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { num, fmt } from '../utils'

export default function CustomSection(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({name:'',brought_quantity:'',tape_used:'',paid_amount:'',remaining_amount:''})
  const [totals,setTotals] = useState({paid:0,remaining:0})
  const [toast,setToast] = useState(null)

  async function fetchItems(){
    const { data, error } = await supabase.from('custom_section').select('*').order('created_at',{ascending:false})
    if(error) return console.error(error)
    setItems(data || [])
  }

  useEffect(()=>{
    fetchItems()
    const ch = supabase.channel('public:custom_section')
      .on('postgres_changes', {event:'*', schema:'public', table:'custom_section'}, fetchItems)
      .subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  }, [])

  useEffect(()=>{
    let paid=0, remaining=0
    for(const it of items){ paid += num(it.paid_amount); remaining += num(it.remaining_amount) }
    setTotals({paid, remaining})
  }, [items])

  async function addItem(e){
    e.preventDefault()
    const payload = {
      name: form.name?.trim(),
      brought_quantity: num(form.brought_quantity),
      tape_used: num(form.tape_used),
      paid_amount: num(form.paid_amount),
      remaining_amount: num(form.remaining_amount),
    }
    const { error } = await supabase.from('custom_section').insert(payload)
    if(error) return alert(error.message)
    setForm({name:'',brought_quantity:'',tape_used:'',paid_amount:'',remaining_amount:''})
    setToast("Qo'shildi"); setTimeout(()=>setToast(null), 1500)
  }

  async function remove(id){
    if(!confirm("O'chirishni tasdiqlaysizmi?")) return
    const { error } = await supabase.from('custom_section').delete().eq('id', id)
    if(error) alert(error.message)
  }

  return (
    <div>
      <div className="card">
        <form className="form-row" onSubmit={addItem}>
          <input placeholder="Nomi" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <input placeholder="Olib kelgan miqdor" type="number" value={form.brought_quantity} onChange={e=>setForm({...form,brought_quantity:e.target.value})} />
          <input placeholder="Lenta" type="number" value={form.tape_used} onChange={e=>setForm({...form,tape_used:e.target.value})} />
          <input placeholder="Berilgan (so'm)" type="number" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})} />
          <input placeholder="Qolgan (so'm)" type="number" value={form.remaining_amount} onChange={e=>setForm({...form,remaining_amount:e.target.value})} />
          <button className="btn primary" type="submit">Qo'shish</button>
        </form>
      </div>

      <div className="card">
        <div className="row">
          <div className="badge">Jami to'langan: {fmt(totals.paid)} so'm</div>
          <div className="badge">Jami qolgan: {fmt(totals.remaining)} so'm</div>
        </div>
      </div>

      <div className="grid">
        {items.map((it)=>(
          <div className="card" key={it.id}>
            <div className="row">
              <strong>{it.name}</strong>
              <button className="btn danger" onClick={()=>remove(it.id)}>O'chirish</button>
            </div>
            <div className="kv">
              <strong>Olib kelgan:</strong><div>{fmt(it.brought_quantity)}</div>
              <strong>Lenta:</strong><div>{fmt(it.tape_used)}</div>
              <strong>Berilgan:</strong><div>{fmt(it.paid_amount)} so'm</div>
              <strong>Qolgan:</strong><div>{fmt(it.remaining_amount)} so'm</div>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}