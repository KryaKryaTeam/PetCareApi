import mongoose from "mongoose";
import type { ObjectId } from "mongoose";
import type { Document } from "mongoose";

export type animal_gender = "male" | "female" | "unknown";
export type animal_status = "active" | "archived";

export interface IAnimal {
  name: string;
  weight: number;
  breed: string;
  animalType: string;
  birthDate: Date;
  isSterilized: boolean;
  owner: string;
  avatar: string;
  documents?: string[];
  injections?: string[];
  gender: animal_gender;
  chipId?: string;
  registeredAt: Date;
  notes?: string[];
  status: animal_status;
}

export interface IAnimalModel extends Document {
  name: string;
  weight: number;
  breed: ObjectId;
  animalType: ObjectId;
  birthDate: Date;
  isSterilized: boolean;
  owner: ObjectId;
  avatar: string;
  documents?: ObjectId[];
  injections?: ObjectId[];
  gender: animal_gender;
  chipId?: string;
  registeredAt: Date;
  notes?: ObjectId[];
  status: animal_status;
}

const AnimalSchema = new mongoose.Schema<IAnimalModel>({
  name: { type: String, required: true },
  weight: { type: Number, required: true, min: 0, max: 150 },
  breed: { type: mongoose.SchemaTypes.ObjectId, ref: "Breed", required: true },
  animalType: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Animaltype",
    required: true,
  },
  documents: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Document" }],
  injections: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Injection" }],
  gender: {
    type: String,
    enum: ["male", "female", "unknown"],
    required: true,
    default: "unknown",
  },
  chipId: { type: String, unique: true },
  birthDate: { type: Date, required: true },
  registeredAt: { type: Date, default: Date.now() },
  isSterilized: { type: Boolean, required: true, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  avatar: { type: String, required: true, default: "none" },
  notes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Note" }],
  status: { type: String, enum: ["active", "archived"], default: "active" },
});

export default mongoose.model<IAnimalModel>("animal", AnimalSchema);
