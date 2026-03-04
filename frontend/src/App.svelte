<script>
import Map from "./lib/components/Map.svelte";
import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";
  let routes = $state([]);
  let routeExist = $derived(routes.length > 0 ? true : false);
  let currentRoute = $derived(routes.length > 0 ? routes[0] : null);



  
async function loadRoutes() {
  const res = await fetch("/api/routes");
  routes = await res.json();
}
onMount(async () => {
  await loadRoutes();
}) ;
</script>
<Map currentRoute={currentRoute} routeExist={routeExist}></Map>
<hr />
<h1>{routeExist + " dat"}</h1>
<p>{JSON.stringify(currentRoute)}</p>
<p>{JSON.stringify(routes)}</p>
<main>

</main>

