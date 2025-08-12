import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'

export default function AdminPanel({onLogout}){
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [clients, setClients] = useState([])
  const [customs, setCustoms] = useState([])

  async function fetchAll(){
    const { data: p } = await supabase.from('products').select('*').order('created_at',{ascending:false})
    const { data: o } = await supabase.from('orders').select('*').order('created_at',{ascending:false})
    const { data: c } = await supabase.from('clients').select('*').order('created_at',{ascending:false})
    const { data: cs } = await supabase.from('custom_section').select('*').order('created_at',{ascending:false})
    setProducts(p||[]); setOrders(o||[]); setClients(c||[]); setCustoms(cs||[])
  }

  useEffect(()=>{ fetchAll()
    const subs = [
      supabase.channel('public:products').on('postgres_changes',{event:'*',schema:'public',table:'products'},()=>fetchAll()).subscribe(),
      supabase.channel('public:orders').on('postgres_changes',{event:'*',schema:'public',table:'orders'},()=>fetchAll()).subscribe(),
      supabase.channel('public:clients').on('postgres_changes',{event:'*',schema:'public',table:'clients'},()=>fetchAll()).subscribe(),
      supabase.channel('public:custom_section').on('postgres_changes',{event:'*',schema:'public',table:'custom_section'},()=>fetchAll()).subscribe()
    ]
    return ()=> subs.forEach(s=>supabase.removeChannel(s))
  },[])

  async function deleteRow(table, id){
    if(!confirm('O\'chirilsinmi?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if(error) alert('Delete error: '+error.message)
    else fetchAll()
  }

  return (
    <div>
      <div className="card">
        <h2>Admin panel</h2>
        <p>Bu yerda barcha jadvallarni ko'rish va o'chirish mumkin.</p>
        <div style={{marginTop:8}}>
          <button onClick={onLogout} className="btn-small">Chiqish</button>
        </div>
      </div>

      <div className="card">
        <h3>Products</h3>
        <table><thead><tr><th>#</th><th>Turi</th><th>Model</th><th>Olingan</th><th>Berilgan</th><th>Qolgan</th><th></th></tr></thead>
        <tbody>{products.map((p, i)=>(<tr key={p.id}><td>{i+1}</td><td>{p.type}</td><td>{p.model}</td><td>{p.purchase_price}</td><td>{p.paid_amount}</td><td>{p.quantity}</td><td><button className="btn-danger" onClick={()=>deleteRow('products', p.id)}>O'chirish</button></td></tr>))}</tbody></table>
      </div>

      <div className="card">
        <h3>Orders</h3>
        <table><thead><tr><th>#</th><th>Turi</th><th>Model</th><th>Oldi</th><th>Berildi</th><th>Qolgan</th><th></th></tr></thead>
        <tbody>{orders.map((o, i)=>(<tr key={o.id}><td>{i+1}</td><td>{o.product_type}</td><td>{o.model}</td><td>{o.quantity}</td><td>{o.paid_amount}</td><td>{o.remaining}</td><td><button className="btn-danger" onClick={()=>deleteRow('orders', o.id)}>O'chirish</button></td></tr>))}</tbody></table>
      </div>

      <div className="card">
        <h3>Clients</h3>
        <table><thead><tr><th>#</th><th>Nomi</th><th>Olib kelgan</th><th>Lenta</th><th>Berilgan</th><th>Qolgan</th><th></th></tr></thead>
        <tbody>{clients.map((c, i)=>(<tr key={c.id}><td>{i+1}</td><td>{c.name}</td><td>{c.brought_quantity}</td><td>{c.tape_used}</td><td>{c.paid_amount}</td><td>{c.remaining_amount}</td><td><button className="btn-danger" onClick={()=>deleteRow('clients', c.id)}>O'chirish</button></td></tr>))}</tbody></table>
      </div>

      <div className="card">
        <h3>Custom Section</h3>
        <table><thead><tr><th>#</th><th>Nomi</th><th>Olib kelgan</th><th>Lenta</th><th>Berilgan</th><th>Qolgan</th><th></th></tr></thead>
        <tbody>{customs.map((c, i)=>(<tr key={c.id}><td>{i+1}</td><td>{c.name}</td><td>{c.brought_quantity}</td><td>{c.tape_used}</td><td>{c.paid_amount}</td><td>{c.remaining_amount}</td><td><button className="btn-danger" onClick={()=>deleteRow('custom_section', c.id)}>O'chirish</button></td></tr>))}</tbody></table>
      </div>
    </div>
  )
}
