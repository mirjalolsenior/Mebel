export function requestNotificationPermission() {
  if ("Notification" in window) {
    return Notification.requestPermission();
  }
  return Promise.resolve("denied");
}

export function showNotification(title, options = {}) {
  if ("Notification" in window && Notification.permission === "granted") {
    navigator.serviceWorker?.getRegistration().then(reg => {
      if (reg?.showNotification) reg.showNotification(title, options);
      else new Notification(title, options);
    }).catch(()=>{ try { new Notification(title, options); } catch(e){} });
  }
}