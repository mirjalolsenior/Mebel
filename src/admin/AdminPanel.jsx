import React, {useEffect, useState} from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel({onLogout}){
  const [products, setProducts] = useState([]);

  async function fetchAll(){
    const { data: p } = await supabase.from('products').select('*').order('created_at',{ascending:false});
    setProducts(p||[]);
  }
  useEffect(()=>{ fetchAll() }, []);

  async function remove(id){
    if(!confirm("O'chirishni tasdiqlaysizmi?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if(error) alert(error.message); else fetchAll();
  }

  return (
    <div className="container" style={{paddingTop:20}}>
      <div className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Admin panel</h2>
        <button className="btn" onClick={onLogout}>Chiqish</button>
      </div>
      <div className="grid">
        {products.map(p=>(
          <div className="card" key={p.id}>
            <div style={{display:'flex',justifyContent:'space-between'}}><strong>{p.type}</strong><button className="btn" onClick={()=>remove(p.id)}>O'chirish</button></div>
            <div className="kv">
              <strong>Olingan:</strong><div>{p.purchase_price} so'm</div>
              <strong>Miqdor:</strong><div>{p.quantity}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}