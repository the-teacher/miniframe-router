import express from "express";
import getRouter from "./routes"; // <<< DEFINE ROUTES

const app = express();
app.use(express.json());
app.use(getRouter()); // <<< APPLY ROUTES

app.listen(3000, () => {
  console.log("Demo app is running on http://localhost:3000");
});
