import mongoose from "mongoose"
import type { ObjectId } from "mongoose"
import { Types } from "mongoose"

export interface IAnimalType {
    name: string
    icon: string
    breeds: string[]
}
export interface IAnimalTypeModel extends Document {
    name: string
    icon: string
    breeds: Types.ObjectId[]
}

const schema: mongoose.Schema<IAnimalTypeModel> = new mongoose.Schema({
    name: { type: String, required: true, unique: true, min: 1, max: 150 },
    icon: { type: String, required: true, default: "%backend%/images/baseicon.png" },
    breeds: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Breed" }],
})

export default mongoose.model<IAnimalTypeModel>("animaltype", schema)
