import jwt from "jsonwebtoken";

const generateToken = (userId, role, name) => {
  return jwt.sign(
    { id: userId, role, name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;
