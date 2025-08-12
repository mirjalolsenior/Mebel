import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({view,setView}){
  return (
    <header className="nav">
      <button className={view==='products'?'active':''} onClick={()=>setView('products')}>Bosh sahifa</button>
      <button className={view==='orders'?'active':''} onClick={()=>setView('orders')}>Zakazlar</button>
      <button className={view==='clients'?'active':''} onClick={()=>setView('clients')}>Mijozlar</button>
      <button className={view==='custom'?'active':''} onClick={()=>setView('custom')}>Yangi bo'lim</button>
      <Link to="/admin" className="admin-link">Admin</Link>
    </header>
  )
}
