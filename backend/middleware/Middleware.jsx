const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
  }

  console.log('Token received:', token); // Log the token

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err); // Log verification error
      return res.sendStatus(403); // Invalid token, Forbidden
    }
    req.user = user; // Attach decoded token data to req.user
    next();
  });
};

