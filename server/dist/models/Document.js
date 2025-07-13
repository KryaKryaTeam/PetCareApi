"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FieldSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    data: { type: String, required: true },
    type: { type: String },
}, { _id: false });
const DocumentSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    animal: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Animal", required: true },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "archived"], default: "active" },
    fields: [FieldSchema],
});
exports.default = mongoose_1.default.model("Document", DocumentSchema);
