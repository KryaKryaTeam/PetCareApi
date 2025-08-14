"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectionRecord = exports.AdditionalInjection = exports.PlannedInjection = exports.Injection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const opts = {
    discriminatorKey: "variant",
    timestamps: { createdAt: true, updatedAt: false },
};
const InjectionBaseSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    note: { type: String },
}, opts);
exports.Injection = mongoose_1.default.model("Injection", InjectionBaseSchema);
exports.PlannedInjection = exports.Injection.discriminator("planned", new mongoose_1.default.Schema({
    breed: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Breed",
        required: true,
    },
    recommendedAtWeeks: { type: Number, required: true },
}, opts));
exports.AdditionalInjection = exports.Injection.discriminator("additional", new mongoose_1.default.Schema({
    animal: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Animal",
        required: true,
    },
    recommendedAtWeeks: { type: Number, required: true },
}, opts));
exports.InjectionRecord = exports.Injection.discriminator("record", new mongoose_1.default.Schema({
    animal: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Animal",
        required: true,
    },
    injectionRef: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Injection",
        required: true,
    },
    performedAt: { type: Date, required: true },
}, opts));
