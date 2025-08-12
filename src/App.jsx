import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Products from './components/Products'
import Orders from './components/Orders'
import Clients from './components/Clients'
import CustomSection from './components/CustomSection'

export default function App(){
  const [view, setView] = useState('products')
  return (
    <div className="app">
      <Navbar setView={setView} view={view} />
      <main className="container">
        {view === 'products' && <Products />}
        {view === 'orders' && <Orders />}
        {view === 'clients' && <Clients />}
        {view === 'custom' && <CustomSection />}
      </main>
    </div>
  )
}
