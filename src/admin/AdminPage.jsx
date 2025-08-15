import React, {useState} from 'react'
import AdminPanel from './AdminPanel'
export default function AdminPage(){
 HEAD
  const [authorized, setAuthorized] = useState(false)
  const [pass, setPass] = useState('')
  const navigate = useNavigate()

  function handleLogin(e){
    e.preventDefault()
    const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'sherzod';
    if(pass === ADMIN_PASS){ setAuthorized(true) } else alert('Parol noto\'g\'ri')
  }

  if(!authorized){
    return (
      <div className="container">
        <div className="card">
          <h3>Admin kirish</h3>
          <form onSubmit={handleLogin}>
            <div className="form-row">
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Parol" />
            </div>
            <div style={{marginTop:8}}>
              <button type="submit">Kirish</button>
              <button type="button" onClick={()=>navigate('/')} style={{marginLeft:8}}>Ortga</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return <AdminPanel onLogout={()=>{ setAuthorized(false); navigate('/') }} />
}

  const [authorized,setAuthorized] = useState(false)
  const [pass,setPass] = useState('')
  function login(e){ e.preventDefault(); const ADMIN=import.meta.env.VITE_ADMIN_PASSWORD||''; if(ADMIN && pass===ADMIN) setAuthorized(true); else alert('Parol noto\'g\'ri') }
  if(!authorized) return (<div className="container" style={{paddingTop:40}}><div className="card" style={{maxWidth:420,margin:'60px auto'}}><h2>Admin</h2><form className="form-grid" onSubmit={login}><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Parol" /><div><button className="btn primary" type="submit">Kirish</button></div></form></div></div>)
  return <AdminPanel onLogout={()=>setAuthorized(false)} />

