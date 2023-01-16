var cacheID = version;

if(!filesToCache){
  const filesToCache = [];
}

// On version update, remove old cached files
self.addEventListener('activate', event => {
  // Remove old caches
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        return keys.map(async (cache) => {
          if(cache !== cacheID) {
            return await caches.delete(cache);
          }
        })
      })()
    )
  })

// Cache static files on install
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(cacheID)
        .then((cache)=> {
          //Cache has been opened succesfully
          return cache.addAll(filesToCache);
        })
    );
});
  
// load cached files on fetch
self.addEventListener('fetch', function(event) {

    event.respondWith(async function() {
  
      try{
        var res = await fetch(event.request);
        var cache = await caches.open(cacheID);
        await cache.put(event.request.url, res.clone());
        return res;
      }
      catch(error){
        return caches.match(event.request);
      }
  
    }());
  
});