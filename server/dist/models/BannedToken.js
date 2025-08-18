"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleBannedToken = exports.SelfBannedToken = exports.BannedToken = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const opts = {
    discriminatorKey: "variant",
    timestamps: { createdAt: true, updatedAt: false },
};
const BannedTokenSchema = new mongoose_1.default.Schema({
    sessionId: { type: String, required: true },
}, opts);
exports.BannedToken = mongoose_1.default.model("BannedToken", BannedTokenSchema);
exports.SelfBannedToken = exports.BannedToken.discriminator("self", new mongoose_1.default.Schema({
    familyId: { type: String, required: true, unqiue: true },
}, opts));
exports.GoogleBannedToken = exports.BannedToken.discriminator("google", new mongoose_1.default.Schema({
    token: { type: String, required: true, unqiue: true },
}, opts));
