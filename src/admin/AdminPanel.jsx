import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { fmt } from '../utils/index'

export default function AdminPanel({onLogout}){
  const [products,setProducts]=useState([])
  const [orders,setOrders]=useState([])
  const [clients,setClients]=useState([])
  async function fetchAll(){
    const { data: p } = await supabase.from('products').select('*').order('created_at',{ascending:false})
    const { data: o } = await supabase.from('orders').select('*').order('created_at',{ascending:false})
    const { data: c } = await supabase.from('clients').select('*').order('created_at',{ascending:false})
    setProducts(p||[]); setOrders(o||[]); setClients(c||[])
  }
  useEffect(()=>{ fetchAll() },[])
  async function del(table,id){ if(!confirm('O\'chirish?')) return; await supabase.from(table).delete().eq('id',id); fetchAll() }
  return (
    <div className="container" style={{paddingTop:20}}>
      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2>Admin panel</h2><div><button className="btn" onClick={onLogout}>Chiqish</button></div></div>
      <div className="card"><h3>Tovarlar</h3></div>
      <div className="grid">{products.map(p=>(<div className="card" key={p.id}><div style={{display:'flex',justifyContent:'space-between'}}><strong>{p.type}</strong><button className="btn" onClick={()=>del('products',p.id)}>O'chirish</button></div><div className="kv"><strong>Narx:</strong><div>{fmt(p.purchase_price)} so'm</div><strong>Miqdor:</strong><div>{fmt(p.quantity)}</div></div></div>))}</div>
      <div className="card"><h3>Zakazlar</h3></div>
      <div className="grid">{orders.map(o=>(<div className="card" key={o.id}><div style={{display:'flex',justifyContent:'space-between'}}><strong>{o.product}</strong><button className="btn" onClick={()=>del('orders',o.id)}>O'chirish</button></div><div className="kv"><strong>Mijoz:</strong><div>{o.client_name}</div><strong>Summa:</strong><div>{fmt(o.total_price)} so'm</div></div></div>))}</div>
      <div className="card"><h3>Mijozlar</h3></div>
      <div className="grid">{clients.map(c=>(<div className="card" key={c.id}><div style={{display:'flex',justifyContent:'space-between'}}><strong>{c.name}</strong><button className="btn" onClick={()=>del('clients',c.id)}>O'chirish</button></div><div className="kv"><strong>Telefon:</strong><div>{c.phone||'-'}</div></div></div>))}</div>
    </div>
  )
}