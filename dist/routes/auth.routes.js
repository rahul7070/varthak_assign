"use strict";
// src/routes/authRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authRouter = (0, express_1.Router)();
authRouter.post("/register", async (req, res) => {
    const { username, password, roles } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await user_model_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = new user_model_1.default({
            username,
            password: hashedPassword,
            roles: roles || ["VIEWER"], // Default role if not provided
        });
        await newUser.save();
        res.json({ msg: "User Register" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ msg: "Login Sucessful", token });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = authRouter;
