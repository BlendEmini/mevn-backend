import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Hash password using bcrypt
export const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1W" }
  );
};
