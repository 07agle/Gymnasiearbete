import express from "express";
import cors from "cors";
import * as mariadb from "mariadb";
import bcrypt from "bcrypt";           
import session from "express-session"; 

const app = express();


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  name: "sid",
  secret: "hemlig-nyckel",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  },
}));

//Starta servern
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`The server is running on port ${PORT}`);
});

// Skapar en connection pool till MariaDB
const pool = mariadb.createPool({
  host: "mariadb",
  user: "root",
  password: "12345",
  connectionLimit: 5,
  database: "gymnasiearbete",
});

// SQL-query för att spara en route
// id är AUTO_INCREMENT, skickas INTE in
const insertMainRouteSql = `
  INSERT INTO routes (uid, startLat, startLng, endLat, endLng, totalDistance, dateCreated) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  // GET: Hämta alla routes
  app.get("/api/routes", async (req, res) => {
    try {
      if(!req.session.userId){
        return res.status(400).json({ error: "Missing data" });
      }
      const rows = await pool.query("SELECT * FROM routes WHERE uid =?",[req.session.userId]);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    }
});
// POST: Spara ny route
app.post("/api/routes", async (req, res) => {
  // Skapar ett route-objekt från datan som skickats från frontend
  const route = {
    startCoordinate: req.body.startCoordinate,
    endCoordinate: req.body.endCoordinate,
    date: req.body.date,
    totalDistance: req.body.totalDistance,
  };

 // Enkel validering – säkerställer att koordinater finns
  if (!route.startCoordinate || !route.endCoordinate) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

    // Kör INSERT-query och sparar routen i databasen
  await pool.query(insertMainRouteSql, [
    req.session.userId,
    route.startCoordinate.lat,
    route.startCoordinate.lng,
    route.endCoordinate.lat,
    route.endCoordinate.lng,
    Math.round(route.totalDistance),
    new Date(),
  ]);

  // Skickar tillbaka routen som bekräftelse till frontend
  res.status(201).json(route);

});

// GET: Hämta alla runs
app.get("/api/runs", async (req, res) => {
  try {
    const rows = await pool.query(`SELECT runs.* FROM runs 
      INNER JOIN routes ON runs.routeId = routes.id 
      WHERE routes.uid = ?`, [req.session.userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// POST: Spara ny run
app.post("/api/runs", async (req, res) => {
  const run = {
    routeId: req.body.routeId,
    distance: req.body.distance,
    date: req.body.date,
  };
  if (!run.routeId || !run.distance || !run.date) {
    return res.status(400).json({ error: "Missing run data" });
  }

  try {
    await pool.query(insertMainRunsSql, [
      run.routeId,
      run.distance,
      run.date,
    ]);

    res.status(201).json(run);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }

});

const insertMainRunsSql = `
  INSERT INTO runs (routeId, distance, runDate) VALUES (?, ?, ?)`;

  app.delete("/api/runs/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("DELETE FROM runs WHERE id = ?", [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Run not found" });
      }
  
      res.status(200).json({ message: "Run deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete run" });
    }
  });
  
  //Registrera användare:
  app.post("/api/register", async (req, res) => {
    const user = {
      username: req.body.username,
      password: req.body.password,
    };
   
    if (!user.username || !user.password) {
      return res.status(400).json({ error: "Missing user data" });
    }
  
    try {

      const existingUser = await pool.query("SELECT uid FROM users WHERE username = ?", [user.username]);

      if(existingUser.length > 0){
        return res.status(409).json({ error: "Username already taken" });
      }
      else{
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
  
        await pool.query(insertMainUsersSql, [
          user.username,
          user.password,
          new Date(),
        ]);
        res.status(201).json("Success user added");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    }
  
  });

  const insertMainUsersSql = `
  INSERT INTO users (username, password, dateCreated) VALUES (?, ?, ?)`;

  //Logga in
  app.post("/api/login", async (req, res) => {

    const user = {
      username: req.body.username,
      password: req.body.password,
    };

    if (!user.username || !user.password) {
      return res.status(400).json({ error: "Missing user data" });
    }

    try {
      const users = await pool.query("SELECT * FROM users WHERE username = ?",[user.username]);
      
      if(users.length === 0){
        return res.status(401).json({ error: "Wrong username or password" });
      }
      else {
        const foundUser = users[0];
        const passwordsMatch = await bcrypt.compare(user.password, foundUser.password);
        if(!passwordsMatch){
          return res.status(401).json({ error: "Wrong username or password" });
        }
        else{
          req.session.userId = foundUser.uid;
          if (!req.session.userId) {
            return res.status(401).json({ error: "Not logged in" });
          }
          else{
            return res.status(200).json({ message: "Login successful" });
          }
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    }
  });

  //Logga ut
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Kunde inte logga ut" });
    res.clearCookie('sid'); // Eller vad din cookie heter
    res.json({ message: "Utloggad" });
  });
});