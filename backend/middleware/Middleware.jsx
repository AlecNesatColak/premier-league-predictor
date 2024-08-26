const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const verified = jwt.verify(token.split(' ')[1], "your_secret_key");  // 'your_secret_key' should be your secret key
    req.user = verified;
    next();  // Pass to the next middleware/route
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Example of a protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route!" });
});
