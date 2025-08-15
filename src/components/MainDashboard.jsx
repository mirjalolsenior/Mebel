import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { fmt, num } from '../utils/index'

export default function MainDashboard(){
  const [totals, setTotals] = useState({prod_count:0, prod_sum:0, prod_paid:0, prod_debt:0, orders_count:0, orders_sum:0, clients_count:0})

  async function fetchAll(){
    const [{ data:products }, { data:orders }, { data:clients }] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('orders').select('*'),
      supabase.from('clients').select('*')
    ])
    let prod_count = (products||[]).reduce((s,p)=>s+num(p.quantity),0)
    let prod_sum = (products||[]).reduce((s,p)=>s+num(p.purchase_price),0)
    let prod_paid = (products||[]).reduce((s,p)=>s+num(p.paid_amount),0)
    let prod_debt = prod_sum - prod_paid
    let orders_count = (orders||[]).length
    let orders_sum = (orders||[]).reduce((s,o)=>s+num(o.paid_amount),0)
    let clients_count = (clients||[]).length
    setTotals({prod_count, prod_sum, prod_paid, prod_debt, orders_count, orders_sum, clients_count})
  }

  useEffect(()=>{ fetchAll() }, [])

  return (
    <div>
      <div className="card" style={{display:'flex',gap:16,alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <h2>Asosiy</h2>
          <p className="lead">Umumiy statistika</p>
        </div>
        <div style={{display:'flex',gap:12}}>
          <div className="card" style={{minWidth:160}}><strong>Omborda (dona)</strong><div style={{fontSize:20,fontWeight:700}}>{fmt(totals.prod_count)}</div></div>
          <div className="card" style={{minWidth:160}}><strong>Jami summa</strong><div style={{fontSize:20,fontWeight:700}}>{fmt(totals.prod_sum)} so'm</div></div>
          <div className="card" style={{minWidth:160}}><strong>To'langan</strong><div style={{fontSize:20,fontWeight:700}}>{fmt(totals.prod_paid)} so'm</div></div>
          <div className="card" style={{minWidth:160}}><strong>Qarzdorlik</strong><div style={{fontSize:20,fontWeight:700}}>{fmt(totals.prod_debt)} so'm</div></div>
        </div>
      </div>
    </div>
  )
}