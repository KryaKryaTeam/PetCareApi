import mongoose from "mongoose"

export interface IBannedToken {
    sessionId: string
    familyId: string
    createdAt: Date
}

export interface IBannedTokenModel extends Document {
    sessionId: string
    familyId: string
    createdAt: Date
}

const BannedTokenSchema = new mongoose.Schema<IBannedTokenModel>({
    sessionId: { type: String, required: true },
    familyId: { type: String, required: true, unqiue: true },
    createdAt: { type: Date, default: new Date() },
})

export default mongoose.model<IBannedTokenModel>("BannedToken", BannedTokenSchema)
