import express from "express";
import cors from "cors";
import * as mariadb from "mariadb";

const routes = [];
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`The server is running on port ${PORT}`);
});

//Create connection to mariadb and the database
const pool = mariadb.createPool({
  host: "mariadb",
  user: "root",
  password: "12345",
  connectionLimit: 5,
  database: "gymnasiearbete",
});

const insertMainRouteSql = `
  INSERT INTO routes (uid, startLat, startLng, endLat, endLng, totalDistance, dateCreated) VALUES (?, ?, ?, ?, ?, ?, ?)`;

app.get("/api/routes", function (req, res) {
  res.json(routes);
});

app.get("/api/routes/:id", function (req, res) {
  res.json(routes[Number(req.params.id) - 1]);
});

app.post("/api/routes", async (req, res) => {
  const route = {
    id: routes.length + 1,
    startCoordinate: req.body.startCoordinate,
    endCoordinate: req.body.endCoordinate,
    date: req.body.date,
    totalDistance: req.body.totalDistance,
  };

  // enkel validering (bra att ha)
  if (!route.startCoordinate || !route.endCoordinate) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  await pool.query(insertMainRouteSql, [
    1,
    route.startCoordinate.lat,
    route.startCoordinate.lng,
    route.endCoordinate.lat,
    route.endCoordinate.lng,
    Math.round(route.totalDistance),
    new Date(),
  ]);

  routes.push(route);
  res.status(201).json(route);

});
