import React, {useState} from 'react'
import AdminPanel from './AdminPanel'
import { useNavigate } from 'react-router-dom'

export default function AdminPage(){
  const [authorized, setAuthorized] = useState(false)
  const [pass, setPass] = useState('')
  const navigate = useNavigate()

  function handleLogin(e){
    e.preventDefault()
    const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || ''
    if(pass && ADMIN_PASS && pass === ADMIN_PASS){ setAuthorized(true) } 
    else alert('Parol noto\'g\'ri yoki sozlanmagan')
  }

  if(!authorized){
    return (
      <div className="container" style={{paddingTop:40}}>
        <div className="card" style={{maxWidth:420, margin:'60px auto'}}>
          <h2>Admin</h2>
          <form onSubmit={handleLogin} className="form-row">
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Parol" />
            <div style={{display:'flex',gap:8}}>
              <button className="btn primary" type="submit">Kirish</button>
              <button className="btn" type="button" onClick={()=>navigate('/')}>Ortga</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return <AdminPanel onLogout={()=>{ setAuthorized(false); navigate('/') }} />
}