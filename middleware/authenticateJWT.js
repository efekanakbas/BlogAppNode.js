const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // If there is no Authorization header
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized - Token not provided" });
  }

  // Split the header to get the token part
  const [bearer, token] = authHeader.split(' ');

  // If the header is not formatted correctly
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized - Invalid Authorization header format" });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ message: "Forbidden - Invalid token"});
    }

    // Everything is OK
    req.user = user;// User objesini konsola yazdır
    next();
  });
};

module.exports = authenticateJWT;
