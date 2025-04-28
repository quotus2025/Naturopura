"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'farmer'], required: true },
    phoneNumber: String,
    address: String,
    farmSize: Number,
    cropTypes: [String],
    location: {
        latitude: Number,
        longitude: Number
    },
    isDefaultAdmin: { type: Boolean, default: false }
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', userSchema);
