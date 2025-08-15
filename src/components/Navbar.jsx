import React from 'react'
export default function Navbar({view,setView}){
  return (
    <header className="header">
      <div className="nav container">
        <div className="brand"><div className="logo" /> <div className="brandName">Mebel</div></div>
        <div className="tabs">
          <button className={`tab ${view==='products'?'active':''}`} onClick={()=>setView('products')}>Tovarlar</button>
          <button className={`tab ${view==='orders'?'active':''}`} onClick={()=>setView('orders')}>Zakazlar</button>
          <button className={`tab ${view==='loyal'?'active':''}`} onClick={()=>setView('loyal')}>Doimiy mijozlar</button>
          <button className={`tab ${view==='clients'?'active':''}`} onClick={()=>setView('clients')}>Mijozlar</button>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn ghost" title="PWA: install" onClick={()=>{ alert('Telefoningizda "Add to Home Screen" orqali o‘rnating') }}>Install</button>
          <a className="btn" href="/admin">Admin</a>
        </div>
      </div>
    </header>
  )
}