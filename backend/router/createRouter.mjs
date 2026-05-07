import express from "express";
import bcrypt from "bcrypt";   
import { pool } from "../dataBase/connect.mjs";
import { insertMainRouteSql, insertMainRunsSql, insertMainUsersSql } from "../dataBase/router.mjs"; // Added import

const router = express.Router();


// POST: Spara ny route
router.post("/api/routes", async (req, res) => {
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

// POST: Spara ny run
router.post("/api/runs", async (req, res) => {
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

  //Registrera användare:
  router.post("/api/register", async (req, res) => {
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
  

  //Logga in
  router.post("/api/login", async (req, res) => {

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
  router.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Kunde inte logga ut" });
      res.clearCookie('sid'); // Eller vad din cookie heter
      res.json({ message: "Utloggad" });
    });
  });
  
  export default router;