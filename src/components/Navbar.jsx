import React from 'react';
export default function Navbar({view,setView}){
  return (
    <header className="header">
      <div className="nav container">
        <div className="brand"><div className="logo"></div><div>Mebel Dashboard</div></div>
        <div className="tabs">
          <button className={`tab ${view==='home'?'active':''}`} onClick={()=>setView('home')}>Bosh sahifa</button>
          <button className={`tab ${view==='products'?'active':''}`} onClick={()=>setView('products')}>Tovarlar</button>
        </div>
        <a className="btn" href="/admin">Admin</a>
      </div>
    </header>
  )
}