import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract token from "Bearer eyJhbG..."
      token = req.headers.authorization.split(" ")[1];

      // Verify the token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request object (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Token is valid, continue to the route
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not allowed to access this route`,
      });
    }
    next();
  };
};
