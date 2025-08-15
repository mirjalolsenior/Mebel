import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { fmt } from '../utils/index'

export default function Clients(){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({name:'',phone:'',address:'',email:'',note:'',is_loyal:false})

  async function fetchItems(){
    const { data, error } = await supabase.from('clients').select('*').order('created_at',{ascending:false})
    if(error) return console.error(error)
    setItems(data||[])
  }

  useEffect(()=>{ fetchItems() },[])

  async function addItem(e){
    e.preventDefault()
    const { error } = await supabase.from('clients').insert(form)
    if(error) return alert(error.message)
    setForm({name:'',phone:'',address:'',email:'',note:'',is_loyal:false})
  }

  async function remove(id){ if(!confirm("O'chirishni tasdiqlaysizmi?")) return; const { error } = await supabase.from('clients').delete().eq('id', id); if(error) alert(error.message); else fetchItems() }

  return (
    <div>
      <div className="card">
        <h3>Mijoz qo'shish</h3>
        <form className="form-row" onSubmit={addItem}>
          <input placeholder="Ismi" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <input placeholder="Telefon" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          <input placeholder="Manzil" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input placeholder="Izoh" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
          <label style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" checked={form.is_loyal} onChange={e=>setForm({...form,is_loyal:e.target.checked})} /> Doimiy mijoz</label>
          <button className="btn primary" type="submit">Qo'shish</button>
        </form>
      </div>

      <div className="card">
        <h3>Mijozlar</h3>
        <div className="grid">
          {items.map(it=>(
            <div className="card" key={it.id}>
              <div style={{display:'flex',justifyContent:'space-between'}}><strong>{it.name}</strong><span className="badge">{it.is_loyal? 'Doimiy':'-'}</span></div>
              <div className="kv">
                <strong>Telefon:</strong><div>{it.phone||'-'}</div>
                <strong>Manzil:</strong><div>{it.address||'-'}</div>
                <strong>Email:</strong><div>{it.email||'-'}</div>
                <strong>Izoh:</strong><div>{it.note||'-'}</div>
                <strong>Qo'shilgan:</strong><div>{new Date(it.created_at).toLocaleString()||'-'}</div>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8}}>
                <button className="btn" onClick={()=>{ if(confirm('O\'chirishni tasdiqlaysizmi?')){ supabase.from('clients').delete().eq('id',it.id).then(()=>fetchItems()) } }}>O'chirish</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}