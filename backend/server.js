const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const raceRoutes = require("./routes/raceRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/races", raceRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});