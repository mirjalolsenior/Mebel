import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Products from './components/Products'
import Orders from './components/Orders'
import Clients from './components/Clients'
import CustomSection from './components/CustomSection'

export default function App(){
  const [view, setView] = useState('home')
  return (
    <div>
      <Navbar setView={setView} view={view} />
      {view === 'home' && <Landing onGetStarted={()=>setView('products')} />}
      <main className="container" style={{paddingTop:16}}>
        {view === 'products' && <Products />}
        {view === 'orders' && <Orders />}
        {view === 'clients' && <Clients />}
        {view === 'custom' && <CustomSection />}
      </main>
      <footer className="footer">© {new Date().getFullYear()} Mebel Dashboard — Deluxe</footer>
    </div>
  )
}