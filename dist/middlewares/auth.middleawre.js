"use strict";
// src/middleware/authMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth = async (req, res, next) => {
    // const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.header('Authorization') || req.header('Authorization')?.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // console.log(decoded)
        const user = await user_model_1.default.findById(decoded.userId);
        // console.log(user)
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
exports.auth = auth;
const checkRole = (role) => {
    return (req, res, next) => {
        const user = req.user;
        console.log(user);
        if (!user.roles.includes(role)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    };
};
exports.checkRole = checkRole;
