import mongoose from "mongoose"

export interface IRecomendation {
    name: String
    content: String
}

export interface IBreed {
    name: String
    recomendations: IRecomendation[]
    createdAt: Date
}

export interface IBreedModel extends Document {
    name: String
    recomendations: IRecomendation[]
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
    createdAt: { type: Date, default: new Date() },
})

export default mongoose.model<IBreedModel>("Breed", BreedSchema)
