import React, {useEffect, useState} from 'react';
import { supabase } from '../supabaseClient';
import { showNotification, requestNotificationPermission } from '../utils/notifications';

export default function Products(){
  const [items,setItems] = useState([]);
  const [form,setForm] = useState({type:'',purchase_price:'',paid_amount:'',quantity:''});
  const [toast,setToast] = useState(null);

  async function fetchItems(){
    const { data, error } = await supabase.from('products').select('*').order('created_at',{ascending:false});
    if(error) return console.error(error);
    setItems(data || []);
  }

  useEffect(()=>{
    fetchItems();
    requestNotificationPermission();
    const ch = supabase.channel('public:products')
      .on('postgres_changes', {event:'INSERT', schema:'public', table:'products'}, (payload)=>{
        fetchItems();
        try{ showNotification("Yangi tovar", { body: payload.new.type + ' — ' + payload.new.quantity + ' dona', icon:'/icons/icon-192.png' }) }catch(e){}
      })
      .subscribe();
    return ()=>{ supabase.removeChannel(ch); }
  },[]);

  async function addItem(e){
    e.preventDefault();
    const payload = {
      type: form.type?.trim(),
      purchase_price: Number(form.purchase_price) || 0,
      paid_amount: Number(form.paid_amount) || 0,
      quantity: parseInt(form.quantity) || 0
    };
    const { error } = await supabase.from('products').insert(payload);
    if(error) return alert(error.message);
    setForm({type:'',purchase_price:'',paid_amount:'',quantity:''});
    setToast('Qo\'shildi'); setTimeout(()=>setToast(null),1500);
  }

  async function remove(id){
    if(!confirm("O'chirishni tasdiqlaysizmi?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if(error) alert(error.message);
    else fetchItems();
  }

  return (
    <div>
      <div className="card">
        <form className="form-row" onSubmit={addItem}>
          <input placeholder="Turi" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} required />
          <input placeholder="Olingan (so'm)" type="number" value={form.purchase_price} onChange={e=>setForm({...form,purchase_price:e.target.value})} required />
          <input placeholder="Berilgan (so'm)" type="number" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})} />
          <input placeholder="Miqdor" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
          <button className="btn primary" type="submit">Qo'shish</button>
        </form>
      </div>
      <div className="grid">
        {items.map(it=>(
          <div className="card" key={it.id}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <strong>{it.type}</strong>
              <button className="btn" onClick={()=>remove(it.id)}>O'chirish</button>
            </div>
            <div className="kv">
              <strong>Olingan:</strong><div>{it.purchase_price} so'm</div>
              <strong>Miqdor:</strong><div>{it.quantity}</div>
            </div>
          </div>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}