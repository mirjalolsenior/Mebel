import React, { useState } from 'react'
import Navbar from './components/Navbar'
import MainDashboard from './components/MainDashboard'
import Products from './components/Products'
import Orders from './components/Orders'
import LoyalClients from './components/LoyalClients'
import Clients from './components/Clients'

export default function App(){
  const [view, setView] = useState('products') // default to Tovarlar as you wanted
  return (
    <div>
      <Navbar view={view} setView={setView} />
      <main className="container" style={{paddingTop:16}}>
        {view === 'main' && <MainDashboard />}
        {view === 'products' && <Products />}
        {view === 'orders' && <Orders />}
        {view === 'loyal' && <LoyalClients />}
        {view === 'clients' && <Clients />}
      </main>
    </div>
  )
}