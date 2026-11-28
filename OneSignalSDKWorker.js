importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
// Pastille rouge sur l'icône de l'appli : nombre de nouveautés non lues.
// Elle est mémorisée ici et remise en place quand on balaie ou qu'on ouvre une notification,
// pour qu'elle ne disparaisse pas tant que les nouveautés n'ont pas été lues dans l'appli.
var CLE = '/c41-pastille';
function lirePastille() {
  return caches.open('c41').then(function (c) { return c.match(CLE); }).then(function (r) { return r ? r.text() : '0'; }).then(function (t) { return Number(t) || 0; }).catch(function () { return 0; });
}
function poserPastille(n) {
  var ecrit = caches.open('c41').then(function (c) { return c.put(CLE, new Response(String(n))); }).catch(function () {});
  try { if (n > 0 && self.navigator.setAppBadge) self.navigator.setAppBadge(n); else if (self.navigator.clearAppBadge) self.navigator.clearAppBadge(); } catch (x) {}
  return ecrit;
}
function remettre() {
  return new Promise(function (ok) { setTimeout(ok, 400); }).then(lirePastille).then(function (n) { if (n > 0) return poserPastille(n); });
}
self.addEventListener('push', function (e) {
  var n = 0;
  try { var d = e.data ? e.data.json() : null; var a = d && d.custom && d.custom.a; n = a ? Number(a.badge) || 0 : 0; } catch (x) {}
  e.waitUntil(n > 0 ? poserPastille(n) : lirePastille().then(function (k) { return poserPastille(k + 1); }));
});
self.addEventListener('notificationclose', function (e) { e.waitUntil(remettre()); });
self.addEventListener('notificationclick', function (e) { e.waitUntil(remettre()); });
self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.c41 === 'badge') e.waitUntil(poserPastille(Number(d.n) || 0));
});
