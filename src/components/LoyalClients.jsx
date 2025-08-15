import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { fmt } from '../utils/index'

export default function LoyalClients(){
  const [items,setItems] = useState([])
  async function fetchItems(){
    const { data, error } = await supabase.from('clients').select('*').eq('is_loyal', true).order('created_at',{ascending:false})
    if(error) return console.error(error)
    setItems(data||[])
  }
  useEffect(()=>{ fetchItems() },[])
  return (
    <div>
      <div className="card"><h3>Doimiy mijozlar</h3></div>
      <div className="grid">
        {items.map(it=>(
          <article className="clientCard" key={it.id}>
            <div style={{display:'flex',justifyContent:'space-between'}}><strong>{it.name}</strong><span className="badge">Doimiy</span></div>
            <div className="kv">
              <strong>Telefon:</strong><div>{it.phone||'-'}</div>
              <strong>Manzil:</strong><div>{it.address||'-'}</div>
              <strong>Email:</strong><div>{it.email||'-'}</div>
              <strong>Izoh:</strong><div>{it.note||'-'}</div>
            </div>
          </article>
        ))}
      </div>
      <div style={{marginTop:12}} className="card"><strong>Jami doimiy mijozlar:</strong> {fmt(items.length)}</div>
    </div>
  )
}