var casheVer='app-cache-v786te';
self.addEventListener('install',function(event){
    "use strict";
    event.waitUntil(
        caches.open(casheVer).then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/main.css',
                '/js/main.js'
            ]);
        })
    );
});
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName.startsWith('app-cache-v')){
                        if(cacheName!=casheVer){
                            console.log('Deleting out of date cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    }
                })
            );
        })
    );
});
self.addEventListener('fetch',function(event){
    "use strict";
    console.log(event.request);
    if(event.request.method=="POST"){
       return fetch(event.request);
    }
    caches.match(event.request).then(function(){
        return fetch(event.request).then(function(response){
            return caches.open(casheVer).then(function(cache){
                cache.put(event.request,response.clone());
                return response;
            })
        });
    });
});