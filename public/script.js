const resetBtn = document.getElementById("resetBtn");
const h1 = document.getElementById("h1");
const h2 = document.getElementById("h2");
const submitBtn = document.getElementById("submitBtn");
const distanceInput = document.getElementById("distanceInput");
const confirmRouteBtn = document.getElementById("confirmRouteBtn");

let map = L.map("map").setView([56.1424, 12.5136], 5);
let distanceRun = 0;
let routeSubmitted = false;

let runningIcon = L.icon({
  iconUrl: "currentLocationIcon.png", // exempelikon
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

function onMapClick(e) {
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
}

function resetMap() {
  if(!routeSubmitted){
    for (let i = 0; i < markerList.length; i++) {
      map.removeLayer(markerList[i]);
    }
    h1.textContent = "Distans i km: ";
    h2.textContent = "Distans i meter: ";
    if(routeControl){
      routeControl.remove();
    }
    markerList = [];
  }
}

function submitDistance() {
  if(routeSubmitted){
    let newDistance
    distanceRun = Number(distanceInput.value);
    if(distanceRun <= totalDistance){
     newDistance = totalDistance - distanceRun;
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

resetBtn.onclick = resetMap;

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

function confirmRoute(){
  routeSubmitted = true;
  map.off("click", onMapClick); 

  //Spara den originella hela rutten i en databas
}

/*Sedan ska man mata in:

Distans, datum osv och sen ska det sparas i en ny databas där och det ska visualiseras på kartan. Detta ska kunnas göra flera gånger om */

