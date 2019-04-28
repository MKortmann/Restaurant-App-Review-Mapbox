"use strict";
/*Declaring variables and functions that will be used! necessary
because we want to call the function in an easy order making it
easier to understand the code*/
let restaurants, neighborhoods, cuisines, fetchNeighborhoods,
  initMap, fillNeighborhoodsHTML, fetchCuisines, fillCuisinesHTML,
  updateRestaurants, resetRestaurants, fillRestaurantsHTML,
  createRestaurantHTML, addMarkersToMap;
var newMap;
var markers = [];

/*FIRST STEP: declaring the service work!*
/*
 * The ServiceWork occurs in 4 steps
 * 1- register: this tells the browser where your service Worker
 * JavaScript file lives. The register is done in this file:
 * main.js.
/*
You can call register() every time a page loads without concern;
the browser will figure out if the service worker is already registered or not
and handle it accordingly.
*/
/* The below steps of ServiceWork are done in the file sw.js at root folder!
 * 2- install: at this point you define a callback for the install event and
 * decide which files you want to cache.
 So, inside our install callback, we define:
  A- Open a cache.
  B- Cache our files.
  C- Confirm whether all the required assets are cached or not.
 * 3- activate
 A- remove unwanted caches.
 4- Fetch add fetch event to be able to restore the data if you is offline
*/

//First STEP: let's check if is supported and if yes, let's register it!

if("serviceWorker" in navigator) {
  //callback function ES6
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(reg => console.log("Service Worker Registered"))
      //something went wrong?
      .catch(err => console.log(`Service Worker: Erro: ${err}`));
  });
}
/*NOW IMPLEMENT THE HOLE FUNCTIONALITY !
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}
/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}
/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}
/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}
/**
 * Initialize leaflet map, called from HTML.
 */
/* Important: unless set elsewhere, the value of self
 * is window because JavaScript lets you access any
 * property x of window as simple x, instead of
 * window.x. Therefore, self is really window.self
 * which is different to this.
 * window.self === window;
 *
*/
initMap = () => {
  //the line: ('map',...) makes the connection between the map and the DOM id element.
  self.newMap = L.map('map', { //self.newMap === window.newMap
        center: [40.722216, -73.987501], //lat, long
        zoom: 12,
        scrollWheelZoom: true
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoibXZtcyIsImEiOiJjanVteHFybWgwdXo2NDNzOHRwcnNkN2JtIn0.SMPiuoeVXC2D3pesZn29lQ',
    maxZoom: 18,
    // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    //   '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    //   'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);
  /*Because of the accessibility I am removing this controls. We do not need it.*/
  document.querySelector(".leaflet-control-attribution").innerHTML = "";
  //it will call two functions to reset and update the index HTML page
  updateRestaurants();
}
/**
 * Update page and map for current restaurants.
 * You see that it is using arrow functions! ES6!
 * It allows: shorter syntax and NO BINDING OF THIS.
 * It means that this keeps its meaning from its
 * original context
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;
  //after getting the DOM element, it will reset und update the restaurantes.
  //before it get the list of restaurants based on selected DOM values of
  //cuisine and neighborhood.
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      //at this point you have the list of restaurants that you need that is
      //updated at global variable needed for fillRestaurantsHTML
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}
/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';
  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}
/**
 * Create all restaurants HTML and add them to the webpage.
 */
 //the self.restaurants it was the listed updated before. it belongs to the
 //global object in this case: window.
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  //Loop: get all the needs information of the restaurants as
  //image, address, neighborhood and append it to the HTML.
  let updateAriaLabel = document.querySelector("#restaurants-list");
  let index = 0;
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
    index++;
  });
    debugger
  updateAriaLabel.setAttribute("aria-label","The filter results shows " + index + " restaurants");
  addMarkersToMap();
}
/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {

  const element_div = document.createElement('div');
  element_div.className = "box";

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  /*Alt as requested if the image is needed!*/
  image.alt = restaurant.id + ".jpg";
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  element_div.append(image);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  element_div.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  element_div.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  element_div.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details'; // + restaurant.name;
  more.setAttribute("aria-label", "Click here to view more details of the restaurant" + restaurant.name);
  //Not really necessary because of the link a.
  more.setAttribute("tabindex", 0);

  more.href = DBHelper.urlForRestaurant(restaurant);
  element_div.append(more);

  return element_div
}
/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    // Add clickable link to each marker
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

  document.querySelectorAll(".leaflet-interactive").forEach(function(val) {
      val.tabIndex = -1;
      /*Removing it because of the voice to speach, the interaction was also
      removed. It does not make sense.*/
      val.title = "";
      val.alt = "";
    });

}

// /*Waiting the page to load: trying to improve the user experience!*/
// window.addEventListener("load", function() {
// /*disabling the map tabindex for markers! It not make sense to have
// to tab over 10 markers!*/
// // document.querySelectorAll(".leaflet-interactive").forEach(function(val) {
// //     val.tabIndex = -1;
// //   });
// // /*We could disable the map, but in this case better not.*/
// // // document.querySelector("#map").tabIndex = -1;
// // /*Removing tab-index for map label attribution*/
// // document.querySelector(".leaflet-control-attribution").tabIndex = -1;
//
// // /*Change the written below:*/
// // const legend =  "OpenStreetMap, CC-BY-SA, Mapbox, Marcelo Kortmann";
// // document.querySelector(".leaflet-control-attribution").innerHTML = "";
//
// });
