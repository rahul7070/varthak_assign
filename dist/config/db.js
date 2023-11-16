"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection = async () => {
    try {
        await mongoose_1.default.connect(process.env.mongoDB || "");
        console.log('Connected to Database');
    }
    catch (error) {
        console.error('Error:', error);
    }
};
exports.connection = connection;
