<script>
  import { onMount } from "svelte";

  let runs = $state([]);
  let runObject = $state([]);

  async function loadRuns() {
    const res = await fetch("http://localhost:3001/api/runs", { credentials: "include" });
    runs = await res.json();
    renderRuns();
  }

  onMount(() => {
    loadRuns();
  });

  function renderRuns() {
    runs.forEach((run) => {
      runObject.push([run.distance, run.runDate]);
    });
  }

  async function deleteRun(id) {
    const res = await fetch(`http://localhost:3001/api/runs/${id}`, {
      method: "DELETE",
      credentials: "include" // Viktigt för att servern ska veta vem du är
    });

    if (res.ok) {
      runs = runs.filter((run) => run.id !== id);
      location.reload();
    }
  }
</script>

<div class="runsContainer">
  <header>
    <h3>Löphistorik</h3>
  </header>
  <div class="runCardContainer">
    {#each runs as run}
      <div class="runCard">
        <i class="fas fa-calendar"></i>
        <div class="runInfo">
          <p class="date">
            {new Date(run.runDate).toLocaleDateString("sv-SE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>{Math.round(run.distance / 1000)} km</p>
        </div>
        <i class="fas fa-trash-can" onclick={() => deleteRun(run.id)}></i>
      </div>
    {/each}
  </div>
</div>

<style>
  .runsContainer {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-height: 50%;
    height: fit-content;

    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    font-family: system-ui, sans-serif;
  }
  .runCardContainer {
    overflow-y: auto;
    max-height: 100%;
  }

  h3 {
    border-bottom: 2px #999999 solid;
    margin-bottom: 0.5rem;
  }

  .runCard {
    display: flex;
    align-items: center;

    background-color: #f0f0f0d2;
    margin-top: 1rem;
    border-radius: 7px;
    transition: 0.2s ease;
    padding: 0.3rem;
  }
  .fa-calendar {
    margin-right: 1rem;
    margin-left: 1rem;
    color: orange;
  }
  .fa-trash-can {
    display: none;
    margin-right: 1rem;
    margin-left: auto;
    color: rgb(250, 60, 60);
    cursor: pointer;
  }

  .runCard:hover {
    background-color: #dfdfdfd2;
  }

  .runCard:hover .fa-trash-can {
    display: block;
  }
  .date {
    font-weight: bold;
  }
</style>
