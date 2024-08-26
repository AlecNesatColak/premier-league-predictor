import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import Prediction from "./models/predictions.js";
import User from "./models/users.js";
import { connectDB } from "./config/db.js";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


dotenv.config();

const app = express();

// Middleware to parse JSON body
app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: false, // Allow credentials (cookies, tokens, etc.)
  })
);

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

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    // Create and save new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password); // user.password is the hashed password from the DB
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" }); // Replace 'your_secret_key' with an actual secret key
      //console.log("Token:", token);

    // Return the token to the client
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Attach decoded token data to req.user
    next();
  });
};
// Example protected route on the backend
app.get("/me", authenticateToken, async (req, res) => {
  try {
    // req.user contains the decoded JWT payload (userId, username)
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Return user-specific information
    res.json({ username: user.username});
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Serve the React front-end
const __dirname = path.resolve(); // Get the root directory of the project

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build", "index.html"));
});

const PORT = process.env.PORT
// Start the server and connect to the database
app.listen(PORT, () => {
  connectDB(); // Make sure the database is connected before serving requests
  console.log(`Server is running on port ${PORT}`);
});
