"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleawre_1 = require("../middlewares/auth.middleawre");
const book_model_1 = __importDefault(require("../models/book.model"));
const bookRouter = (0, express_1.Router)();
// Get all books
bookRouter.get('/', auth_middleawre_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userRoles = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.roles) || [];
        // console.log(userRoles)
        let books = [];
        if (userRoles.includes('VIEW ALL')) {
            books = yield book_model_1.default.find();
        }
        else if (userRoles.includes('VIEWER')) {
            books = yield book_model_1.default.find({ createdBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
        }
        res.json({ books });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Create a book
bookRouter.post('/', auth_middleawre_1.auth, (0, auth_middleawre_1.checkRole)('CREATOR'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { title, author } = req.body;
        const createdBy = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const newBook = new book_model_1.default({ title, author, createdBy });
        yield newBook.save();
        res.status(201).json({ message: 'Book created successfully', book: newBook });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
// Get books based on query params
bookRouter.get('/search', auth_middleawre_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { old, new: isNew } = req.query;
        let books = [];
        if (old === '1') {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            books = yield book_model_1.default.find({ createdAt: { $lte: tenMinutesAgo } });
        }
        else if (isNew === '1') {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            books = yield book_model_1.default.find({ createdAt: { $gte: tenMinutesAgo } });
        }
        res.json({ books });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = bookRouter;
