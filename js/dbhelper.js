"use strict";
/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 8000 // Change this to your server port
    //it returns a json file in local host
    return `http://localhost:${port}/data/restaurants.json`;
  }
  /**
  A little about JSON file: it contains an easy format data structure
  and most important: STANDARD! that it is extremely easy to parse and
  consume through internet.
  It is the reason that we are using restaurants.json that is locally
  in our host machine
  */
  /**
   * Fetch all restaurants: static because this function is called only directly
   in this class and NOT ON INSTANCES OF THE CLASS. It is often used to create
   utility functions. It is not instance method.
   */
   /** Callback: you will see all the time HERE. The main reason is:
   Callbacks are a way to make sure certain code doesn’t execute until other code
   has already finished execution.
   https://codeburst.io/javascript-what-the-heck-is-a-callback-aba4da2deced
   */
  static fetchRestaurants(callback) {
    /*create a new xhr object to interact with servers!
    This enables a Web page to update just part of a page without disrupting
    what the user is doing.*/
    let xhr = new XMLHttpRequest();
    /*GET: to retrieve data, DBHelper.DATABASE_URL is the site*/
    xhr.open('GET', DBHelper.DATABASE_URL);
    //onload means handling success: it will read the JSON data from server,
    //extract/prepare/format it and put at variable restaurant.
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        /*the meaning of success varies depending on the HTTP method
        in this case GET: The resource has been fetched and is transmitted in the message body*/
        /*xhr.responseText is the JSON data, when you parse it you will create
        an object json with an array inside a variable called restaurants because
        it get the name of the json file called also restaurants*/
        const json = JSON.parse(xhr.responseText);
        /*restaurants is an array with 10 objects. Each object object has key value
        pairs with all the information about the respective restaurant
        that you can find in the json file.*/
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    /*send method send the request*/
    xhr.send();
  }
  /**
   * Fetch a restaurant by its ID.
   * USED ONLY AT restaurant.html
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    //argument is directly a call back function: (error, restaurants)
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        /**r can be called anyway. it is only a variable that receives
        the id. find will return the array with the first item in an
        array that satisfies this id. In this case it returns the object
        with the correspondent id.restaurant.
        Zum beispiel: results.find(x => x.id == 2)
        It returns: {id: 2, name: "Emily", neighborhood: "Brooklyn",
        photograph: "2.jpg", address: "919 Fulton St, Brooklyn, NY 11238", …}*/
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }
  /*!!!!!!!!!WE DO NOT NEED THE CODE COMMENTED BELOW!!!!!!!*/
  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  // static fetchRestaurantByCuisine(cuisine, callback) {
  //   // Fetch all restaurants  with proper error handling
  //   DBHelper.fetchRestaurants((error, restaurants) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       // Filter restaurants to have only given cuisine. It returns Then type: Asian,
  //       //Pizza, American or Mexican.
  //       //The filter() method creates a new array with all elements that pass
  //       //the test implemented by the provided function. So, diferently of the
  //       //find command, here it returns an array of objects with the respective
  //       //cuisine
  //       const results = restaurants.filter(r => r.cuisine_type == cuisine);
  //       console.log("results: " + results);
  //       callback(null, results);
  //     }
  //   });
  // }
  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  // static fetchRestaurantByNeighborhood(neighborhood, callback) {
  //   // Fetch all restaurants
  //   DBHelper.fetchRestaurants((error, restaurants) => {
  //     if (error) {
  //       callback(error, null);
  //     } else {
  //       // Filter restaurants to have only given neighborhood
  //       const results = restaurants.filter(r => r.neighborhood == neighborhood);
  //       console.log("results neighborhood: " + results);
  //       callback(null, results);
  //     }
  //   });
  // }
  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   * We are, in fact, calling this function all the time instead to fetch only by
   * cuisine or only by neighborhood.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }
  /**
   * Fetch all neighborhoods with proper error handling:
   * FETCH NEIGHBORHOODS AT DOM!!!!
   * UPDATING HERE!!!
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants: v, i can be any thing.
        // could be also x, y.
        /*The map() method creates a new array with the results of calling
        a function for every array element. The map() method calls the provided
        function once for each element in an array, in order.
        */
        //Syntax: array.map(function(currentValue, index, arr), thisValue)
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }
  /**
   * Fetch all cuisines with proper error handling.
   * USED AT THE DOM!!!
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }
  /**
   * Restaurant page URL. Homepage DOM: link the url address:
   * ex.: http://localhost:8000/restaurant.html?id=3
   * to the marker in the map!
   */
  static urlForRestaurant(restaurant) {
    //it returns for example: ./restaurant.html?id=1
    return (`./restaurant.html?id=${restaurant.id}`);
  }
  /**
   * Restaurant image URL. Homepage DOM: images!
   */
  static imageUrlForRestaurant(restaurant) {
    //it returns for example: /img/7.jpg
    return (`/img/${restaurant.photograph}`);
  }
  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      //Each marker will comes with a link!
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  }
}
