import mongoose from "mongoose"
import type { ObjectId } from "mongoose"

export interface IAnimal {
    name: string
    age: number
    weight: number
    breed: string
    animalType: string
    birthDate: Date
    isSterilized: boolean
    owner: string
    avatar: string
    documents?: string[]
    injections?: string[]
    gender?: "male" | "female" | "unknown"
    chipId?: string
    registeredAt?: Date
    notes?: string[]
    status?: "active" | "archived"
}

export interface IAnimalModel extends Document {
    name: string
    age: number
    weight: number
    breed: ObjectId
    animalType: ObjectId
    birthDate: Date
    isSterilized: boolean
    owner: ObjectId
    avatar: string
    documents?: ObjectId[]
    injections?: ObjectId[]
    gender?: "male" | "female" | "unknown"
    chipId?: string
    registeredAt?: Date
    notes?: ObjectId[]
    status?: "active" | "archived"
}

const AnimalSchema = new mongoose.Schema<IAnimalModel>({
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 0, max: 1000 },
    weight: { type: Number, required: true, min: 0, max: 150 },
    breed: { type: mongoose.SchemaTypes.ObjectId, ref: "Breed", required: true },
    animalType: { type: mongoose.SchemaTypes.ObjectId, ref: "AnimalType", required: true },
    documents: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Document" }],
    injections: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Injection" }],
    gender: { type: String, enum: ["male", "female", "unknown"] },
    chipId: { type: String, unique: true },
    birthDate: { type: Date, required: true },
    registeredAt: { type: Date, default: Date.now() },
    isSterilized: { type: Boolean, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    avatar: { type: String, required: true, unique: true },
    notes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Note" }],
    status: { type: String, enum: ["active", "archived"], default: "active" },
})

export default mongoose.model<IAnimalModel>("animal", AnimalSchema)
