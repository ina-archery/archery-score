/* Service worker: lets the app work offline after the first visit.
   VERSION is replaced with a build stamp by tools/release.js. Change it on every release so phones update. */
const VERSION='20261116-2300';
const CACHE='archery-'+VERSION;
const FILES=['./','./index.html','./app.js','./i18n.js','./i18n.zhs.js','./i18n.zht.js','./i18n.ko.js','./i18n.fr.js','./i18n.de.js','./i18n.it.js','./i18n.es.js','./i18n.pt.js','./help.js','./team.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>fetch(f,{cache:'reload'}).then(r=>{if(r.ok)return c.put(f,r)})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('archery-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// cache first (fast, works offline); refresh the cache in the background when online
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  if(new URL(req.url).pathname.endsWith('/announce.json'))return; // announcements are always fetched fresh
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>{
    const net=fetch(req).then(r=>{if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return r}).catch(()=>hit);
    return hit||net;
  }));
});
