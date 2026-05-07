import express from "express";
import cors from "cors";
import session from "express-session"; 
import createRouter from "./router/createRouter.mjs";
import readRouter from "./router/readRouter.mjs";
import deleteRouter from "./router/deleteRouter.mjs";
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

app.use(createRouter);
app.use(readRouter);
app.use(deleteRouter);


//Starta servern
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`The server is running on port ${PORT}`);
});

