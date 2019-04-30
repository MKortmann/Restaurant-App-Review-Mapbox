# Restaurant Review App

For the **Restaurant Reviews** projects, I incrementally convert a static webpage to a mobile-ready web application. I start from a static design page that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. I added also a service worker to begin the process of creating a seamless offline experience for your users.
This app enclosed many amazing features:

  - Work in many different browsers as _Google Chrome, Edge and Firefox
 
  - **Responsive Design**
  - **Keyboard Focus** allowing easy naviagtion! Implemented **Keyboard Trap** for better user experience. 
    -- tab: move focus forward
    -- shift + tab: move focus backward
    -- arrow keys: move focus within a component
    -- option + tab: in order to change focus in othr browsers like safari.
 - **Web Accessibility** is reenforced here using WAI-ARIA (Accessible Rich Internet Applications). 
    -- You can completely interact with the homepage through voice. Try to use the google Chrome extension
 called **ChromeVox.**
  - **Map** implemented using [leafletjs](https://leafletjs.com/) and [Mapbox](https://www.mapbox.com/).
    Leaflet: it is a open-source JavaScript library for mobile-friendly interactive maps.
    Mapbox: is the location data platform for mobile and web applications. 
  - Packed with **Animations** and **Complete new redesign**
  
## How to start the App?

 Please, install the App using the instructions below.

## What is the app about?

 The app shows a map with many different restaurant in New York City. The user can search the desire restaurants selecting: the cuisine or/and neighborhood. Depending of your filter, it will display a list of restaurants and the specific position of each restaurant in the map.
 
 Clicking in each restaurant it will open a new page that contains more information about the selected restaurant.
 Do not waste any time, install this app and try it!

## Installation

1. First you have to create a directory in the desire location

2. git init
3. git clone <address from git hub> 
- Now, you will need a simple HTTP server. You can use any http server. However, I will show you in the step 4 how to start up a simple HTTP server using python.
4. Starting the http server at port 8000:
* In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.
   * Note -  For Windows systems, Python 3.x is installed as `python` by default. To start a Python 3.x server, you can simply enter `python -m http.server 8000`.
   * With your server running, visit the site: `http://localhost:8000`

#### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future-proofing JavaScript code. 

### More Information

This project is a part from a Nanodegree Program done by Udacity (www.udacity.com). For any extra information, please, feel free to contact me.

### Contributions

The project was done completely by me starting from a basic code provided from Udacity. The starting code for a restaurant reviews website had a lot of issues. It was barely usable on a desktop browser, much less a mobile device. It also did not include any standard accessibility features, and it did not work offline at all. My job was to update the code to resolve these issues while still maintaining the included functionality.
