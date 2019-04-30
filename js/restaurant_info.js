"use strict";
/**Support file to the restaurant.html*/
/*Here we declare variables/functions already that are being used below*/
let restaurant, initMap, fetchRestaurantFromURL, fillRestaurantHTML,
getParameterByName, fillRestaurantHoursHTML, fillReviewsHTML, createReviewHTML,
fillBreadcrumb;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();

  window.addEventListener("keydown", function(event) {
    if(window.document.activeElement.id == "map")
    {
      if([32, 37, 38, 39, 40].indexOf(event.keyCode) >= 0) {
          console.log(event.keyCode);
          event.preventDefault();
      }
    } else {
      console.log("comparison is false");
    }
  });

});
/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else { // this 'map' MAKES the connection between the DOM id="map" with
            //the map
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoibXZtcyIsImEiOiJjanVteHFybWgwdXo2NDNzOHRwcnNkN2JtIn0.SMPiuoeVXC2D3pesZn29lQ',
        maxZoom: 18,
        attribution: '',
        id: 'mapbox.streets'
      }).addTo(newMap);
      document.querySelector(".leaflet-control-attribution").innerHTML = "";
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);

      document.querySelector(".leaflet-interactive").tabIndex = -1;

    }
  });
}
/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    //with the correct restaurant id, it is ready to load the necessary infos.
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}
/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}
/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  const tbody = document.createElement("tbody");
  for (let key in operatingHours) {

    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);
    tbody.appendChild(row);
  }
    hours.appendChild(tbody);
}
/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}
/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('h2');
  name.innerHTML = review.name;
  const span = document.createElement("span");


  li.appendChild(span);
  span.appendChild(name);

  let  imgStar = 0;
  for(let i=0; i<review.rating; i++)
  {
    imgStar = document.createElement("img");

    imgStar.src = "./img/Star.png";
    imgStar.alt = "star";
    imgStar.setAttribute("class", "cStar");
    imgStar.setAttribute("style", "float: right");
    span.appendChild(imgStar);
  }

  li.appendChild(span);

  const span2 = document.createElement("span");
  const dateAndRating = document.createElement('h3');

  // dateAndRating.innerHTML = review.date + " - " +`Rating: ${review.rating}`;
  dateAndRating.innerHTML = review.date;
  span2.appendChild(dateAndRating);
  // span2.appendChild(dateAndRating);

  // let  imgStar = 0;
  // for(let i=0; i<review.rating; i++)
  // {
  //   imgStar = document.createElement("img");
  //
  //   imgStar.src = "./img/star.svg";
  //   imgStar.alt = "star";
  //   imgStar.setAttribute("class", "cStars");
  //   span.appendChild(imgStar);
  // }
  li.appendChild(span2);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}
/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
}
/**
 * Get a parameter by name from page URL. Standard function COPIED FROM INTERNET!
 *1: The definition of a   getParameterByName function, receive need to query
 * parameters of key, and then return to the parameters of value
 */
getParameterByName = (name, url) => {
  if (!url)
    //get the actual browse address
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
    //it returns the number of the id respected with the restaurant, for example:
    //if the URL is: http://localhost:8000/restaurant.html?id=3
    //it returns 3.
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// /*Some Interactive Functions: very important for the interaction*/
//   window.addEventListener("load", function() {
//   newMap.once('focus', function() {
//
//     window.addEventListener("keydown", function(e) {
//     // space and arrow keys
//     if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
//         e.preventDefault();
//     }
// }, false);


// /*Important function because I did not find any function in Leaflet map
// to check when the map is not in focus. The problem is if the map is not
// in focus, we have to have sure that the arrow key down still work!*/
// function removeKeys(event) {
//   if(window.document.activeElement.id == "map")
//   {
//     if([32, 37, 38, 39, 40].indexOf(event.keyCode) >= 0) {
//         console.log(event.keyCode);
//         event.preventDefault();
//     }
//   } else {
//     console.log("comparison is false");
//   }
// }
// /*Some Interactive Functions: very important for the interaction*/
//   window.addEventListener("load", function() {
//
//     newMap.once('focus', function() {
//       window.addEventListener("keydown", removeKeys);
//
//     });
//   });
