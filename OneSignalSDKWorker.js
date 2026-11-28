importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
// Pastille rouge sur l'icône de l'appli : le nombre de nouveautés non lues est envoyé avec chaque notification
self.addEventListener('push', function (e) {
  try {
    var d = e.data ? e.data.json() : null;
    var a = d && d.custom && d.custom.a;
    var n = a ? Number(a.badge) : 0;
    if (n > 0 && self.navigator && self.navigator.setAppBadge) self.navigator.setAppBadge(n);
  } catch (x) {}
});
