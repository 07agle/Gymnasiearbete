<script>
  let { currentRouteCoords, totalDistance } = $props();
  let distanceRun = $state(0);
  let date = $state("");
  //Funktion som räknar ut närmsta koordinaten vid den distansen du matade in
  function getCoordinateAtDistance(currentRouteCoords, distanceRun) {
    let distanceCalculated = 0;
    let coordinateRunTo;
    for (let i = 1; i < currentRouteCoords.length; i++) {
      if (distanceCalculated < distanceRun) {
        distanceCalculated += currentRouteCoords[i].distanceTo(
          currentRouteCoords[i - 1]
        );
      } else if (distanceCalculated >= distanceRun) {
        coordinateRunTo = currentRouteCoords[i];
        break;
      }
    }
}

async function submitRun(event) {
    event.preventDefault();
    //Skapar ett objekt som sedan skickas till backend för att läggas in i databasen
    const run = {
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
  <input type="number" min="1" bind:value={distanceRun}/>
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
    background-color: orange;
    color: white;
    font-size: 14px;
    cursor: pointer;
  }
</style>
