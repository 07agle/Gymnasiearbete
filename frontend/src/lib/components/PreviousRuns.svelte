<script>
    import { onMount } from "svelte";
    
    let runs = $state([]);
    let runObject = $state([]);
    
    async function loadRuns() {
      const res = await fetch("/api/runs");
      runs = await res.json();
      renderRuns();
    }
    
    onMount(() => {
      loadRuns();
    });
    
    $effect(() => {

    });
    function renderRuns(){
      runs.forEach(run => {
        runObject.push([
          run.distance,
          run.runDate
        ]);
      });
    }
    </script>
    
    <div class="runsContainer">
    <header>   
        <h3>Löphistorik</h3>
    </header>

        {#each runs as run}
        <div class="runCard">
        <i class="fas fa-calendar"></i>
        <div class="runInfo">
        <p class="date">{new Date(run.runDate).toLocaleDateString("sv-SE", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}</p>
        <p>{run.distance} m</p>
    </div>
    <i class="fas fa-trash-can"></i>
    </div>
      {/each}
    
    </div>

    <style>
    .runsContainer {
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

  h3{
    border-bottom: 2px #999999 solid;
    margin-bottom: 0.5rem;
  }

  .runCard{
    display: flex;
    align-items: center;

     background-color: #f0f0f0d2;
     margin-top: 1rem;
     border-radius: 1rem;
     transition: 0.2s ease;
  }
  .fa-calendar{
    margin-right: 1rem;
    margin-left: 1rem;
    color: orange;
  }
  .fa-trash-can{
    display: none;
    margin-right: 1rem;
    margin-left: auto;
    color: rgb(250, 60, 60);
    cursor: pointer;
  }

  .runCard:hover{
    background-color: #dfdfdfd2;
  }

  .runCard:hover .fa-trash-can {
  display: block;
}
  .date{
    font-weight: bold;
  }
    </style>