import React from 'react';
export default function Landing({onGetStarted}){
  return (
    <section className="hero">
      <div className="container wrap">
        <div>
          <h1 className="h1">Tez, zamonaviy va jozibador mebel hisoboti</h1>
          <p className="lead">Realtime, PWA va bildirishnomalar bilan ishlaydi.</p>
          <div style={{display:'flex', gap:10}}>
            <button className="btn primary" onClick={onGetStarted}>Boshlash</button>
            <a className="btn" href="/admin">Admin panel</a>
          </div>
        </div>
      </div>
    </section>
  )
}