export function num(v){ const n = Number(v); return Number.isFinite(n) ? n : 0 }
export function fmt(n){ return new Intl.NumberFormat('uz-UZ').format(Number(n)||0) }

export async function ensureNotificationPermission(){
  if(!('Notification' in window)) return false
  if(Notification.permission === 'granted') return true
  if(Notification.permission !== 'denied'){
    const res = await Notification.requestPermission()
    return res === 'granted'
  }
  return false
}

export async function showOSNotification(title, body){
  try{
    const ok = await ensureNotificationPermission()
    if(!ok) return
    const reg = await navigator.serviceWorker?.getRegistration()
    if(reg?.showNotification){
      reg.showNotification(title, { body, icon:'/icons/icon-192.png', badge:'/icons/icon-192.png' })
    } else {
      new Notification(title, { body }) // fallback
    }
  }catch(e){ /* ignore */ }
}