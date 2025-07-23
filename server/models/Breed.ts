import mongoose, { Types } from "mongoose"

export interface IRecomendation {
    name: string
    content: string
}

export interface IBreed {
    name: string
    recomendations: IRecomendation[]
    animalType: string
    createdAt: Date
}

export interface IBreedModel extends Document {
    name: string
    recomendations: IRecomendation[]
    animalType: Types.ObjectId
    createdAt: Date
}

const RecomendationSchema = new mongoose.Schema<IRecomendation>(
    {
        name: { type: String, required: true, unique: true, max: 100 },
        content: { type: String, required: true, max: 1000 },
    },
    { _id: false }
)

const BreedSchema = new mongoose.Schema<IBreedModel>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    recomendations: [RecomendationSchema],
    animalType: { type: mongoose.SchemaTypes.ObjectId, ref: "AnimalType", required: true },
    createdAt: { type: Date, default: new Date() },
})

export default mongoose.model<IBreedModel>("Breed", BreedSchema)
