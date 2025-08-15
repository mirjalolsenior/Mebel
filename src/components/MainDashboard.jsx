import React, {useEffect, useState} from 'react'
import { supabase } from '../supabaseClient'
import { fmt, num } from '../utils/index'

export default function MainDashboard(){
  const [totals, setTotals] = useState({prod_qty:0,prod_sum:0,prod_paid:0,prod_debt:0,orders_cnt:0,orders_sum:0,clients_cnt:0})

  async function load(){
    const [{ data:products }, { data:orders }, { data:clients }] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('orders').select('*'),
      supabase.from('clients').select('*')
    ])
    const prod_qty = (products||[]).reduce((s,p)=>s+num(p.quantity),0)
    const prod_sum = (products||[]).reduce((s,p)=>s+num(p.purchase_price),0)
    const prod_paid = (products||[]).reduce((s,p)=>s+num(p.paid_amount),0)
    const prod_debt = prod_sum - prod_paid
    const orders_cnt = (orders||[]).length
    const orders_sum = (orders||[]).reduce((s,o)=>s+num(o.total_price),0)
    const clients_cnt = (clients||[]).length
    setTotals({prod_qty,prod_sum,prod_paid,prod_debt,orders_cnt,orders_sum,clients_cnt})
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="card">
      <h2>Asosiy</h2>
      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:12}}>
        <div className="stat"><div className="statLabel">Omborda (dona)</div><div className="statValue">{fmt(totals.prod_qty)}</div></div>
        <div className="stat"><div className="statLabel">Jami summa</div><div className="statValue">{fmt(totals.prod_sum)} so'm</div></div>
        <div className="stat"><div className="statLabel">To'langan</div><div className="statValue">{fmt(totals.prod_paid)} so'm</div></div>
        <div className="stat"><div className="statLabel">Qarzdorlik</div><div className="statValue">{fmt(totals.prod_debt)} so'm</div></div>
        <div className="stat"><div className="statLabel">Zakazlar</div><div className="statValue">{fmt(totals.orders_cnt)}</div></div>
        <div className="stat"><div className="statLabel">Mijozlar</div><div className="statValue">{fmt(totals.clients_cnt)}</div></div>
      </div>
    </div>
  )
}