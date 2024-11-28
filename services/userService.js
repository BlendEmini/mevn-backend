import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { hashPassword, generateToken } from "../helpers/authHelper.js";

export const fetchAllUsers = async () => {
  return await User.find().select("-passwordHash");
};

export const fetchUserById = async (id) => {
  return await User.findById(id).select("-passwordHash");
};

export const createUser = async (userData) => {
  const { password, ...rest } = userData;
  const hashedPassword = hashPassword(password);
  const newUser = new User({
    ...rest,
    passwordHash: hashedPassword,
  });
  return await newUser.save();
};

export const authenticateUser = async (credentials) => {
  const { email, password } = credentials;
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw new Error("Wrong email or password");
  }

  const token = generateToken(user);
  return { token, user: { ...user.toObject(), passwordHash: undefined } };
};

export const getUserCountFromDB = async () => {
  return await User.countDocuments();
};
