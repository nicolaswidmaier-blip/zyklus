// Offline cache: the whole app is stored on the phone after the first visit.
const CACHE='zyklus-v1';
const FILES=['./','index.html','manifest.webmanifest','icons/icon.svg','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png',
 'fonts/bricolage-grotesque-latin-500-normal.woff2','fonts/bricolage-grotesque-latin-700-normal.woff2',
 'fonts/atkinson-hyperlegible-latin-400-normal.woff2','fonts/atkinson-hyperlegible-latin-700-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // network first for the page itself (so updates arrive), cache first for everything else
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return r}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
