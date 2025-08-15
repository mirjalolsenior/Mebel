export function num(v){ const n = Number(v); return Number.isFinite(n) ? n : 0 }
export function fmt(n){ return new Intl.NumberFormat('uz-UZ').format(Number(n)||0) }

export async function requestNotificationPermission(){
  if(!('Notification' in window)) return 'denied';
  return Notification.requestPermission();
}

export function showNotification(title, options = {}){
  if(!('Notification' in window)) return;
  if(Notification.permission === 'granted'){
    navigator.serviceWorker?.getRegistration().then(reg=>{
      if(reg?.showNotification) reg.showNotification(title, options);
      else new Notification(title, options);
    }).catch(()=>{ try{ new Notification(title, options) }catch(e){} });
  }
}