import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }
  

  // because of cookie parser we able to use this here
  let token = req.cookies.jwt;
  console.log('Auth middleware - req.cookies:', req.cookies);
  console.log('Auth middleware - JWT token:', token);

  // cookie present
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // this userID come from generate token
      // when we use jwt.sign we pass payload as userId and now we can access it here
      // this user will contain full bj including password we dont want to send it so we
      // remove it using -passowrd
      req.user = await User.findById(decoded.userId).select("-password");
      console.log('Auth middleware - Found user:', req.user ? req.user._id : 'No user found');

      if (!req.user) {
        res.status(401);
        throw new Error("Not Authorized, user not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized , Invalid Token ");
    }
  } else {
    // no token present
    res.status(401);
    throw new Error("Not Authorized , no Token ");
  }
});

export { protect };
