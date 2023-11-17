"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleawre_1 = require("../middlewares/auth.middleawre");
const book_model_1 = __importDefault(require("../models/book.model"));
const bookRouter = (0, express_1.Router)();
// Get all books
bookRouter.get('/', auth_middleawre_1.auth, async (req, res) => {
    try {
        const userRoles = req.user?.roles || [];
        // console.log(userRoles)
        let books = [];
        if (userRoles.includes('VIEW ALL')) {
            books = await book_model_1.default.find();
        }
        else if (userRoles.includes('VIEWER')) {
            books = await book_model_1.default.find({ createdBy: req.user?._id });
        }
        res.json({ books });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Create a book
bookRouter.post('/', auth_middleawre_1.auth, (0, auth_middleawre_1.checkRole)('CREATOR'), async (req, res) => {
    try {
        const { title, author } = req.body;
        const createdBy = req.user?._id;
        const newBook = new book_model_1.default({ title, author, createdBy });
        await newBook.save();
        res.status(201).json({ message: 'Book created successfully', book: newBook });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Get books based on query params
bookRouter.get('/search', auth_middleawre_1.auth, async (req, res) => {
    try {
        const { old, new: isNew } = req.query;
        let books = [];
        if (old === '1') {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            books = await book_model_1.default.find({ createdAt: { $lte: tenMinutesAgo } });
        }
        else if (isNew === '1') {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            books = await book_model_1.default.find({ createdAt: { $gte: tenMinutesAgo } });
        }
        res.json({ books });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = bookRouter;
