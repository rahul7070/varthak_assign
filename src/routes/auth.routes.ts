// src/routes/authRoutes.ts

import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User, { UserDocument } from "../models/user.model";

const authRouter = Router();
authRouter.post("/register", async (req, res) => {
  const { username, password, roles } = req.body;

  try {
    // Check if the user already exists
    const existingUser: UserDocument | null = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser: UserDocument = new User({
      username,
      password: hashedPassword,
      roles: roles || ["VIEWER"], // Default role if not provided
    });

    await newUser.save();

    res.json({ msg: "User Register" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user: any = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.json({ msg: "Login Sucessful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default authRouter;
