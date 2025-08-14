"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RecomendationSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true, max: 100 },
    content: { type: String, required: true, max: 1000 },
}, { _id: false });
const BreedSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    recomendations: [RecomendationSchema],
    animalType: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "AnimalType", required: true },
    createdAt: { type: Date, default: new Date() },
});
exports.default = mongoose_1.default.model("Breed", BreedSchema);
