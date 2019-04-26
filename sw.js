/*create variables for cache*/
const cacheName = "v1";
/*Array with all the pages necessary to cache*/
//Normaly, it everything went well and it does not appear at
//cache storage is because there is an error in the array.
//check if the name of the file and the path is correct!
const cacheAssets = [
  "/index.html",
  "/restaurant.html",
  "/css/styles.css",
  "/js/main.js",
  "/js/dbhelper.js",
  "/js/restaurant_info.js",
  "/data/restaurants.json",
  "/img/1.jpg",
  "/img/2.jpg",
  "/img/3.jpg",
  "/img/4.jpg",
  "/img/5.jpg",
  "/img/6.jpg",
  "/img/7.jpg",
  "/img/8.jpg",
  "/img/9.jpg",
  "/img/10.jpg"
];

//Call Install Event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  //just tells the browser to wait until our promise is finished.
  event.waitUntil(
    //calling the cache API
    caches
      .open(cacheName)
      .then(cache => {
        console.log("Service Worker: Caching Files");
        //put the caches that you want to assets
        cache.addAll(cacheAssets);
      })
      /*if something is done, then we can skip the waiting*/
      .then(()=> self.skipWaiting())
  );
});

//Call Activate Event
//We will also remove unwanted cache!
self.addEventListener("activate", (event) => {
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
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching");
  event.respondWith(
    //event.request get the initial request
    //it is a promise and if it fail,call the catch that look
    //if we can load the data from the cache.
    fetch(event.request).catch(() => caches.match(event.request))
  )
});
