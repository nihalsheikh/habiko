import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/user.model";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/envConfig";
import { handleControllerError } from "../utils/response";

// JWToken Expiry
const signToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: (JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "30d",
  });
};

// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email and Password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      avatar: name.charAt(0).toUpperCase(),
    });

    const token = signToken(user._id.toString());
    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    return handleControllerError(res, error, "Registration failed");
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id.toString());
    res.status(200).json({ message: "Login Successful", user, token });
  } catch (error) {
    return handleControllerError(res, error, "Login Failed");
  }
};

// User Profile
export const me = async (req: Request, res: Response) => {
  res.status(200).json({ user: req.user });
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, morningMotivation } = req.body;
    if (name !== undefined) {
      user.name = name.trim();
      user.avatar = name.trim().charAt(0).toUpperCase();
    }

    if (morningMotivation !== undefined)
      user.morningMotivation = morningMotivation;

    await user.save();
    res
      .status(200)
      .json({ message: "User profile updated successfully", user });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Failed to update the user profile",
    );
  }
};
