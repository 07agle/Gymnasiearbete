const routes = [];
import express from "express"
import cors from "cors"


const app = express();

app.use(cors()) // Tillåter anrop från annan domän
app.use(express.urlencoded({extended: true})); // body urlencoded
app.use(express.json()) // body i json-formatet

app.use(express.static("public"));

app.listen(3000, () => {
    console.log("The server is running on http://localhost:3000");
})

app.get('/api/routes', function(req, res){
    res.json(routes)
 })
 
 app.get('/api/routes/:id', function(req, res){
    res.json(routes[(Number)(req.params.id) - 1])
 })
 
 app.post("/api/routes", (req, res) => {
   const route = {
     id: routes.length + 1,
     startCoordinate: req.body.startCoordinate,
     endCoordinate: req.body.endCoordinate,
     date: req.body.date,
     totalDistance: req.body.totalDistance,
   };
 
   routes.push(route);
   res.status(201).json(route);
 });
 