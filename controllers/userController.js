import {
  fetchAllUsers,
  fetchUserById,
  createUser,
  authenticateUser,
  getUserCountFromDB,
} from "../services/userService.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await fetchUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const savedUser = await createUser(req.body);
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { token, user } = await authenticateUser(req.body);
    res.status(200).json({ message: "User authenticated", token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserCount = async (req, res) => {
  try {
    const count = await getUserCountFromDB();
    res.send({ userCount: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
