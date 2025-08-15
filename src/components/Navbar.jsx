import React from 'react'
export default function Navbar({view,setView}){
  return (
    <header className="header">
      <div className="nav container">
        <div className="brand"><div className="logo" /> <div>Mebel</div></div>
        <div className="tabs">
          <button className={`tab ${view==='products'?'active':''}`} onClick={()=>setView('products')}>Tovarlar</button>
          <button className={`tab ${view==='orders'?'active':''}`} onClick={()=>setView('orders')}>Zakazlar</button>
          <button className={`tab ${view==='loyal'?'active':''}`} onClick={()=>setView('loyal')}>Doimiy mijozlar</button>
          <button className={`tab ${view==='clients'?'active':''}`} onClick={()=>setView('clients')}>Mijozlar</button>
        </div>
        <a className="btn" href="/admin">Admin</a>
      </div>
    </header>
  )
}