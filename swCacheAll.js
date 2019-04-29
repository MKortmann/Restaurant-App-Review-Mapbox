/*create variables for cache*/
const cacheName = "cacheV2All";

//Call Install Event: we do not to do anything here
self.addEventListener("install", event => {
  console.log("Service Worker: Installed");
  //just tells the browser to wait until our promise is finished.
});

//Call Activate Event
//We will also remove unwanted cache!
self.addEventListener("activate", event => {
  console.log("Service Worker: Activated");
  // Remove unwanted caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        //map is a high order function included in VanillaJavaScript
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("deleting cache: " + cache);
            return caches.delete(cache);
          }
        })
      )
    })
  );
})


//Implement the fetch event to make the content available offline
//*Version 2: THIS IS WHERE THE REAL WORK COMES*/

self.addEventListener("fetch", event => {
  console.log("Service Worker 2: fetching");

  event.respondWith(
    fetch(event.request)
    //basically make a copy of the response that we receive from the
    //server
      .then(res => {
        // Make copy/clone of response, calling the standard method called
        //clone.
        const resClone = res.clone();
        //Open cache
        caches
          .open(cacheName)
          .then(cache => {
            // add the response to the cache
            cache.put(event.request, resClone);
          });
        return res;
        //if error return the response. Offline procedure does here.
      }).catch(err => caches.match(event.request).then(res => res))
  );
});


// self.addEventListener("fetch", (event) => {
//     console.log("Service Worker: Fetching");
//     event.respondWith(
//         caches.match(event.request).then(response => {
//             if (response) {
//                 return response;
//
//             } else {
//                 return fetch(event.request)
//                     .then(response => {
//                         const responseClone = response.clone();
//                         caches.open(cacheName)
//                             .then(cache => {
//                                 cache.put(event.request, responseClone);
//                             })
//                         return response;
//
//                     })
//                     .catch(err => console.error(err));
//             }
//         })
//
//     );
// });
