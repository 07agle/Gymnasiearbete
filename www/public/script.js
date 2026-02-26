const h1 = document.getElementById("h1");
const h2 = document.getElementById("h2");
const submitBtn = document.getElementById("submitBtn");
const distanceInput = document.getElementById("distanceInput");
const confirmRouteBtn = document.getElementById("confirmRouteBtn");

let map = L.map("map").setView([56.1424, 12.5136], 5);
let distanceRun = 0;
let routeSubmitted = false;

let runningIcon = L.icon({
  iconUrl: "currentLocationIcon.png", 
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 25,
  minZoom: 1,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  noWrap: true,
}).addTo(map);

let currentMarker = null;
let markerList = [];
let distance = 0;
let currentRouteCoords;
let routeControl;
let totalDistance = 0;
let routes = [];

function onMapClick(e) {

  if(routes.length == 0){

  
  let latClick = e.latlng.lat;
  let lngClick = e.latlng.lng;
  console.log(latClick, lngClick);

  let newMarker = L.marker([latClick, lngClick], {
   draggable: false
  }).addTo(map);

  markerList.push(newMarker);

  if (markerList.length > 2) {
    let oldMarker = markerList[0];
    routeControl.remove();
    map.removeLayer(oldMarker);
    markerList.shift();
  }

  if (markerList.length === 2) {
    let start = markerList[0].getLatLng();
    let end = markerList[1].getLatLng();

    drawRoute(start, end);
  }
}
}


function drawRoute(start, end){
  if (routeControl) {
    routeControl.remove();
  }

  routeControl = L.Routing.control({
    lineOptions: {
      styles: [{ color: "orange", weight: 4 }]
    },
    waypoints: [start, end],
    routeWhileDragging: false,
    show: false,
    addWaypoints: false,
    draggable: false,
    draggableWaypoints: false
  })
    .addTo(map)
    .on("routesfound", function (e) {
      let route = e.routes[0];
      currentRouteCoords = route.coordinates;
      console.log(currentRouteCoords);
      totalDistance = route.summary.totalDistance;
      h1.textContent = "Distans i km: " + (totalDistance / 1000).toFixed(2);
      h2.textContent = "Distans i meter: " + totalDistance;
      console.log("Distans (meter):", totalDistance);
      console.log("Distans (km):", (totalDistance / 1000).toFixed(2));
    });
}

function submitDistance() {
  if(routeSubmitted){
    let newDistance
    distanceRun = Number(distanceInput.value);
    if(distanceRun <= totalDistance){
     newDistance = Math.round(totalDistance - distanceRun);
     h1.textContent = "Distans i km: " + (newDistance / 1000).toFixed(2);
     h2.textContent = "Distans i meter: " + newDistance;
     getCoordinateAtDistance(currentRouteCoords, distanceRun);
    }
    else{
      h1.textContent = "För stort tal";
    }
  }
}

submitBtn.onclick = submitDistance;

map.on("click", onMapClick);


confirmRouteBtn.onclick = confirmRoute;


let boundsZoom1 = L.latLngBounds(
  [-85, -170], 
  [85, 170] 
);

function getCoordinateAtDistance(currentRouteCoords, distanceRun) {
  let distanceCalculated = 0;
  let coordinateRunTo;
  for (let i = 1; i < currentRouteCoords.length; i++) {
    if (distanceCalculated < distanceRun) {
      distanceCalculated += currentRouteCoords[i].distanceTo(
        currentRouteCoords[i - 1]);
    } else if (distanceCalculated >= distanceRun) {
      coordinateRunTo = currentRouteCoords[i];
      break;
    }
  }

  console.log(coordinateRunTo);
  if (currentMarker) map.removeLayer(currentMarker);
    currentMarker = L.marker(coordinateRunTo, { icon: runningIcon }).addTo(map);

  console.log("Current position:", coordinateRunTo);
}

async function confirmRoute(){
  if (!currentRouteCoords || markerList.length !== 2) {
    h1.textContent = "Välj två punkter först.";
    return;
  }
  else{
    routeSubmitted = true;
    map.off("click", onMapClick); 
  }
 
  const start = markerList[0].getLatLng();
  const end = markerList[1].getLatLng();

  const wholeRoute = {
    startCoordinate: start,
    endCoordinate: end,
    date: new Date().toLocaleDateString("sv-SE"),
    totalDistance,
  };

  confirmRouteBtn.style.display = "none";
  console.log("Sparad route:", wholeRoute);

  const res = await fetch("/api/routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(wholeRoute),
  });
  const saved = await res.json();
  console.log("Servern sparade:", saved);

  //Spara den originella hela rutten i en databas
}

/*Sedan ska man mata in:

Distans, datum osv och sen ska det sparas i en ny databas där och det ska visualiseras på kartan. Detta ska kunnas göra flera gånger om */


async function loadRoutes() {
  const res = await fetch("/api/routes");
  routes = await res.json();

  if(routes.length > 0){
    const route = routes[0];
    const start = L.latLng(route.startLat,route.startLng);
    const end = L.latLng(route.endLat, route.endLng);
    confirmRouteBtn.style.display = "none";
    drawRoute(start, end);
  }
  console.log(routes);
}

window.onload = () => {
  loadRoutes();
  h1.textContent = "Räknar ut route...";
};