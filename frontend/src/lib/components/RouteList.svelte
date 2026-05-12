<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import { mode } from "../stores/mode.svelte";
  import { selectedRoute } from "../stores/selectedRoute.svelte";

  let routes = $state([]);
  let displayName = $state();

  onMount(() => {
    loadRoutes();
  });

  async function loadRoutes() {
    const res = await fetch("/api/routes", { credentials: "include" });
    routes = await res.json();

    for (let route of routes) {
      let startCity = await getCity(route.startLat, route.startLng);
      let endCity = await getCity(route.endLat, route.endLng);

      route.displayName = startCity + " - " + endCity;
    }
  }

  async function getCity(lat, lng) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const data = await res.json();

    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      "Okänd plats"
    );
  }

  function addNewRoute(){
    mode.value = "create";
  }

  function clickRoute(route){ 
        selectedRoute.value = route;
        mode.value = "view";
  }
</script>

<div class="routesCardContainer">
  <h3>Dina rutter:</h3>
  <div class="routeListsContainer">
    {#each routes as route}
    <button onclick={() => clickRoute(route)}>
        <i class="fas fa-route"></i>
        {route.displayName}
      </button>
    {/each}
    <button onclick={addNewRoute}>+</button>
  </div>
</div>

<style>
  .routesCardContainer {
    max-height: 20%;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    height: fit-content;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-family: system-ui, sans-serif;
    margin-top: 2rem;
  }

  .routeListsContainer {
    overflow-y: auto;
    max-height: 100%;
    display: flex;
    flex-direction: column;
  }
  button {
    margin-top: 0.5rem;
    background-color: #f0f0f0d2;
    border: none;
  }

  button:hover {
    background-color: #dfdfdfd2;
  }
  h3 {
    border-bottom: 2px #999999 solid;
    margin-bottom: 0.5rem;
  }

  .fas{
    margin-right: 1rem;
    margin-left: 1rem;
    color: orange;
  }
</style>
