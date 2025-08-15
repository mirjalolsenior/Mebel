import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { fmt } from '../utils'

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

  useEffect(()=>{ fetchAll() }, [])

  async function remove(table, id){
    if(!confirm("O'chirishni tasdiqlaysizmi?")) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if(error) alert(error.message); else fetchAll()
  }

  return (
    <div className="container" style={{paddingTop:20}}>
      <div className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Admin panel</h2>
        <button className="btn" onClick={onLogout}>Chiqish</button>
      </div>

      <div className="card"><h3>Tovarlar</h3></div>
      <div className="grid">
        {products.map(p=>(
          <div className="card" key={p.id}>
            <div className="row"><strong>{p.type}</strong><button className="btn danger" onClick={()=>remove('products', p.id)}>O'chirish</button></div>
            <div className="kv">
              <strong>Olingan:</strong><div>{fmt(p.purchase_price)} so'm</div>
              <strong>Berilgan:</strong><div>{fmt(p.paid_amount)} so'm</div>
              <strong>Miqdor:</strong><div>{fmt(p.quantity)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card"><h3>Zakazlar</h3></div>
      <div className="grid">
        {orders.map(o=>(
          <div className="card" key={o.id}>
            <div className="row"><strong>{o.product_type}</strong><button className="btn danger" onClick={()=>remove('orders', o.id)}>O'chirish</button></div>
            <div className="kv">
              <strong>Miqdor:</strong><div>{fmt(o.quantity)}</div>
              <strong>Berilgan:</strong><div>{fmt(o.paid_amount)} so'm</div>
              <strong>Qolgan:</strong><div>{fmt(o.remaining_amount)} so'm</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card"><h3>Mijozlar</h3></div>
      <div className="grid">
        {clients.map(c=>(
          <div className="card" key={c.id}>
            <div className="row"><strong>{c.name}</strong><button className="btn danger" onClick={()=>remove('clients', c.id)}>O'chirish</button></div>
            <div className="kv">
              <strong>Olib kelgan:</strong><div>{fmt(c.brought_quantity)}</div>
              <strong>Lenta:</strong><div>{fmt(c.tape_used)}</div>
              <strong>Berilgan:</strong><div>{fmt(c.paid_amount)} so'm</div>
              <strong>Qolgan:</strong><div>{fmt(c.remaining_amount)} so'm</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card"><h3>Custom</h3></div>
      <div className="grid">
        {customs.map(c=>(
          <div className="card" key={c.id}>
            <div className="row"><strong>{c.name}</strong><button className="btn danger" onClick={()=>remove('custom_section', c.id)}>O'chirish</button></div>
            <div className="kv">
              <strong>Olib kelgan:</strong><div>{fmt(c.brought_quantity)}</div>
              <strong>Lenta:</strong><div>{fmt(c.tape_used)}</div>
              <strong>Berilgan:</strong><div>{fmt(c.paid_amount)} so'm</div>
              <strong>Qolgan:</strong><div>{fmt(c.remaining_amount)} so'm</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}