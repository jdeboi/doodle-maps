const DEV_MODE = true;
let myMap, navMap;
const zoomMain = 14;
const zoomMini = 11.7;
const key = keys.mapbox;
let center;

let isDrawing = false;

if (DEV_MODE) {
  initMaps();
}

function initMaps() {
  showMaps();
  setCenter()
    .then(addMaps)
    .then(() => {
      isDrawing = true;
    })
    .catch((error) => {
      alert("Sorry, there was an error: " + error);
      console.log(error);
    })
}


////////////////////////////////////////////////////////////////////////////////////
// ADD MAPS
////////////////////////////////////////////////////////////////////////////////////

function addMaps() {
  if (DEV_MODE) console.log("adding maps");
  return Promise.all([addMainMap(center), addNavMap(center)]);
}

function addMainMap(center) {
  return new Promise((resolve, reject) => {
    mapboxgl.accessToken = key;
    myMap = new mapboxgl.Map({
      container: 'map',
      style: keys.mapboxStyle,
      center: center, // starting position
      zoom: zoomMain
    });
    myMap.dragRotate.disable();
    myMap.touchZoomRotate.disableRotation();
    myMap.on('load', () => {
      addLine("route", "#fff");
      resolve("loaded");
    })
  });

  // let boundFactor = 0.1;
  // let bounds = [[home[0] - boundFactor, home[1] - boundFactor], [home[0] + boundFactor, home[1] + boundFactor]];
  // myMap.setMaxBounds(bounds);

  // disable map rotation using right click + drag

}

function addNavMap(center) {
  return new Promise((resolve, reject) => {
    mapboxgl.accessToken = key;
    navMap = new mapboxgl.Map({
      container: 'navMap',
      style: 'mapbox://styles/jdeboi/cki7rn91i675t19l7ckudb7e5',
      center: [center.lng, center.lat],
      zoom: zoomMini
    });

    // disable map rotation using right click + drag
    navMap.dragRotate.disable();
    navMap.touchZoomRotate.disableRotation();

    navMap.on('click', function (e) {
      isDrawing = false;
      if (DEV_MODE) console.log("moving map");
      center = { lng: e.lngLat.wrap().lng, lat: e.lngLat.wrap().lat };
      navMap.flyTo({
        center: [center.lng, center.lat],
        zoom: zoomMini,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });

      myMap.flyTo({
        center: [center.lng, center.lat],
        zoom: zoomMain,
        essential: true
      });

      myMap.once('moveend', () => {
        if (DEV_MODE) console.log("done moving big map");
        isDrawing = true;
      })
    });

    navMap.on('load', () => {
      resolve("loaded");
    });
  });

}

////////////////////////////////////////////////////////////////////////////////////
// LOAD MAP CENTER
////////////////////////////////////////////////////////////////////////////////////

// try to get browser gps
// otherwise, return NOLA coords
async function setCenter() {
  // Will resolve after 5s
  let t = DEV_MODE ? 100 : 5000;
  let promiseTimeout = new Promise((resolve, reject) => {
    let wait = setTimeout(() => {
      clearTimeout(wait);
      center = getNolaCenter();
      resolve(center);
    }, t)
  })
  return Promise.race([
    promiseTimeout,
    setBrowserCenter()
  ]);
}

async function setBrowserCenter() {
  try {
    let position = await getPosition();
    if (DEV_MODE) console.log("POS", position);
    center = { lng: position.coords.longitude, lat: position.coords.latitude };
    return center;
  }
  catch (error) {
    console.log(error);
    center = getNolaCenter();
    return center;
  }
}

function getPosition(options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function getNolaCenter() {
  let homeLat = 29.9307079;
  let homeLon = -90.105797;
  return { lng: homeLon, lat: homeLat };
}

///
// path to coords


function setCoordinates(path) {
  // var metersPerPix = zoomLevelToDis(zoomMain, center[1]);
  var coords = [];
  var home = [center.lng, center.lat];
  for (var i = 0; i < path.segments.length; i++) {
    var p = path.segments[i];
    var dx = p._point._x - path.segments[0]._point._x;
    var dy = -(p._point._y - path.segments[0]._point._y);
    coords.push(getCoordFromPoint(home, zoomMain, dx, dy))
  }
  var numPoints = path.segments.length;
  if (numPoints > 24 * 5) numPoints = 24 * 5;

  var promises = [];
  for (var i = 0; i < numPoints; i += 24) {
    var points = coords.slice(i, i + 24);
    promises.push(loadDirections(points))
  }
  // console.log(promises);
  Promise.all(promises)
    .then(function (responses) {
      // console.log(JSON.parse(responses[0].responseText).routes[0].geometry.coordinates)
      var coordinates = [];
      console.log("num api calls", responses.length)
      for (var j = 0; j < responses.length; j++) {
        var directions = JSON.parse(responses[j].responseText);
        directions = directions.routes[0].geometry.coordinates;

        coordinates = coordinates.concat(directions);
      }

      updateLine("route", coordinates);
    })
}

///////////////////////////////////////////////////////////////////
// directions

// XHR requests
// https://gomakethings.com/promise-based-xhr/
function makeRequest(url, method) {

  // Create the XHR request
  var request = new XMLHttpRequest();

  // Return it as a Promise
  return new Promise(function (resolve, reject) {

    // Setup our listener to process compeleted requests
    request.onreadystatechange = function () {

      // Only run if the request is complete
      if (request.readyState !== 4) return;

      // Process the response
      if (request.status >= 200 && request.status < 300) {
        // If successful
        resolve(request);
      } else {
        // If failed
        reject({
          status: request.status,
          statusText: request.statusText
        });
      }

    };
    // Setup our HTTP request
    request.open(method || 'GET', url, true);

    // Send the request
    request.send();

  });
};

function loadDirections(coords) {
  let coordString = getCoordString(coords);
  let mode = 'walking';
  let url = 'https://api.mapbox.com/directions/v5/mapbox/' + mode + '/' + coordString;
  url += '?steps=true';
  url += '&geometries=geojson';
  url += '&continue_straight=true';
  url += '&access_token=' + mapboxgl.accessToken;
  return makeRequest(url)
}

function getCoordString(coords) {
  let coordString = "";
  for (var c = 0; c < coords.length; c++) {
    coordString += coords[c][0] + "," + coords[c][1];
    if (c != coords.length - 1) {
      coordString += ";"
    }
  }
  return coordString;
}

function addLine(id, color) {
  myMap.addLayer({
    "id": id,
    "type": "line",
    "source": {
      "type": "geojson",
      "data": {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": []
        }
      }
    },
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": color,
      "line-width": 8
    }
  });
}

function updateLine(id, coords) {
  if (DEV_MODE) console.log("coords", coords[0], coords[1])
  var geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: coords
    }
  };
  myMap.getSource(id).setData(geojson);
}

