import React, {useState} from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Products from './components/Products';

export default function App(){
  const [view, setView] = useState('home');
  return (
    <div>
      <Navbar view={view} setView={setView} />
      {view === 'home' && <Landing onGetStarted={()=>setView('products')} />}
      <main className="container" style={{paddingTop:16}}>
        {view === 'products' && <Products />}
      </main>
    </div>
  );
}