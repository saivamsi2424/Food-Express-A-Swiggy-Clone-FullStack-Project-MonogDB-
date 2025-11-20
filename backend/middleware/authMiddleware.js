import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ValidUser from "../models/ValidUser.js";

const protect = async (req, res, next) => {
  let token;

  // Check if the token is sent in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try finding the user in both collections
      let user = await User.findById(decoded.id).select("-password");
      if (!user) {
        user = await ValidUser.findById(decoded.id).select("-password");
      }

      // If no user found in either
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - no valid user found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(" Invalid token:", error.message);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
