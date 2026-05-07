import express from "express";
import { pool } from "../dataBase/connect.mjs";

const router = express.Router();

router.delete("/api/runs/:id", async (req, res) => {
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

  export default router;