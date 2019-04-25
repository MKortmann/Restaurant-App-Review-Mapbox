let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

/*
 * The ServiceWork occurs in 3 steps
 * 1- register: this tells the browser where your service Worker
 * JavaScript file lives.

/*
You can call register() every time a page loads without concern;
the browser will figure out if the service worker is already registered or not
and handle it accordingly.
*/

/*
 * 2- install: at this point you define a callback for the install event and
 * decide which files you want to cache.
 So, inside our install callback, we define:
  A- Open a cache.
  B- Cache our files.
  C- Confirm whether all the required assets are cached or not.
 * 3- activate
*/

//Is ServiceWork supported? If yes, let's register.

if("serviceWorker" in navigator) {
  console.log("ServiceWorker is supported");
  //callback function ES6
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("js/sw.js")
      .then(reg => console.log("Service Worker Registered"))
      //something went wrong?
      .catch(err => console.log(`Service Worker: Erro: ${err}`));
  });
}


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

/* Important: unlesse set elsewhere, the value of self
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
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  //it will call two functions to reset and update the index HTML page
  updateRestaurants();
}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 * You see that it is using arrow functions!
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
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
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
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  element_div.append(more)

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

}
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */
