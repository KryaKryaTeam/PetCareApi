"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true, min: 1, max: 150 },
    icon: {
        type: String,
        required: true,
        default: "%backend%/images/baseicon.png",
    },
    breeds: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "Breed" }],
});
exports.default = mongoose_1.default.model("animaltype", schema);
