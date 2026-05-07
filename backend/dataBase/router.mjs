import express from 'express'
import { pool } from './connect.mjs'

const router = express.Router();

 // SQL-query för att spara en route
// id är AUTO_INCREMENT, skickas INTE in
export const insertMainRouteSql = `
INSERT INTO routes (uid, startLat, startLng, endLat, endLng, totalDistance, dateCreated) VALUES (?, ?, ?, ?, ?, ?, ?)`;


export const insertMainRunsSql = `
INSERT INTO runs (routeId, distance, runDate) VALUES (?, ?, ?)`;

export const insertMainUsersSql = `
INSERT INTO users (username, password, dateCreated) VALUES (?, ?, ?)`;

export default router;