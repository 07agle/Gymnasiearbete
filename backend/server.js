import express from "express";
import cors from "cors";
import * as mariadb from "mariadb";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
// id är AUTO_INCREMENT → skickas INTE in
const insertMainRouteSql = `
  INSERT INTO routes (uid, startLat, startLng, endLat, endLng, totalDistance, dateCreated) VALUES (?, ?, ?, ?, ?, ?, ?)`;


  // GET: Hämta alla routes
  app.get("/api/routes", async (req, res) => {
    try {
      // Hämtar alla routes från databasen
      const rows = await pool.query("SELECT * FROM routes");
      // Skickar datan som JSON till frontend
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
    1,
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
