/*create variables for cache*/
const cacheName = "v1";
/*Array with all the pages necessary to cache*/
//Normaly, it everything went well and it does not appear at
//cache storage is because there is an error in the array.
//check if the name of the file and the path is correct! 
const cacheAssets = [
   "/",
  "/index.html",
  "/restaurant.html",
  "/css/styles.css"
  // "js/main.js",
  // "js/dhhelper.js",
  // "js/restaurant_info.js",
  // "data/restaurants.json"
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
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
})
