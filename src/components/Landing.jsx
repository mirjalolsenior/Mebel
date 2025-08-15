import React from 'react'
import { motion } from 'framer-motion'

export default function Landing({onGetStarted}){
  return (
    <section className="hero">
      <div className="container wrap">
        <div>
          <motion.h1 className="h1"
            initial={{ opacity:0, y: 20 }}
            animate={{ opacity:1, y: 0 }}
            transition={{ duration:.6 }}>
            Tez, zamonaviy va jozibador mebel hisoboti
          </motion.h1>
          <motion.p className="lead"
            initial={{ opacity:0, y: 20 }}
            animate={{ opacity:1, y: 0, delay:.05 }}
          >
            Tovarlar, zakazlar va mijozlar — barchasi bitta joyda. Realtime yangilanish, PWA, va bildirishnomalar.
          </motion.p>
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} transition={{delay:.1}} style={{display:'flex', gap:10}}>
            <button className="btn primary" onClick={onGetStarted}>Boshlash</button>
            <a className="btn" href="/admin">Admin panel</a>
          </motion.div>
          <div className="notice" style={{marginTop:10}}>Offline ishlaydi. Telefoningizga o‘rnatib, ilova kabi foydalaning.</div>
        </div>
        <motion.div className="heroCard"
          initial={{ opacity:0, scale:.98 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.5 }}
        >
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <div className="card">
              <div className="row"><strong>Umumiy savdo</strong><span className="badge">Realtime</span></div>
              <div style={{fontSize:28, fontWeight:800, marginTop:6}}>—</div>
              <div className="notice">Supabase bilan jonli ma’lumot</div>
            </div>
            <div className="card">
              <div className="row"><strong>Buyurtmalar</strong><span className="badge">Tezkor</span></div>
              <div style={{fontSize:28, fontWeight:800, marginTop:6}}>—</div>
              <div className="notice">Filtr, sort, qidiruv</div>
            </div>
            <div className="card">
              <div className="row"><strong>Ombor</strong><span className="badge">Kardlar</span></div>
              <div style={{fontSize:28, fontWeight:800, marginTop:6}}>—</div>
              <div className="notice">Mobil uchun qulay</div>
            </div>
            <div className="card">
              <div className="row"><strong>PWA</strong><span className="badge">Offline</span></div>
              <div style={{fontSize:28, fontWeight:800, marginTop:6}}>—</div>
              <div className="notice">Ilova sifatida o‘rnating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}