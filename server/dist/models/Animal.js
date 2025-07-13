"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AnimalSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 0, max: 1000 },
    weight: { type: Number, required: true, min: 0, max: 150 },
    breed: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "Breed", required: true },
    animalType: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "AnimalType", required: true },
    documents: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "Document" }],
    injections: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "Injection" }],
    gender: { type: String, enum: ["male", "female", "unknown"] },
    chipId: { type: String, unique: true },
    birthDate: { type: Date, required: true },
    registeredAt: { type: Date, default: Date.now() },
    isSterilized: { type: Boolean, required: true },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    avatar: { type: String, required: true, unique: true },
    notes: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "Note" }],
    status: { type: String, enum: ["active", "archived"], default: "active" },
});
exports.default = mongoose_1.default.model("animal", AnimalSchema);
