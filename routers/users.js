import express from "express";
import User from "../models/user.js"; // Adjust the path if needed
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const usersRoute = express.Router();

// GET all users
usersRoute.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single user by ID
usersRoute.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
usersRoute.post("/register", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10), // Use a standard salt round
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser); // Return the created user
  } catch (error) {
    res.status(400).json({ message: error.message }); // Return an error message
  }
});
usersRoute.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("User not found");
  }

  // Check password
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    // Create JWT
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, // Payload
      process.env.JWT_SECRET, // Secret key from environment variable
      { expiresIn: "1W" } // Token expiration time
    );

    // Send token and user data (excluding passwordHash)
    res.status(200).json({
      message: "User authenticated",
      token,
      user: { ...user.toObject(), passwordHash: undefined }, // Exclude passwordHash
    });
  } else {
    res.status(400).send("Wrong email or password");
  }
});
usersRoute.get("/get/count", async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    res.send({
      userCount: userCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
export default usersRoute;
