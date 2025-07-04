import mongoose from "mongoose"

export interface AnimalType {
    name: String
    icon: String
    breeds: String[]
}

const schema: mongoose.Schema<AnimalType> = new mongoose.Schema({
    name: { type: String, required: true, unique: true, min: 1, max: 150 },
    icon: { type: String, required: true, default: "%backend%/images/%baseicon%" },
    breeds: [{ type: String, min: 1, max: 150 }],
})

export default mongoose.model<AnimalType>("AnimalType", schema)
