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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const createDefaultAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        const adminEmail = 'admin@example.com';
        const adminPassword = 'adminPassword123';
        const existingAdmin = yield User_1.default.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = yield bcryptjs_1.default.hash(adminPassword, 10);
            const newAdmin = new User_1.default({
                name: 'Default Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                isDefaultAdmin: true
            });
            yield newAdmin.save();
            console.log('Default admin created successfully');
        }
        else {
            console.log('Default admin already exists');
        }
        mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error creating default admin:', error);
    }
});
createDefaultAdmin();
