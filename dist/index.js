"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleawre_1 = require("./middlewares/auth.middleawre");
const book_routes_1 = __importDefault(require("./routes/book.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
// MongoDB Connection
(0, db_1.connection)();
// Default route
app.get('/', (req, res) => {
    res.send('Library App API');
});
app.use('/auth', auth_routes_1.default);
app.use(auth_middleawre_1.auth);
app.use('/books', book_routes_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
