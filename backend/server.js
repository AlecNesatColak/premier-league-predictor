import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import Prediction from "./models/predictions.js";
import { connectDB } from "./config/db.js";
import path from "path";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());

// API routes
app.post("/api/prediction", async (req, res) => {
  const { user, teams } = req.body;
  console.log(req.body);

  if (!user) {
    return res.status(400).send("User is required");
  }
  if (!teams) {
    return res.status(400).send("Prediction is required");
  }

  const newPrediction = new Prediction({ user, teams });

  try {
    await newPrediction.save();
    console.log("Prediction saved successfully");
    res.status(201).json({ success: true, data: newPrediction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/prediction/:user", async (req, res) => {
  const { user } = req.params;

  try {
    const prediction = await Prediction.findOne({ user });

    if (!prediction) {
      return res
        .status(404)
        .json({ success: false, message: "Prediction not found" });
    }

    res.status(200).json({ success: true, data: prediction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

const API_TOKEN = process.env.PREM_API_TOKEN;

// Route to fetch Premier League standings
app.get("/api/standings", async (req, res) => {
  try {
    const response = await axios.get(
      "http://api.football-data.org/v4/competitions/PL/standings",
      {
        headers: { "X-Auth-Token": API_TOKEN },
      }
    );
    res.json(response.data); // Send back the API response as JSON
  } catch (error) {
    console.error("Error fetching data:", error.message || error); // Log the error message
    res
      .status(500)
      .json({ message: "Error fetching data from Football Data API" });
  }
});

app.get("/api/matchweek", async (req, res) => {
  const matchday = req.query.matchday || 1; // Default to matchday 1 if not provided

  try {
    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/PL/matches?matchday=${matchday}`,
      {
        headers: { "X-Auth-Token": API_TOKEN },
      }
    );
    res.json(response.data); // Send back the API response as JSON
  } catch (error) {
    console.error("Error fetching data:", error.message || error); // Log the error message
    res
      .status(500)
      .json({ message: "Error fetching data from Football Data API" });
  }
});

// Serve the React front-end
const __dirname = path.resolve(); // Get the root directory of the project

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build", "index.html"));
});

// Start the server and connect to the database
app.listen(5002, () => {
  connectDB();
  console.log("Server is running on http://localhost:5002");
});
