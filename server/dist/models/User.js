"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SessionSchema = new mongoose_1.default.Schema({
    provider: { type: String, required: true, enum: ["google", "self"] },
    sessionId: { type: String, required: true },
    familyId: { type: String, required: true },
    device: { type: String },
    ip: { type: String },
    createdAt: { type: Date, default: new Date() },
    expiresAt: { type: Date },
    user: { type: mongoose_1.default.SchemaTypes.ObjectId, required: true },
}, { _id: false });
exports.UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, match: /^\S+@\S+\.\S+$/ },
    passwordHash: { type: String },
    isOAuth: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    animals: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Animal" }],
    avatar: { type: String, default: "%backend%/images/person_baseicon.png" },
    sessions: [SessionSchema],
    roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
    createdAt: { type: Date, default: new Date() },
    lastLogin: { type: Date },
});
exports.default = mongoose_1.default.model("User", exports.UserSchema);
