import React, {useState} from 'react'
import AdminPanel from './AdminPanel'
export default function AdminPage(){
  const [authorized,setAuthorized] = useState(false)
  const [pass,setPass] = useState('')
  function login(e){ e.preventDefault(); const ADMIN=import.meta.env.VITE_ADMIN_PASSWORD||''; if(ADMIN && pass===ADMIN) setAuthorized(true); else alert('Parol noto\'g\'ri') }
  if(!authorized) return (<div className="container" style={{paddingTop:40}}><div className="card" style={{maxWidth:420,margin:'60px auto'}}><h2>Admin</h2><form className="form-grid" onSubmit={login}><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Parol" /><div><button className="btn primary" type="submit">Kirish</button></div></form></div></div>)
  return <AdminPanel onLogout={()=>setAuthorized(false)} />
}