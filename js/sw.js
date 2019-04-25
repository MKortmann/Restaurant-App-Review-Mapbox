//Call Install Event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
})

//Call Activate Event
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
})
