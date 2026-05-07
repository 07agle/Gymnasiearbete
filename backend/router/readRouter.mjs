import express from "express";
import { pool } from "../dataBase/connect.mjs";

const router = express.Router();

  // GET: Hämta alla routes
  router.get("/api/routes", async (req, res) => {
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


// GET: Hämta alla runs
router.get("/api/runs", async (req, res) => {
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

  export default router;