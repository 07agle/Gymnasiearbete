<script>
     import { onMount } from "svelte";
     let { totalDistance } = $props();
     let progress = $state(0);
     let distanceLeft = $state(0);
     let totalDistanceRun = $state(0);

     async function loadRuns() {
      totalDistanceRun = 0;
      const res = await fetch("/api/runs");
      const runs = await res.json();

    for (let run of runs) {
    totalDistanceRun += Number(run.distance);
  }
    calculateProgress();
  }
      function calculateProgress() {
        distanceLeft = Math.max(0, totalDistance - totalDistanceRun);
        if(totalDistance > 0){
          progress = Math.min(100, Math.round((totalDistanceRun / totalDistance) * 100));
        }
      }

  onMount(() => {
    loadRuns();
  });

  $effect(() => {
    calculateProgress();
  });
</script>

<div class="statsContainer">
  <p><b>Total distance: </b> {totalDistance}m</p>
  <p><b>Distance run so far: </b> {totalDistanceRun}m</p>
  <p><b>Distance left: </b> {distanceLeft}m</p>
  <div class="progressContainer">
    <div class="progressBar" style="width: {progress}%;">{progress}%</div>
  </div>
</div>

<style>
  .statsContainer {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    height: fit-content;

    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    font-family: system-ui, sans-serif;
  }

  p {
    margin: 0;
    font-size: 1em;
  }

  .progressContainer {
    margin-top: 1rem;
    width: 100%;
    border: 1px solid black;
    border-radius: 7px;
    overflow: hidden;
  }

  .progressBar {
    text-align: right;
    background-color: orange;
    padding-right: 1rem;
    color: white;
  }
</style>
