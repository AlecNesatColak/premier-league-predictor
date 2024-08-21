import express from "express";
import dotenv from "dotenv";
import axios from "axios";

import Prediction from "./models/predictions.js";
import { connectDB } from "./config/db.js";

import cors from "cors";

dotenv.config();


const app = express();

// Middleware to parse JSON body
app.use(express.json());
app.use(cors());

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
      return res.status(404).json({ success: false, message: "Prediction not found" });
    }

    res.status(200).json({ success: true, data: prediction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});



// Start the server and connect to the database
app.listen(5002, () => {
  connectDB();
  console.log("Server is running on http://localhost:5002");
});
