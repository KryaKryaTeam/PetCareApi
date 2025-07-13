"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NoteSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        max: 2000,
    },
    author: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
exports.default = mongoose_1.default.model("Note", NoteSchema);
