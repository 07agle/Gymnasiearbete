<script>
     let { totalDistance, distanceRun } = $props();
     let progress = $state(0);
     let distanceLeft = $state(0);

     function calculateProgress() {
        distanceLeft = totalDistance - distanceRun;
        if(totalDistance > 0){
            progress = Math.round((distanceRun / totalDistance)*100);
        }
     }

     $effect(() => {
        calculateProgress();
     });
</script>

<div class="statsContainer">
    <p><b>Total distance: </b> {totalDistance}m</p>
    <p><b>Distance run so far: </b> {distanceRun}m</p>
    <p><b>Distance left: </b> {distanceLeft}m</p>
    <div class="progressContainer">
        <div class="progressBar" style="width: {progress}%;">{progress}%</div>
    </div>
</div>

<style>
  .statsContainer{
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
  height: fit-content;

  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  font-family: system-ui, sans-serif;
}

p{
  margin: 0;
  font-size: 1em;
}

.progressContainer{
  margin-top: 1rem;
  width: 100%;
  border: 1px solid black;
  border-radius: 7px;
  overflow: hidden;
}

.progressBar{
    text-align: right;
    background-color: orange;
    padding-right: 1rem;
    color: white;
}

</style>