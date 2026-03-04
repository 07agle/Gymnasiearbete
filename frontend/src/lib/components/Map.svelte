<script>
  import * as L from "leaflet";
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";
  import "leaflet-routing-machine";
  import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

  import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png?url";
  import markerIcon from "leaflet/dist/images/marker-icon.png?url";
  import markerShadow from "leaflet/dist/images/marker-shadow.png?url";

  const defaultIcon = L.icon({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [1, -28],
    shadowSize: [32, 32],
  });

  // Gör den till default för alla markers:
  L.Marker.prototype.options.icon = defaultIcon;
  let mapContainer;
  let map;
  let currentMarker = null;
  let markerList = [];
  let routeControl;
  let distance = 0;
  let currentRouteCoords;
  let totalDistance = $state(0);
  let routeSubmitted = $state(false);

  let { currentRoute, routeExist } = $props();

  onMount(() => {
    map = L.map(mapContainer).setView([56.1424, 12.5136], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 25,
      minZoom: 1,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      noWrap: true,
    }).addTo(map);

    map.on("click", onMapClick);
    loadRoutes();
  });

  $effect(() => {
    if (!map){
    return;}
    else{
        loadRoutes();
    }
  });

  //När man klickar på kartan
  function onMapClick(e) {
    //Kan bara klicka om en route inte är bestämd
    if (!routeExist) {
      //Sparar koordinaterna för klicket
      let latClick = e.latlng.lat;
      let lngClick = e.latlng.lng;
      console.log(latClick, lngClick);

      //Skapar ny marker där man klickar och lägger till på kartan
      let newMarker = L.marker([latClick, lngClick], {
        draggable: false,
      }).addTo(map);

      markerList.push(newMarker);

      //Om man klickar mer än 2 gånger så blir de de två senaste klicken som räknas
      if (markerList.length > 2) {
        let oldMarker = markerList[0];
        if (routeControl) {
          routeControl.remove();
          routeControl = undefined;
        }
        map.removeLayer(oldMarker);
        markerList.shift();
      }

      //Om det är två klick så tar den dn första och sista som start och slut och ritar rutten mellan dem
      if (markerList.length === 2) {
        let start = markerList[0].getLatLng();
        let end = markerList[1].getLatLng();

        drawRoute(start, end);
      }
    }
  }

  function drawRoute(start, end) {
    if (routeControl) {
      routeControl.remove();
      routeControl = undefined;
    }

    routeControl = L.Routing.control({
      //Attribut för rutten
      lineOptions: {
        styles: [{ color: "orange", weight: 4 }],
      },
      waypoints: [start, end],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggable: false,
      draggableWaypoints: false,
    })
      .addTo(map) //Lägger till rutten på kartan
      //När rutten hittas så räknar den ut den totala avståndet
      .on("routesfound", function (e) {
        let route = e.routes[0];
        currentRouteCoords = route.coordinates;
        console.log(currentRouteCoords);
        totalDistance = route.summary.totalDistance;
        console.log("Distans (meter):", totalDistance);
        console.log("Distans (km):", (totalDistance / 1000).toFixed(2));
      });
  }

  //Hämta sparade rutter från databasen när sidan startar
  function loadRoutes() {
    if (routeExist) {
      const start = L.latLng(currentRoute.startLat, currentRoute.startLng);
      const end = L.latLng(currentRoute.endLat, currentRoute.endLng);
      drawRoute(start, end);
    }
    console.log(currentRoute);
  }

  //Bekräftar routen och sparar den i databasen
  async function confirmRoute() {
    //Om det inte finns några koordinater eller inte två markers så måste man välja två först
    if (!currentRouteCoords || markerList.length !== 2) {
      return;
    }
    //Annars ska man inte kunna klicka på kartan något mer
    else {
      routeSubmitted = true;
      map.off("click", onMapClick);
    }

    const start = markerList[0].getLatLng();
    const end = markerList[1].getLatLng();

    //Skapar ett objekt som sedan skickas till backend för att läggas in i databasen
    const wholeRoute = {
      startCoordinate: start,
      endCoordinate: end,
      date: new Date().toLocaleDateString("sv-SE"),
      totalDistance,
    };

    console.log("Sparad route:", wholeRoute);

    //Skicka POST-request till backend för att spara rutten i databasen
    const res = await fetch("/api/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wholeRoute),
    });
    const saved = await res.json();
    console.log("Servern sparade:", saved);

    //Spara den originella hela rutten i en databas --- KLAR :D
  }
</script>

<main>
  <div id="mapContainer">
    {#if routeExist}
    <p>{(totalDistance/1000).toFixed(2)} km</p>
    {/if}
    {#if !routeExist && !routeSubmitted}
      <button onclick={confirmRoute}>Confirm Route</button>
    {/if}
    <div bind:this={mapContainer} class="map"></div>
  </div>
</main>

<style>
  .map {
    height: 100%;
    width: 100%;
    background-color: #AAD3DF;
  }
  button {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;

    padding: 8px 14px;
    font-size: 14px;
    border: none;
    border-radius: 6px;

    background: white;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  }

  #mapContainer {
    position: relative;
    height: 50vh;
    width: 50vw;
  }
</style>
