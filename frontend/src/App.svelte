<script>
import Map from "./lib/components/Map.svelte";
import Stats from "./lib/components/Stats.svelte";
import AddRun from "./lib/components/AddRun.svelte";
import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";
  let routes = $state([]);
  let routeExist = $derived(routes.length > 0 ? true : false);
  let currentRoute = $derived(routes.length > 0 ? routes[0] : null);
  let totalDistance = $derived(currentRoute?.totalDistance ?? 0);
  let currentRouteCoords = $derived(routes.length > 0 ? currentRoute.coordinates : null);
  
async function loadRoutes() {
  const res = await fetch("/api/routes");
  routes = await res.json();
}
onMount(async () => {
  await loadRoutes();
}) ;
</script>

<main>
<div class="leftPanel">
<Stats totalDistance={totalDistance}/>
<AddRun currentRouteCoords={currentRouteCoords} totalDistance={totalDistance} routeId = {currentRoute.id}/>
</div>
<Map currentRoute={currentRoute} routeExist={routeExist}></Map>

<!--
<h1>{routeExist + " dat"}</h1>
<p>{JSON.stringify(currentRoute)}</p> 
<p>{JSON.stringify(routes)}</p>
-->
</main>

