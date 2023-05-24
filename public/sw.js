// const staticCacheName = 'site-static-v4';
// const dynamicCacheName = 'site-dynamic-v4';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html'
];

// // cache size limit function
// const limitCacheSize = (name, size) => {
//   caches.open(name).then(cache => {
//     cache.keys().then(keys => {
//       if(keys.length > size){
//         cache.delete(keys[0]).then(limitCacheSize(name, size));
//       }
//     });
//   });
// };

self.addEventListener('install', async event => {
  event.waitUntil(
      caches.open('static-spotify').then((cache) => {
          cache.addAll(assets)
      })
  )    
});

async function cacheData(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const cache = await caches.open('dynamic-meme');

  try {
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
  } catch (error){
      return await cache.match(request);

  }
}

self.addEventListener('fetch', event => {
  const {request} = event;
  const url = new URL(request.url);
  if(url.origin === location.origin) {
      event.respondWith(cacheData(request));
  } else {
      event.respondWith(networkFirst(request));
  }

});

// // install event
// self.addEventListener('install', evt => {
//   //console.log('service worker installed');
//   evt.waitUntil(
//     caches.open(staticCacheName).then((cache) => {
//       console.log('caching shell assets');
//       cache.addAll(assets);
//     })
//   );
// });

// // activate event
// self.addEventListener('activate', evt => {
//   //console.log('service worker activated');
//   evt.waitUntil(
//     caches.keys().then(keys => {
//       //console.log(keys);
//       return Promise.all(keys
//         .filter(key => key !== staticCacheName && key !== dynamicCacheName)
//         .map(key => caches.delete(key))
//       );
//     })
//   );
// });

// // fetch events
// self.addEventListener('fetch', evt => {
//   if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
//     evt.respondWith(
//       caches.match(evt.request).then(cacheRes => {
//         return cacheRes || fetch(evt.request).then(fetchRes => {
//           return caches.open(dynamicCacheName).then(cache => {
//             cache.put(evt.request.url, fetchRes.clone());
//             // check cached items size
//             limitCacheSize(dynamicCacheName, 15);
//             return fetchRes;
//           })
//         });
//       }).catch(() => {
//         if(evt.request.url.indexOf('.html') > -1){
//           return caches.match('/pages/fallback.html');
//         } 
//       })
//     );
//   }
// });