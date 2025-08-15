import React from 'react'

export default function Navbar({view,setView}){
  return (
    <header className="header">
      <div className="nav container">
        <div className="brand">
          <div className="logo"></div>
          <div>Mebel Dashboard</div>
        </div>
        <div className="tabs">
          <button className={`tab ${view==='home'?'active':''}`} onClick={()=>setView('home')}>Bosh sahifa</button>
          <button className={`tab ${view==='products'?'active':''}`} onClick={()=>setView('products')}>Tovarlar</button>
          <button className={`tab ${view==='orders'?'active':''}`} onClick={()=>setView('orders')}>Zakazlar</button>
          <button className={`tab ${view==='clients'?'active':''}`} onClick={()=>setView('clients')}>Mijozlar</button>
          <button className={`tab ${view==='custom'?'active':''}`} onClick={()=>setView('custom')}>Yangi bo'lim</button>
        </div>
        <a className="btn" href="/admin">Admin</a>
      </div>
    </header>
  )
}