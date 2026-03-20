
<script>
import Map from "./lib/components/Map.svelte";
import Stats from "./lib/components/Stats.svelte";
import AddRun from "./lib/components/AddRun.svelte";
import PreviousRuns from "./lib/components/PreviousRuns.svelte";
import SignUp from "./lib/components/SignUp.svelte";
import LogIn from "./lib/components/LogIn.svelte";
import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";
  
  let routes = $state([]);
  let routeExist = $derived(routes.length > 0 ? true : false);
  let currentRoute = $derived(routes.length > 0 ? routes[0] : null);
  let totalDistance = $derived(currentRoute?.totalDistance ?? 0);
  let currentRouteCoords = $derived(routes.length > 0 ? currentRoute.coordinates : null);
  let loading = $state(true);
  let showLogin = $state(true); 
  let isLoggedIn = $state(false);

  async function loadRoutes() {
  try {
    const res = await fetch("http://localhost:3001/api/routes", { credentials: "include" });
    
    if (res.ok) {
      const data = await res.json();
      routes = data;
      isLoggedIn = true;
    } else {
      // Om vi inte är inloggade hamnar vi här
      routes = [];
      isLoggedIn = false;
    }
  } catch (err) {
    console.error("Nätverksfel eller JSON-fel:", err);
    isLoggedIn = false;
  } finally {
    loading = false; // Detta garanterar att "Laddar..." försvinner
  }
}

async function logout() {
    await fetch("http://localhost:3001/api/logout", { 
      method: "POST", 
      credentials: "include" 
    });
    window.location.reload(); // Skickar oss tillbaka till inloggningsskärmen
  }

onMount(async () => {
  await loadRoutes();
}) ;


</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<main>
  {#if loading}
    <div class="loader">
      <p><i class="fa-solid fa-spinner fa-spin"></i> Laddar...</p>
    </div>

  {:else if isLoggedIn} <div class="app-container">
      <div class="leftPanel">
        {#if routes.length > 0}
          <Stats totalDistance={totalDistance}/>
          <AddRun routeId={currentRoute.id}/>
          <PreviousRuns/>
          <button class="logoutBtn" onclick={logout}>Logout</button>
        {/if}
      </div>
      
      <Map currentRoute={currentRoute} routeExist={routeExist}></Map>

    </div>

  {:else}
    <div class="authContainer">
      {#if showLogin}
        <LogIn />
        <p>Inget konto? <button class="linkBtn" onclick={() => showLogin = false}>Registrera dig</button></p>
      {:else}
        <SignUp />
        <p>Har du konto? <button class="linkBtn" onclick={() => showLogin = true}>Logga in</button></p>
      {/if}
    </div>
  {/if}

<!--
<h1>{routeExist + " dat"}</h1>
<p>{JSON.stringify(currentRoute)}</p> 
<p>{JSON.stringify(routes)}</p>
-->
</main>

