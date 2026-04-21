<script>
  let {routeId } = $props();
  let distanceRun = $state(0);
  let date = $state("");
  
async function submitRun() {
    //Skapar ett objekt som sedan skickas till backend för att läggas in i databasen
    const run = {
        routeId: routeId,
        distance: Number(distanceRun),
        date: date,
    };

    console.log("Sparad run:", run);

//Skicka POST-request till backend för att spara rutten i databasen
const res = await fetch("/api/runs", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(run),
});

const saved = await res.json();
console.log("Servern sparade:", saved);

  }
    /* console.log(coordinateRunTo);
    //Om det redan finns en marker så ta bort den
    if (currentMarker) {
      map.removeLayer(currentMarker);
    }
    currentMarker = L.marker(coordinateRunTo, { icon: runningIcon }).addTo(map);
    console.log("Current position:", coordinateRunTo);
  }*/

</script>

<form>
  <h3>Lägg till runda</h3>
  <p>Skriv in antalet meter du sprang:</p>
  <input type="number" min="1" bind:value={distanceRun}/>
  <p>Skriv in datumet: </p>
  <input type="date" bind:value={date}/>
  <button onclick={submitRun}>Submit</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: fit-content;
    padding: 1rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-family: system-ui, sans-serif;
  }

  h3{
    border-bottom: 2px #999999 solid;
    margin-bottom: 0.5rem;
  }

  input {
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-top: 1rem;
  }

  button {
    margin-top: 10px;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    background-color: #ffa600;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  button:hover{
    background-color: 
    #e69500;
  }
</style>
