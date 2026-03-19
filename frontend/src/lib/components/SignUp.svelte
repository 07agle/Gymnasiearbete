<script>
  let username = $state("");
  let password = $state("");
  
  async function register(event) {
    event.preventDefault();
    const user = {
        username: username,
        password: password,

    }
    //Skicka POST-request till backend för att spara user i databasen
    const res = await fetch("http://localhost:3001/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const saved = await res.json();
    console.log("Servern sparade:", saved);
  }
</script>

<form onsubmit={register} >
  <h2>Sign Up</h2>
  <input type="text" placeholder="Username" required bind:value={username}/>
  <input type="password" placeholder="password" autocomplete="current-password" required bind:value={password} />
  <button type="submit">Submit</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    width: fit-content;
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
    font-size: 2em;
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
  button:hover {
    background-color: #e69500;
  }
  h2 {
    border-bottom: 2px #999999 solid;
  }
</style>
