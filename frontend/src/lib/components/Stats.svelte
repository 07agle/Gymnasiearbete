<script>
     import { onMount } from "svelte";
     let { totalDistance } = $props();
     let progress = $state(0);
     let distanceLeft = $state(0);
     let totalDistanceRun = $state(0);

     async function loadRuns() {
      totalDistanceRun = 0;
      const res = await fetch("http://localhost:3001/api/runs", { credentials: "include" });
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
<h3>Statistik</h3>
  <p><b>Total distance: </b> {Math.round(totalDistance/1000)}km</p>
  <p><b>Distance run so far: </b> {Math.round(totalDistanceRun/1000)}km</p>
  <p><b>Distance left: </b> {Math.round(distanceLeft/1000)}km</p>
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
  h3{
    border-bottom: 2px #999999 solid;
    margin-bottom: 0.5rem;
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
    background: #FFA600;
    background: linear-gradient(90deg,rgba(255, 166, 0, 1) 64%, rgba(255, 208, 0, 1) 100%);
    padding-right: 1rem;
    color: white;
    font-weight: bold;
  }
</style>
